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

from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Optional, Literal, Any, Dict
from pydantic import BaseModel, Field, ConfigDict, EmailStr

from courses_data import PILOT_COURSES
from ai_service import consultant_turn, job_risk_turn, forget_session

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# Mongo
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get("DB_NAME", "teonox_ai")]

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


class Lead(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    audience_type: str
    interest: str
    source: str
    created_at: datetime


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
    await db.leads.insert_one(doc)
    return Lead(
        id=lead_id,
        name=doc["name"],
        email=doc["email"],
        phone=doc["phone"],
        audience_type=doc["audience_type"],
        interest=doc["interest"],
        source=doc["source"],
        created_at=now,
    )


@api_router.get("/leads")
async def list_leads(limit: int = 100):
    cursor = db.leads.find({}, {"_id": 0}).sort("created_at", -1).limit(min(max(limit, 1), 500))
    docs = await cursor.to_list(length=limit)
    return {"leads": [_serialize(d) for d in docs]}


# --- AI: Course Consultant ------------------------------------------------

@api_router.post("/ai/course-consultant/message")
async def consultant_message(payload: ConsultantTurnIn):
    session_id = payload.session_id or f"consultant-{uuid.uuid4()}"
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
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        )
    except Exception:
        pass
    return {"session_id": session_id, **result}


@api_router.post("/ai/course-consultant/reset")
async def consultant_reset(payload: ResetSessionIn):
    forget_session(payload.session_id)
    return {"ok": True}


# --- AI: Job Risk Analyzer ------------------------------------------------

@api_router.post("/ai/job-risk/message")
async def job_risk_message(payload: JobRiskTurnIn):
    session_id = payload.session_id or f"jobrisk-{uuid.uuid4()}"
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
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        )
    except Exception:
        pass
    return {"session_id": session_id, **result}


@api_router.post("/ai/job-risk/reset")
async def job_risk_reset(payload: ResetSessionIn):
    forget_session(payload.session_id)
    return {"ok": True}


# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
