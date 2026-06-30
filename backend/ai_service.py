"""Teonox.ai AI services — thin async wrappers around Claude Sonnet 4.5
that power the Course Consultant chat and the Job Risk Analyzer chat.

Proven via /app/backend/poc_llm_structured.py (17/17 = 100% strict JSON parse).
"""

import os
import re
import json
import logging
from typing import Any, Dict, List, Optional, Tuple

from emergentintegrations.llm.chat import LlmChat, UserMessage

from courses_data import COURSE_CATALOG_TEXT, COURSE_IDS

log = logging.getLogger(__name__)

MODEL_PROVIDER = "anthropic"
MODEL_NAME = "claude-sonnet-4-5-20250929"

# ---------------------------------------------------------------------------
# System prompts (validated in POC)
# ---------------------------------------------------------------------------

CONSULTANT_SYSTEM_PROMPT = f"""You are Teonox.ai's AI Course Consultant — a warm, practical, slightly witty Indian EdTech counsellor.
You help students, working professionals, business owners and parents find the right AI course.

The Teonox.ai pilot course catalog (use ONLY these IDs):
{COURSE_CATALOG_TEXT}

Conversation rules:
- Ask ONE focused follow-up question at a time. Keep replies short (2-4 lines max).
- Tone: friendly, encouraging, no jargon, occasional Hinglish phrases ("samajh aaya?", "bilkul").
- Never invent courses. Only rank from the IDs above.

OUTPUT FORMAT — VERY STRICT. Your ENTIRE response MUST be a single JSON object inside a ```json ... ``` fenced block and NOTHING else.
No prose before or after the code fence. No additional text.

Schema:
{{
  "assistant_message": "<your chat reply to the user, plain text, 2-4 lines>",
  "course_ranking": [
    {{
      "course_id": "<one of the catalog ids above>",
      "match_percentage": <integer 0-100>,
      "label": "<one of: Most Recommended, Highly Relevant, Relevant, Worth Exploring, Not Relevant>",
      "reason": "<single short sentence explaining the score>"
    }},
    ... exactly 7 items, one per course id, ordered descending by match_percentage
  ],
  "ready_to_recommend": <true|false>
}}

Scoring guide:
- 90-100 -> Most Recommended (clear fit with user goal/role)
- 75-89  -> Highly Relevant (strong adjacent fit)
- 55-74  -> Relevant (useful but not primary)
- 35-54  -> Worth Exploring (broad horizon)
- 0-34   -> Not Relevant (mismatch with goal)

Always include ALL 7 course_ids exactly once. Percentages must be integers in 0-100. ready_to_recommend=true only after the user has shared role + specialization + at least one goal/pain.
"""

JOB_RISK_SYSTEM_PROMPT = f"""You are Teonox.ai's "AI aapki Job legi?" advisor — direct, honest, kind.
You assess how exposed a user's role is to AI replacement based on their tasks, tools and adaptability,
then recommend Teonox.ai courses that move them from at-risk to AI-empowered.

The Teonox.ai pilot course catalog (use ONLY these IDs):
{COURSE_CATALOG_TEXT}

Conversation rules:
- Ask ONE focused question at a time. Be brief (2-4 lines). Empathetic, not alarmist.
- Never fabricate statistics. Phrase risks as "current trends suggest...".

OUTPUT FORMAT — VERY STRICT. Your ENTIRE response MUST be a single JSON object inside a ```json ... ``` fenced block and NOTHING else.
No prose before or after the code fence.

Schema:
{{
  "assistant_message": "<your chat reply, plain text, 2-4 lines>",
  "risk": {{
    "probability": <integer 0-100>,
    "severity": "<one of: low, medium, high, critical>",
    "headline": "<single short sentence summary of the risk>",
    "reasons": [
      "<short reason 1>",
      "<short reason 2>",
      "<optional reason 3>"
    ],
    "safe_zones": [
      "<short skill/area that is still safe or amplified by AI>",
      "..."
    ],
    "recommended_courses": [
      {{
        "course_id": "<one of the catalog ids>",
        "why": "<one short sentence on why this course helps>"
      }}
    ]
  }},
  "confidence": <integer 0-100>
}}

Severity mapping:
- probability 0-25  -> low
- probability 26-55 -> medium
- probability 56-80 -> high
- probability 81-100 -> critical

reasons must contain at least 2 items. recommended_courses must contain at least 1 item.
Start with conservative confidence (40-60) and raise it as the user shares more context.
"""

# ---------------------------------------------------------------------------
# JSON helpers
# ---------------------------------------------------------------------------

_JSON_FENCE = re.compile(r"```(?:json)?\s*(\{.*?\})\s*```", re.DOTALL | re.IGNORECASE)
_BARE = re.compile(r"(\{.*\})", re.DOTALL)


def _extract_json(text: str) -> Dict[str, Any]:
    if not text:
        raise ValueError("empty response")
    m = _JSON_FENCE.search(text)
    candidate = m.group(1) if m else None
    if candidate is None:
        m = _BARE.search(text)
        candidate = m.group(1) if m else None
    if candidate is None:
        raise ValueError("no JSON block in response")
    return json.loads(candidate)


def _validate_consultant(payload: Dict[str, Any]) -> Tuple[bool, str]:
    if not isinstance(payload, dict):
        return False, "payload not dict"
    if not isinstance(payload.get("assistant_message"), str):
        return False, "missing assistant_message"
    ranking = payload.get("course_ranking")
    if not isinstance(ranking, list) or len(ranking) != 7:
        return False, "course_ranking must be list of 7"
    seen = set()
    for item in ranking:
        if not isinstance(item, dict):
            return False, "ranking item not dict"
        cid = item.get("course_id")
        if cid not in COURSE_IDS or cid in seen:
            return False, f"invalid/duplicate course_id: {cid}"
        seen.add(cid)
        mp = item.get("match_percentage")
        if not isinstance(mp, int) or not (0 <= mp <= 100):
            return False, f"bad match_percentage for {cid}"
        if not isinstance(item.get("label"), str) or not item["label"]:
            return False, "missing label"
        if not isinstance(item.get("reason"), str) or not item["reason"]:
            return False, "missing reason"
    if seen != set(COURSE_IDS):
        return False, "ranking missing some course_ids"
    if not isinstance(payload.get("ready_to_recommend"), bool):
        return False, "missing ready_to_recommend"
    return True, "ok"


def _validate_risk(payload: Dict[str, Any]) -> Tuple[bool, str]:
    if not isinstance(payload, dict):
        return False, "payload not dict"
    if not isinstance(payload.get("assistant_message"), str):
        return False, "missing assistant_message"
    risk = payload.get("risk")
    if not isinstance(risk, dict):
        return False, "missing risk"
    p = risk.get("probability")
    if not isinstance(p, int) or not (0 <= p <= 100):
        return False, "bad probability"
    if risk.get("severity") not in {"low", "medium", "high", "critical"}:
        return False, "bad severity"
    if not isinstance(risk.get("headline"), str) or not risk["headline"]:
        return False, "missing headline"
    reasons = risk.get("reasons")
    if not isinstance(reasons, list) or len(reasons) < 2:
        return False, "need >=2 reasons"
    if not all(isinstance(r, str) and r for r in reasons):
        return False, "reasons non-string"
    if not isinstance(risk.get("safe_zones"), list):
        return False, "safe_zones not list"
    recs = risk.get("recommended_courses")
    if not isinstance(recs, list) or len(recs) < 1:
        return False, "need >=1 rec"
    for r in recs:
        if not isinstance(r, dict) or r.get("course_id") not in COURSE_IDS:
            return False, "bad rec"
        if not isinstance(r.get("why"), str) or not r["why"]:
            return False, "rec missing why"
    if not isinstance(payload.get("confidence"), int) or not (0 <= payload["confidence"] <= 100):
        return False, "bad confidence"
    return True, "ok"


# ---------------------------------------------------------------------------
# Per-session chat instances (in-memory) — persistence is handled by Mongo logs
# ---------------------------------------------------------------------------

_session_cache: Dict[str, LlmChat] = {}


def _get_or_create_chat(session_id: str, system_prompt: str) -> LlmChat:
    if session_id in _session_cache:
        return _session_cache[session_id]
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise RuntimeError("EMERGENT_LLM_KEY not configured")
    chat = LlmChat(
        api_key=api_key,
        session_id=session_id,
        system_message=system_prompt,
    ).with_model(MODEL_PROVIDER, MODEL_NAME)
    _session_cache[session_id] = chat
    return chat


async def _call_with_retry(chat: LlmChat, user_text: str, validator, max_retries: int = 2):
    last_err: Optional[str] = None
    last_raw: str = ""
    for attempt in range(max_retries + 1):
        if attempt == 0:
            msg = UserMessage(text=user_text)
        else:
            correction = (
                "Your previous response was not valid. Error: "
                f"{last_err}. Re-emit the SAME answer as a single JSON object inside a "
                "```json ... ``` fenced block matching the schema exactly. No prose before or after."
            )
            msg = UserMessage(text=correction)
        raw = await chat.send_message(msg)
        last_raw = raw or ""
        try:
            payload = _extract_json(last_raw)
        except Exception as e:
            last_err = f"json extract: {e}"
            continue
        ok, why = validator(payload)
        if ok:
            return payload, last_raw, attempt + 1
        last_err = f"schema: {why}"
    raise RuntimeError(f"LLM failed after retries: {last_err} | raw_excerpt={last_raw[:200]!r}")


async def consultant_turn(
    session_id: str,
    audience_type: str,
    specialization: str,
    user_message: str,
    is_first_turn: bool = False,
) -> Dict[str, Any]:
    chat = _get_or_create_chat(session_id, CONSULTANT_SYSTEM_PROMPT)
    if is_first_turn:
        framed = (
            f"User profile: audience_type={audience_type}; specialization={specialization or 'unspecified'}.\n"
            f"User's first message: {user_message}"
        )
    else:
        framed = user_message
    payload, _, attempts = await _call_with_retry(chat, framed, _validate_consultant)
    return {"attempts": attempts, **payload}


async def job_risk_turn(
    session_id: str,
    role: str,
    user_message: str,
    is_first_turn: bool = False,
) -> Dict[str, Any]:
    chat = _get_or_create_chat(session_id, JOB_RISK_SYSTEM_PROMPT)
    if is_first_turn:
        framed = (
            f"User self-described role: {role or 'unspecified'}.\n"
            f"User's first message: {user_message}"
        )
    else:
        framed = user_message
    payload, _, attempts = await _call_with_retry(chat, framed, _validate_risk)
    return {"attempts": attempts, **payload}


def forget_session(session_id: str) -> None:
    _session_cache.pop(session_id, None)
