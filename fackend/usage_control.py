import hashlib
import hmac
import os
import re
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

import jwt


VISITOR_RE = re.compile(r"^[A-Za-z0-9._:-]{8,96}$")
TOKEN_ALG = "HS256"
TOKEN_DAYS = 30


class AIUsageError(Exception):
    def __init__(
        self,
        status_code: int,
        code: str,
        message: str,
        usage: Optional[Dict[str, Any]] = None,
        retry_after_seconds: Optional[int] = None,
    ):
        self.status_code = status_code
        self.code = code
        self.message = message
        self.usage = usage
        self.retry_after_seconds = retry_after_seconds
        super().__init__(message)

    def detail(self) -> Dict[str, Any]:
        payload = {"code": self.code, "message": self.message}
        if self.usage is not None:
            payload["usage"] = self.usage
        if self.retry_after_seconds is not None:
            payload["retry_after_seconds"] = self.retry_after_seconds
        return payload


def _env_int(name: str, default: int) -> int:
    try:
        return int(os.environ.get(name, str(default)))
    except (TypeError, ValueError):
        return default


def _env_bool(name: str, default: bool) -> bool:
    raw = os.environ.get(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


def _secret() -> str:
    return os.environ.get("USAGE_HASH_SECRET") or os.environ.get("GROQ_API_KEY") or "teonox-dev-usage-secret"


def _day_bucket(now: datetime) -> str:
    return now.astimezone(timezone.utc).strftime("%Y-%m-%d")


def _ten_minute_bucket(now: datetime) -> str:
    utc = now.astimezone(timezone.utc)
    minute = (utc.minute // 10) * 10
    return utc.replace(minute=minute, second=0, microsecond=0).isoformat()


def _hour_bucket(now: datetime) -> str:
    return now.astimezone(timezone.utc).replace(minute=0, second=0, microsecond=0).isoformat()


def _hash_value(value: str) -> str:
    return hmac.new(_secret().encode("utf-8"), value.encode("utf-8"), hashlib.sha256).hexdigest()


def _client_ip(request) -> str:
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()
    if getattr(request, "client", None) and getattr(request.client, "host", None):
        return request.client.host
    return "unknown"


def _normalize_visitor_id(raw: Optional[str], ip_hash: str) -> str:
    candidate = (raw or "").strip()
    if VISITOR_RE.match(candidate):
        return candidate
    return f"ip-{ip_hash[:16]}"


def create_ai_access_token(lead_id: str, email: str, audience_type: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": lead_id,
        "email_hash": _hash_value(email.lower().strip())[:32],
        "audience_type": audience_type,
        "scope": "ai_lead_unlock",
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(days=TOKEN_DAYS)).timestamp()),
    }
    return jwt.encode(payload, _secret(), algorithm=TOKEN_ALG)


def verify_ai_access_token(token: Optional[str]) -> Optional[Dict[str, Any]]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, _secret(), algorithms=[TOKEN_ALG])
    except Exception:
        return None
    if payload.get("scope") != "ai_lead_unlock":
        return None
    return payload


def _subject_from_request(request) -> Dict[str, Any]:
    ip_hash = _hash_value(_client_ip(request))
    token_payload = verify_ai_access_token(request.headers.get("x-ai-access-token"))
    return {
        "visitor_id": _normalize_visitor_id(request.headers.get("x-visitor-id"), ip_hash),
        "ip_hash": ip_hash,
        "lead_unlocked": bool(token_payload),
        "lead_id": token_payload.get("sub") if token_payload else None,
    }


def feature_daily_limit(kind: str, lead_unlocked: bool) -> int:
    if kind == "consultant":
        return _env_int("AI_CONSULTANT_LEAD_DAILY_LIMIT" if lead_unlocked else "AI_CONSULTANT_FREE_DAILY_LIMIT", 18 if lead_unlocked else 6)
    if kind == "job_risk":
        return _env_int("AI_JOB_RISK_LEAD_DAILY_LIMIT" if lead_unlocked else "AI_JOB_RISK_FREE_DAILY_LIMIT", 12 if lead_unlocked else 4)
    raise ValueError(f"unknown AI usage kind: {kind}")


async def _counter_value(db, key: str) -> int:
    doc = await db.ai_usage_counters.find_one({"_id": key})
    return int(doc.get("count", 0)) if doc else 0


async def _increment_counter(db, key: str, metadata: Dict[str, Any], now: datetime, expires_at: datetime) -> int:
    doc = await db.ai_usage_counters.find_one_and_update(
        {"_id": key},
        {
            "$inc": {"count": 1},
            "$setOnInsert": {
                **metadata,
                "created_at": now,
                "expires_at": expires_at,
            },
            "$set": {"updated_at": now},
        },
        upsert=True,
        return_document=True,
    )
    return int(doc.get("count", 0))


async def usage_snapshot(db, request, kind: str, now: Optional[datetime] = None) -> Dict[str, Any]:
    now = now or datetime.now(timezone.utc)
    subject = _subject_from_request(request)
    day = _day_bucket(now)
    limit = feature_daily_limit(kind, subject["lead_unlocked"])
    used = await _counter_value(db, f"feature:{kind}:{subject['visitor_id']}:{day}:{int(subject['lead_unlocked'])}")
    return {
        "kind": kind,
        "limit": limit,
        "remaining": max(limit - used, 0),
        "lead_required": (not subject["lead_unlocked"]) and used >= limit,
    }


async def check_and_record_ai_usage(db, request, kind: str, message: str, now: Optional[datetime] = None) -> Dict[str, Any]:
    now = now or datetime.now(timezone.utc)
    day = _day_bucket(now)
    subject = _subject_from_request(request)
    limit = feature_daily_limit(kind, subject["lead_unlocked"])

    if not _env_bool("AI_FEATURES_ENABLED", True):
        raise AIUsageError(503, "ai_disabled", "AI features are temporarily paused.")

    max_chars = _env_int("AI_MAX_INPUT_CHARS", 1500)
    if len(message or "") > max_chars:
        raise AIUsageError(
            413,
            "input_too_long",
            f"Please keep your message under {max_chars} characters.",
            {
                "kind": kind,
                "limit": limit,
                "remaining": 0,
                "lead_required": False,
            },
        )

    expires_at = now + timedelta(days=35)
    feature_key = f"feature:{kind}:{subject['visitor_id']}:{day}:{int(subject['lead_unlocked'])}"
    feature_used = await _counter_value(db, feature_key)
    usage = {
        "kind": kind,
        "limit": limit,
        "remaining": max(limit - feature_used, 0),
        "lead_required": (not subject["lead_unlocked"]) and feature_used >= limit,
    }
    if feature_used >= limit:
        raise AIUsageError(
            429,
            "feature_daily_limit",
            "This AI preview limit has been reached for today.",
            usage,
            retry_after_seconds=86400,
        )

    visitor_limit = _env_int("AI_VISITOR_10MIN_LIMIT", 10)
    visitor_key = f"visitor10:{subject['visitor_id']}:{_ten_minute_bucket(now)}"
    visitor_10min = await _increment_counter(
        db,
        visitor_key,
        {"kind": "visitor_10min", "visitor_id": subject["visitor_id"]},
        now,
        now + timedelta(minutes=20),
    )
    if visitor_10min > visitor_limit:
        raise AIUsageError(429, "visitor_rate_limit", "Please wait a few minutes before continuing.", usage, retry_after_seconds=600)

    ip_hour_limit = _env_int("AI_IP_HOURLY_LIMIT", 60)
    ip_hour_key = f"iphour:{subject['ip_hash']}:{_hour_bucket(now)}"
    ip_hour = await _increment_counter(
        db,
        ip_hour_key,
        {"kind": "ip_hour", "ip_hash": subject["ip_hash"]},
        now,
        now + timedelta(hours=2),
    )
    if ip_hour > ip_hour_limit:
        raise AIUsageError(429, "ip_hourly_limit", "AI previews are busy from this network. Please try again later.", usage, retry_after_seconds=3600)

    ip_day_limit = _env_int("AI_IP_DAILY_LIMIT", 200)
    ip_day_key = f"ipday:{subject['ip_hash']}:{day}"
    ip_day = await _increment_counter(
        db,
        ip_day_key,
        {"kind": "ip_day", "ip_hash": subject["ip_hash"], "day": day},
        now,
        expires_at,
    )
    if ip_day > ip_day_limit:
        raise AIUsageError(429, "ip_daily_limit", "This network has reached today's AI preview limit.", usage, retry_after_seconds=86400)

    global_limit = _env_int("AI_GLOBAL_DAILY_LIMIT", 1000)
    global_key = f"global:{day}"
    global_day = await _increment_counter(
        db,
        global_key,
        {"kind": "global_day", "day": day},
        now,
        expires_at,
    )
    if global_day > global_limit:
        raise AIUsageError(503, "global_daily_limit", "AI previews are at capacity for today. Please try again later.", usage, retry_after_seconds=86400)

    feature_used = await _increment_counter(
        db,
        feature_key,
        {
            "kind": "feature_daily",
            "feature_kind": kind,
            "visitor_id": subject["visitor_id"],
            "lead_unlocked": subject["lead_unlocked"],
            "day": day,
        },
        now,
        expires_at,
    )
    if feature_used > limit:
        raise AIUsageError(
            429,
            "feature_daily_limit",
            "This AI preview limit has been reached for today.",
            {
                "kind": kind,
                "limit": limit,
                "remaining": 0,
                "lead_required": not subject["lead_unlocked"],
            },
            retry_after_seconds=86400,
        )

    await db.ai_usage_events.insert_one(
        {
            "kind": kind,
            "visitor_id": subject["visitor_id"],
            "ip_hash": subject["ip_hash"],
            "lead_unlocked": subject["lead_unlocked"],
            "lead_id": subject["lead_id"],
            "day": day,
            "created_at": now,
        }
    )

    return {
        "kind": kind,
        "limit": limit,
        "remaining": max(limit - feature_used, 0),
        "lead_required": False,
    }
