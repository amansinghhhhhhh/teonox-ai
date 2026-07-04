"""Teonox.ai FastAPI backend.

Endpoints:
- GET  /api/                              -> health
- GET  /api/courses                       -> 7 pilot courses
- POST /api/leads                         -> capture masterclass signup
- GET  /api/leads                         -> (admin/dev) list recent leads
- POST /api/ai/course-consultant/message  -> consultant chat turn (chat + ranking)
- POST /api/ai/course-consultant/reset    -> drop session memory
- POST /api/ai/job-risk/message           -> job-risk chat turn (chat + risk obj)
- POST /api/ai/job-risk/reset             -> drop session memory
"""

from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import re
import uuid
import ssl
import threading
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Optional, Literal, Any, Dict
from pydantic import BaseModel, Field, ConfigDict, EmailStr

from courses_data import PILOT_COURSES
from ai_service import consultant_turn, job_risk_turn, forget_session
from usage_control import (
    AIUsageError,
    check_and_record_ai_usage,
    create_ai_access_token,
    usage_snapshot,
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# Mongo
mongo_url = os.environ["MONGO_URL"]
mongo_url = re.sub(r'[?&]tls(?:AllowInvalidCertificates|Insecure)=true', '', mongo_url)
client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=3000, tlsInsecure=True)
db = client[os.environ.get("DB_NAME", "teonox_ai")]

# SendGrid
SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY")
SENDER_EMAIL = os.environ.get("SMTP_FROM", "amansingh070823@gmail.com")

THANKYOU_SUBJECT = "Thank you for your interest \u2013 Team Teonox AI"
THANKYOU_BODY = """<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin:0; padding:0; font-family:Inter, system-ui, -apple-system, sans-serif; background:#f5f5f5; }
    .btn { display:inline-block; padding:13px 30px; background:linear-gradient(135deg,#EF7A17 0%,#E85F00 100%); color:#fff !important; text-decoration:none; border-radius:12px; font-size:15px; font-weight:600; }
    .social a { color:#E85F00; text-decoration:none; font-size:14px; font-weight:500; margin:0 4px; }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;margin:24px auto;background:#fff;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
    <tr><td style="padding:36px 28px 28px;">
      <h1 style="font-size:22px;font-weight:800;margin:0;letter-spacing:-0.3px;color:#111;">TEONOX AI</h1>
      <p style="font-size:12px;font-weight:600;color:#E85F00;letter-spacing:1.2px;text-transform:uppercase;margin:2px 0 0;">Learn. Apply. Lead.</p>
      <div style="height:1px;background:#e8e8e8;margin:20px 0;"></div>
      <p style="font-size:16px;font-weight:600;margin:0 0 8px;color:#111;">Hey {name}! 👋</p>
      <p style="font-size:15px;line-height:1.6;color:#444;margin:0 0 16px;">You just took the first step toward building real AI skills.</p>
      <div style="background:#fafafa;border-left:3px solid #E85F00;border-radius:6px;padding:14px 16px;margin:0 0 20px;font-size:14px;color:#444;line-height:1.7;">
        ✅ <strong>Interest noted:</strong> AI Chatbots Masterclass<br>
        📩 We&rsquo;ll email you the moment it goes live.
      </div>
      <p style="font-size:14px;color:#666;margin:0 0 8px;">Follow us on social media:</p>
      <p class="social" style="margin:0 0 24px;font-size:0;">
        <a href="#">Instagram</a>
        <span style="color:#ccc;margin:0 2px;">&middot;</span>
        <a href="#">Facebook</a>
        <span style="color:#ccc;margin:0 2px;">&middot;</span>
        <a href="#">Twitter / X</a>
        <span style="color:#ccc;margin:0 2px;">&middot;</span>
        <a href="#">LinkedIn</a>
      </p>
      <a class="btn" href="https://teonox.ai/courses">Explore all courses &rarr;</a>
      <div style="height:1px;background:#e8e8e8;margin:24px 0 16px;"></div>
      <p style="font-size:13px;color:#999;line-height:1.5;margin:0;">Keep learning,<br><strong style="color:#555;">Team Teonox AI</strong></p>
    </td></tr>
  </table>
</body>
</html>"""


def send_thankyou_email(to_email: str, name: str):
    if not SENDGRID_API_KEY:
        logger.info("SendGrid not configured, skipping email")
        return

    def _send():
        try:
            from sendgrid import SendGridAPIClient
            from sendgrid.helpers.mail import Mail
            message = Mail(
                from_email=SENDER_EMAIL,
                to_emails=to_email,
                subject=THANKYOU_SUBJECT,
                html_content=THANKYOU_BODY.replace("{name}", name),
            )
            sg = SendGridAPIClient(SENDGRID_API_KEY)
            sg.send(message)
            logger.info("Thank-you email sent to %s", to_email)
        except Exception:
            logger.warning("Failed to send thank-you email to %s. Verify '%s' is a verified sender in SendGrid dashboard (Settings > Sender Authentication > Single Sender Verification).", to_email, SENDER_EMAIL, exc_info=True)

    threading.Thread(target=_send, daemon=True).start()


# App + routers
app = FastAPI(title="Teonox.ai API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("teonox")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _serialize(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Drop Mongo _id and convert datetimes to ISO strings recursively."""
    if not isinstance(doc, dict):
        return doc
    out = {}
    for k, v in doc.items():
        if k == "_id":
            continue
        if isinstance(v, datetime):
            out[k] = v.isoformat()
        elif isinstance(v, dict):
            out[k] = _serialize(v)
        elif isinstance(v, list):
            out[k] = [_serialize(x) if isinstance(x, dict) else x for x in v]
        else:
            out[k] = v
    return out


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------

AudienceType = Literal["student", "professional", "business_owner", "parent"]


class LeadCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=6, max_length=20)
    audience_type: AudienceType
    interest: Optional[str] = Field(default="", max_length=600)
    source: Optional[str] = Field(default="home_masterclass", max_length=80)
    website: Optional[str] = Field(default="", max_length=200)
    form_started_at: Optional[float] = None


class Lead(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    audience_type: str
    interest: str
    source: str
    created_at: datetime
    ai_access_token: str


class ConsultantTurnIn(BaseModel):
    session_id: Optional[str] = None
    audience_type: AudienceType
    specialization: Optional[str] = ""
    message: str = Field(min_length=1, max_length=2000)
    is_first_turn: bool = False


class JobRiskTurnIn(BaseModel):
    session_id: Optional[str] = None
    role: Optional[str] = ""
    message: str = Field(min_length=1, max_length=2000)
    is_first_turn: bool = False


class ResetSessionIn(BaseModel):
    session_id: str


_VAGUE_RE = re.compile(r"^(hi|hello|hey|help|yes|yeah|ok|okay|idk|i don't know|not sure|student|professional|business owner|parent|ai)$", re.I)


def _word_count(text: str) -> int:
    return len(re.findall(r"[A-Za-z0-9]+", text or ""))


def _is_underqualified_consultant_message(message: str) -> bool:
    text = (message or "").strip().lower()
    if _VAGUE_RE.match(text):
        return True
    if _word_count(text) < 4 or len(text) < 18:
        return True
    signals = (
        "want", "need", "learn", "save", "grow", "job", "career", "business", "brand",
        "marketing", "design", "seo", "internship", "course", "skill", "ai", "work",
        "content", "sales", "instagram", "linkedin",
    )
    return not any(signal in text for signal in signals)


def _is_underqualified_job_risk_message(message: str) -> bool:
    text = (message or "").strip().lower()
    if _VAGUE_RE.match(text):
        return True
    if _word_count(text) < 4 or len(text) < 16:
        return True
    task_signals = (
        "write", "make", "create", "design", "call", "sell", "manage", "reply", "support",
        "post", "schedule", "analyze", "report", "code", "review", "edit", "research",
        "daily", "most days", "tools", "canva", "excel", "figma", "ads", "clients",
    )
    return not any(signal in text for signal in task_signals)


def _is_underqualified_job_role(role: str) -> bool:
    text = (role or "").strip().lower()
    return not text or _VAGUE_RE.match(text)


def _form_elapsed_seconds(started_at: Optional[float]) -> Optional[float]:
    if started_at is None:
        return None
    timestamp = float(started_at)
    if timestamp > 10_000_000_000:
        timestamp = timestamp / 1000
    return datetime.now(timezone.utc).timestamp() - timestamp


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@api_router.get("/")
async def root():
    return {"name": "teonox.ai", "status": "ok"}


@api_router.get("/courses")
async def get_courses():
    return {"courses": PILOT_COURSES}


@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate):
    if (payload.website or "").strip():
        raise HTTPException(status_code=400, detail="Invalid submission")
    min_seconds = int(os.environ.get("LEAD_MIN_FORM_SECONDS", "3"))
    elapsed = _form_elapsed_seconds(payload.form_started_at)
    if elapsed is None or elapsed < min_seconds:
        raise HTTPException(status_code=400, detail="Please try submitting the form again")

    lead_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    doc = {
        "id": lead_id,
        "name": payload.name.strip(),
        "email": payload.email.lower().strip(),
        "phone": payload.phone.strip(),
        "audience_type": payload.audience_type,
        "interest": (payload.interest or "").strip(),
        "source": payload.source or "home_masterclass",
        "created_at": now.isoformat(),
    }
    try:
        await db.leads.insert_one(doc)
    except Exception:
        logger.warning("MongoDB unavailable, lead not persisted but email will still be sent")
    send_thankyou_email(to_email=doc["email"], name=doc["name"])
    ai_access_token = create_ai_access_token(
        lead_id=lead_id,
        email=doc["email"],
        audience_type=doc["audience_type"],
    )
    return Lead(
        id=lead_id,
        name=doc["name"],
        email=doc["email"],
        phone=doc["phone"],
        audience_type=doc["audience_type"],
        interest=doc["interest"],
        source=doc["source"],
        created_at=now,
        ai_access_token=ai_access_token,
    )


@api_router.get("/leads")
async def list_leads(limit: int = 100):
    cursor = db.leads.find({}, {"_id": 0}).sort("created_at", -1).limit(min(max(limit, 1), 500))
    docs = await cursor.to_list(length=limit)
    return {"leads": [_serialize(d) for d in docs]}


# --- AI: Course Consultant ------------------------------------------------

@api_router.post("/ai/course-consultant/message")
async def consultant_message(payload: ConsultantTurnIn, request: Request):
    session_id = payload.session_id or f"consultant-{uuid.uuid4()}"
    if payload.is_first_turn and _is_underqualified_consultant_message(payload.message):
        try:
            usage = await usage_snapshot(db, request, "consultant")
        except Exception:
            usage = {"kind": "consultant", "limit": 999, "remaining": 999, "lead_required": False}
        return {
            "session_id": session_id,
            "attempts": 0,
            "static": True,
            "assistant_message": "Tell me one goal or pain point first, like saving time on Instagram, getting an internship, or growing your business. Then I can recommend properly.",
            "course_ranking": [],
            "ready_to_recommend": False,
            "usage": usage,
        }

    try:
        usage = await check_and_record_ai_usage(db, request, "consultant", payload.message)
    except AIUsageError as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail())
    except Exception:
        logger.warning("MongoDB unavailable, skipping usage check")
        usage = {"kind": "consultant", "limit": 999, "remaining": 999, "lead_required": False}

    try:
        result = await consultant_turn(
            session_id=session_id,
            audience_type=payload.audience_type,
            specialization=payload.specialization or "",
            user_message=payload.message,
            is_first_turn=payload.is_first_turn,
        )
    except Exception as e:
        logger.exception("consultant_turn failed")
        raise HTTPException(status_code=502, detail=f"AI consultant error: {e}")

    # Log for iteration
    try:
        await db.chat_logs.insert_one(
            {
                "kind": "consultant",
                "session_id": session_id,
                "audience_type": payload.audience_type,
                "specialization": payload.specialization,
                "user_message": payload.message,
                "is_first_turn": payload.is_first_turn,
                "attempts": result.get("attempts"),
                "ready_to_recommend": result.get("ready_to_recommend"),
                "usage_remaining": usage.get("remaining"),
                "usage_limit": usage.get("limit"),
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        )
    except Exception:
        pass
    return {"session_id": session_id, **result, "usage": usage}


@api_router.post("/ai/course-consultant/reset")
async def consultant_reset(payload: ResetSessionIn):
    forget_session(payload.session_id)
    return {"ok": True}


# --- AI: Job Risk Analyzer ------------------------------------------------

@api_router.post("/ai/job-risk/message")
async def job_risk_message(payload: JobRiskTurnIn, request: Request):
    session_id = payload.session_id or f"jobrisk-{uuid.uuid4()}"
    if payload.is_first_turn:
        role_missing = _is_underqualified_job_role(payload.role or "")
        task_missing = _is_underqualified_job_risk_message(payload.message)
        if role_missing or task_missing:
            try:
                usage = await usage_snapshot(db, request, "job_risk")
            except Exception:
                usage = {"kind": "job_risk", "limit": 999, "remaining": 999, "lead_required": False}
            assistant_message = (
                "Tell me your role first, like social media manager or accounts executive, then share 2-3 daily tasks. Then I can give you a useful risk read."
                if role_missing
                else "Share 2-3 daily tasks first, like writing captions, handling DMs, building reports, or using Canva/Figma/Excel. Then I can give you a useful risk read."
            )
            return {
                "session_id": session_id,
                "attempts": 0,
                "static": True,
                "assistant_message": assistant_message,
                "risk": None,
                "confidence": 0,
                "usage": usage,
            }

    try:
        usage = await check_and_record_ai_usage(db, request, "job_risk", payload.message)
    except AIUsageError as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail())
    except Exception:
        logger.warning("MongoDB unavailable, skipping usage check")
        usage = {"kind": "job_risk", "limit": 999, "remaining": 999, "lead_required": False}

    try:
        result = await job_risk_turn(
            session_id=session_id,
            role=payload.role or "",
            user_message=payload.message,
            is_first_turn=payload.is_first_turn,
        )
    except Exception as e:
        logger.exception("job_risk_turn failed")
        raise HTTPException(status_code=502, detail=f"AI risk error: {e}")

    try:
        await db.chat_logs.insert_one(
            {
                "kind": "job_risk",
                "session_id": session_id,
                "role": payload.role,
                "user_message": payload.message,
                "is_first_turn": payload.is_first_turn,
                "attempts": result.get("attempts"),
                "probability": result.get("risk", {}).get("probability"),
                "severity": result.get("risk", {}).get("severity"),
                "usage_remaining": usage.get("remaining"),
                "usage_limit": usage.get("limit"),
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        )
    except Exception:
        pass
    return {"session_id": session_id, **result, "usage": usage}


@api_router.post("/ai/job-risk/reset")
async def job_risk_reset(payload: ResetSessionIn):
    forget_session(payload.session_id)
    return {"ok": True}


# Include router
app.include_router(api_router)

_cors_origins = [o.strip().rstrip("/") for o in os.environ.get("CORS_ORIGINS", "*").split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=_cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    await client.close()


