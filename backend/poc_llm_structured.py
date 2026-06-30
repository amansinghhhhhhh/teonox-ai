"""
POC: Validate Claude Sonnet 4.5 (claude-sonnet-4-5-20250929) returns reliable
chat + strict JSON for the two core Teonox.ai AI features:

  1) AI Course Consultant — chat reply + course ranking JSON (course_id,
     match_percentage, label, reason) for the 7 pilot courses.
  2) "AI aapki Job legi?" Risk Analyzer — chat reply + risk metrics JSON
     (probability, severity, reasons, recommended_courses).

Exit criteria for Phase 1:
  - >= 95% successful parses across the test set
  - Rankings always contain all 7 course_ids, all percentages in 0..100
  - Risk output always includes probability + severity + >=2 reasons + >=1 reco
"""

import os
import re
import json
import asyncio
import uuid
from typing import Any, Dict, List, Tuple

from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv()

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")
MODEL_PROVIDER = "anthropic"
MODEL_NAME = "claude-sonnet-4-5-20250929"

# ---------------------------------------------------------------------------
# 7 pilot courses (canonical IDs used across the app)
# ---------------------------------------------------------------------------
PILOT_COURSES: List[Dict[str, str]] = [
    {
        "id": "ai-baat-prompt-engg",
        "title": "AI se Baat Kaise Karte Hai",
        "subtitle": "Prompt Engineering for Everyone",
        "level": "Beginner",
        "summary": "Talk to AI like a pro. Frameworks for prompts that get real work done.",
    },
    {
        "id": "ai-social-media-marketing",
        "title": "AI for Social Media Marketing",
        "subtitle": "Content, scheduling, hooks & analytics with AI",
        "level": "Beginner",
        "summary": "Automate captions, hooks, scheduling and reels research with AI agents.",
    },
    {
        "id": "ai-branding",
        "title": "AI for Branding",
        "subtitle": "Brand voice, identity & assets with AI",
        "level": "Beginner",
        "summary": "Use AI to design brand voice, taglines, identity systems and assets fast.",
    },
    {
        "id": "ai-ui-ux",
        "title": "AI for UI/UX",
        "subtitle": "Wireframes, prototypes & design systems with AI",
        "level": "Intermediate",
        "summary": "Ship beautiful UI with AI co-pilots, design systems and rapid prototypes.",
    },
    {
        "id": "ai-digital-marketing",
        "title": "AI for Digital Marketing",
        "subtitle": "Funnels, ads, email & automations with AI",
        "level": "Intermediate",
        "summary": "Build complete marketing funnels powered by AI agents end-to-end.",
    },
    {
        "id": "ai-seo",
        "title": "AI for SEO",
        "subtitle": "Keyword, content, technical & topical authority",
        "level": "Intermediate",
        "summary": "Use AI to dominate SERPs with clustered content and on-page optimization.",
    },
    {
        "id": "ai-in-depth-technical",
        "title": "AI in Depth (Technical)",
        "subtitle": "LLMs, RAG, agents & deployments",
        "level": "Advanced",
        "summary": "Go technical: LLMs, RAG, fine-tuning, agentic systems and production.",
    },
]

COURSE_IDS = [c["id"] for c in PILOT_COURSES]
COURSE_CATALOG_TEXT = "\n".join(
    f"- {c['id']}: {c['title']} — {c['subtitle']} ({c['level']}). {c['summary']}"
    for c in PILOT_COURSES
)

# ---------------------------------------------------------------------------
# System prompts (enforce STRICT JSON-only with the exact schema we need)
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
      // 1 to 3 items
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
# JSON extraction + validation
# ---------------------------------------------------------------------------

JSON_FENCE_RE = re.compile(r"```(?:json)?\s*(\{.*?\})\s*```", re.DOTALL | re.IGNORECASE)
BARE_JSON_RE = re.compile(r"(\{.*\})", re.DOTALL)


def extract_json(text: str) -> Dict[str, Any]:
    """Extract a JSON object from a model response, tolerating prose."""
    if not text:
        raise ValueError("Empty response")
    m = JSON_FENCE_RE.search(text)
    candidate = m.group(1) if m else None
    if candidate is None:
        m = BARE_JSON_RE.search(text)
        candidate = m.group(1) if m else None
    if candidate is None:
        raise ValueError(f"No JSON block found in response. Raw: {text[:300]}")
    return json.loads(candidate)


def validate_consultant(payload: Dict[str, Any]) -> Tuple[bool, str]:
    if not isinstance(payload, dict):
        return False, "payload not dict"
    if "assistant_message" not in payload or not isinstance(payload["assistant_message"], str):
        return False, "missing/invalid assistant_message"
    ranking = payload.get("course_ranking")
    if not isinstance(ranking, list) or len(ranking) != 7:
        return False, f"course_ranking must be list of 7, got {type(ranking).__name__} len={len(ranking) if isinstance(ranking, list) else 'NA'}"
    seen = set()
    for item in ranking:
        if not isinstance(item, dict):
            return False, "ranking item not dict"
        cid = item.get("course_id")
        if cid not in COURSE_IDS:
            return False, f"invalid course_id: {cid}"
        if cid in seen:
            return False, f"duplicate course_id: {cid}"
        seen.add(cid)
        mp = item.get("match_percentage")
        if not isinstance(mp, int) or not (0 <= mp <= 100):
            return False, f"invalid match_percentage for {cid}: {mp}"
        if not isinstance(item.get("label"), str) or not item["label"]:
            return False, f"missing label for {cid}"
        if not isinstance(item.get("reason"), str) or not item["reason"]:
            return False, f"missing reason for {cid}"
    if seen != set(COURSE_IDS):
        return False, "ranking missing some course_ids"
    # descending order check
    percs = [item["match_percentage"] for item in ranking]
    if percs != sorted(percs, reverse=True):
        return False, f"ranking not descending: {percs}"
    if "ready_to_recommend" not in payload or not isinstance(payload["ready_to_recommend"], bool):
        return False, "missing/invalid ready_to_recommend"
    return True, "ok"


def validate_risk(payload: Dict[str, Any]) -> Tuple[bool, str]:
    if not isinstance(payload, dict):
        return False, "payload not dict"
    if not isinstance(payload.get("assistant_message"), str):
        return False, "missing assistant_message"
    risk = payload.get("risk")
    if not isinstance(risk, dict):
        return False, "missing risk obj"
    p = risk.get("probability")
    if not isinstance(p, int) or not (0 <= p <= 100):
        return False, f"invalid probability: {p}"
    sev = risk.get("severity")
    if sev not in {"low", "medium", "high", "critical"}:
        return False, f"invalid severity: {sev}"
    # mapping check (loose, allow ±5 to avoid over-strict)
    expected = (
        "low" if p <= 25
        else "medium" if p <= 55
        else "high" if p <= 80
        else "critical"
    )
    if sev != expected:
        # not fatal — flag but allow
        pass
    if not isinstance(risk.get("headline"), str) or not risk["headline"]:
        return False, "missing headline"
    reasons = risk.get("reasons")
    if not isinstance(reasons, list) or len(reasons) < 2:
        return False, f"reasons must have >=2 items, got {len(reasons) if isinstance(reasons, list) else 'NA'}"
    if not all(isinstance(r, str) and r for r in reasons):
        return False, "reasons must be non-empty strings"
    if not isinstance(risk.get("safe_zones"), list):
        return False, "safe_zones must be list"
    recs = risk.get("recommended_courses")
    if not isinstance(recs, list) or len(recs) < 1:
        return False, "recommended_courses must have >=1"
    for r in recs:
        if not isinstance(r, dict):
            return False, "rec item not dict"
        if r.get("course_id") not in COURSE_IDS:
            return False, f"invalid rec course_id: {r.get('course_id')}"
        if not isinstance(r.get("why"), str) or not r["why"]:
            return False, "rec missing why"
    if not isinstance(payload.get("confidence"), int) or not (0 <= payload["confidence"] <= 100):
        return False, "invalid confidence"
    return True, "ok"


# ---------------------------------------------------------------------------
# LLM call wrappers (with retry-on-parse-failure correction prompt)
# ---------------------------------------------------------------------------

async def call_with_retry(chat: LlmChat, user_text: str, validate_fn, max_retries: int = 2):
    """Send a message; if parsing/validation fails, send a correction prompt."""
    last_raw = ""
    last_err = ""
    for attempt in range(max_retries + 1):
        if attempt == 0:
            msg = UserMessage(text=user_text)
        else:
            correction = (
                "Your previous response was not valid. Error: "
                f"{last_err}. Re-emit the SAME answer, but as a single JSON object inside a "
                "```json ... ``` fenced block matching the schema exactly. Do not include any prose "
                "before or after the code fence."
            )
            msg = UserMessage(text=correction)
        raw = await chat.send_message(msg)
        last_raw = raw or ""
        try:
            payload = extract_json(last_raw)
        except Exception as e:
            last_err = f"JSON extract failed: {e}"
            continue
        ok, why = validate_fn(payload)
        if ok:
            return True, payload, last_raw, attempt
        last_err = f"schema invalid: {why}"
    return False, None, last_raw, max_retries


async def run_consultant_session(turns: List[Dict[str, str]]) -> Dict[str, Any]:
    """Run a multi-turn consultant conversation, return summary stats."""
    session_id = f"poc-consultant-{uuid.uuid4()}"
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message=CONSULTANT_SYSTEM_PROMPT,
    ).with_model(MODEL_PROVIDER, MODEL_NAME)

    results = []
    for t in turns:
        ok, payload, raw, attempts = await call_with_retry(
            chat, t["text"], validate_consultant, max_retries=2
        )
        results.append({
            "input": t["text"],
            "ok": ok,
            "attempts": attempts + 1,
            "payload": payload,
            "raw_excerpt": (raw or "")[:200],
        })
    return {"session_id": session_id, "results": results}


async def run_risk_session(turns: List[Dict[str, str]]) -> Dict[str, Any]:
    session_id = f"poc-risk-{uuid.uuid4()}"
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message=JOB_RISK_SYSTEM_PROMPT,
    ).with_model(MODEL_PROVIDER, MODEL_NAME)
    results = []
    for t in turns:
        ok, payload, raw, attempts = await call_with_retry(
            chat, t["text"], validate_risk, max_retries=2
        )
        results.append({
            "input": t["text"],
            "ok": ok,
            "attempts": attempts + 1,
            "payload": payload,
            "raw_excerpt": (raw or "")[:200],
        })
    return {"session_id": session_id, "results": results}


# ---------------------------------------------------------------------------
# Representative inputs covering 4 audiences + edge cases
# ---------------------------------------------------------------------------

CONSULTANT_SESSIONS: List[List[Dict[str, str]]] = [
    # Session A — Working professional, marketing
    [
        {"text": "Hi, I am a working professional. My specialization is digital marketing."},
        {"text": "I spend most of my day writing captions, posting on Instagram, and reviewing ad performance."},
        {"text": "I want to save time and stop manually posting on social media."},
    ],
    # Session B — Degree student, design
    [
        {"text": "I'm a college student. I'm studying UI/UX design."},
        {"text": "I want to land an internship in product design by next semester."},
    ],
    # Session C — Business owner, small ecommerce
    [
        {"text": "I'm a business owner. We sell handmade jewelry online."},
        {"text": "I want better SEO and content for my Shopify store without hiring a big team."},
    ],
    # Session D — Vague / school student edge case
    [
        {"text": "school student"},
        {"text": "I don't know what I want. I just like AI."},
    ],
]

RISK_SESSIONS: List[List[Dict[str, str]]] = [
    # Session R1 — Manual social media manager
    [
        {"text": "I am a social media manager at a small agency. I post on 5 brands' Instagram daily."},
        {"text": "Most of my day is writing captions, scheduling, and making basic graphics in Canva."},
    ],
    # Session R2 — Senior UI/UX designer who uses AI tools
    [
        {"text": "I'm a senior UI/UX designer. I use Figma + AI tools like v0 and Midjourney."},
        {"text": "I lead a team of 4 and mostly mentor + review designs."},
    ],
    # Session R3 — SEO writer, mostly templated work
    [
        {"text": "I'm a content writer focused on SEO blogs. I write 4 articles a day from briefs."},
        {"text": "I barely use AI — only Grammarly. My boss already uses ChatGPT to draft articles."},
    ],
    # Session R4 — Vague edge case
    [
        {"text": "I'm an engineer."},
        {"text": "yeah."},
    ],
]


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

async def main():
    if not EMERGENT_LLM_KEY:
        print("ERROR: EMERGENT_LLM_KEY missing in env")
        return

    print(f"Using model: {MODEL_PROVIDER}/{MODEL_NAME}")
    print(f"Catalog size: {len(PILOT_COURSES)}")
    print("=" * 80)

    summary = {
        "consultant": {"total": 0, "passed": 0, "attempts_sum": 0, "sessions": []},
        "risk":       {"total": 0, "passed": 0, "attempts_sum": 0, "sessions": []},
    }

    print("\n### CONSULTANT SESSIONS ###")
    for i, turns in enumerate(CONSULTANT_SESSIONS, start=1):
        print(f"\n-- Consultant Session {i} ({len(turns)} turns) --")
        session = await run_consultant_session(turns)
        sess_pass = 0
        for r in session["results"]:
            summary["consultant"]["total"] += 1
            summary["consultant"]["attempts_sum"] += r["attempts"]
            mark = "PASS" if r["ok"] else "FAIL"
            if r["ok"]:
                sess_pass += 1
                summary["consultant"]["passed"] += 1
                top = r["payload"]["course_ranking"][0]
                print(f"  [{mark}] attempts={r['attempts']} top={top['course_id']}({top['match_percentage']}%) msg={r['payload']['assistant_message'][:80]!r}")
            else:
                print(f"  [{mark}] attempts={r['attempts']} raw={r['raw_excerpt']!r}")
        summary["consultant"]["sessions"].append({"index": i, "passed": sess_pass, "total": len(session["results"])})

    print("\n### RISK SESSIONS ###")
    for i, turns in enumerate(RISK_SESSIONS, start=1):
        print(f"\n-- Risk Session {i} ({len(turns)} turns) --")
        session = await run_risk_session(turns)
        sess_pass = 0
        for r in session["results"]:
            summary["risk"]["total"] += 1
            summary["risk"]["attempts_sum"] += r["attempts"]
            mark = "PASS" if r["ok"] else "FAIL"
            if r["ok"]:
                sess_pass += 1
                summary["risk"]["passed"] += 1
                rk = r["payload"]["risk"]
                print(f"  [{mark}] attempts={r['attempts']} prob={rk['probability']}% sev={rk['severity']} recs={len(rk['recommended_courses'])}")
            else:
                print(f"  [{mark}] attempts={r['attempts']} raw={r['raw_excerpt']!r}")
        summary["risk"]["sessions"].append({"index": i, "passed": sess_pass, "total": len(session["results"])})

    print("\n" + "=" * 80)
    print("SUMMARY")
    for key in ("consultant", "risk"):
        s = summary[key]
        rate = (s["passed"] / s["total"] * 100) if s["total"] else 0
        avg_att = (s["attempts_sum"] / s["total"]) if s["total"] else 0
        print(f"  {key.upper():10s} pass={s['passed']}/{s['total']} ({rate:.1f}%)  avg_attempts={avg_att:.2f}")
    total_pass = summary["consultant"]["passed"] + summary["risk"]["passed"]
    total = summary["consultant"]["total"] + summary["risk"]["total"]
    rate = (total_pass / total * 100) if total else 0
    print(f"  OVERALL    pass={total_pass}/{total} ({rate:.1f}%)")
    print(f"  EXIT       {'OK' if rate >= 95 else 'FAIL'} (need >=95%)")


if __name__ == "__main__":
    asyncio.run(main())
