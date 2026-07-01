import asyncio
from datetime import datetime, timezone
from pathlib import Path
import sys

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))

from usage_control import AIUsageError, check_and_record_ai_usage, create_ai_access_token


class FakeCollection:
    def __init__(self):
        self.docs = []

    async def count_documents(self, query):
        return sum(1 for doc in self.docs if self._matches(doc, query))

    async def insert_one(self, doc):
        self.docs.append(doc)

    async def find_one(self, query):
        for doc in self.docs:
            if self._matches(doc, query):
                return doc
        return None

    async def find_one_and_update(self, query, update, upsert=False, return_document=None):
        doc = await self.find_one(query)
        created = False
        if doc is None:
            if not upsert:
                return None
            doc = {"_id": query.get("_id")}
            self.docs.append(doc)
            created = True

        if created:
            doc.update(update.get("$setOnInsert", {}))
        for key, value in update.get("$inc", {}).items():
            doc[key] = doc.get(key, 0) + value
        doc.update(update.get("$set", {}))
        return doc

    def _matches(self, doc, query):
        for key, expected in query.items():
            actual = doc.get(key)
            if isinstance(expected, dict):
                if "$gte" in expected and not (actual >= expected["$gte"]):
                    return False
            elif actual != expected:
                return False
        return True


class FakeDB:
    def __init__(self):
        self.ai_usage_events = FakeCollection()
        self.ai_usage_counters = FakeCollection()


class FakeClient:
    host = "203.0.113.10"


class FakeRequest:
    def __init__(self, visitor_id="visitor-123456", ip="203.0.113.10", token=None):
        self.headers = {
            "x-visitor-id": visitor_id,
            "x-forwarded-for": ip,
        }
        if token:
            self.headers["x-ai-access-token"] = token
        self.client = FakeClient()


def run(coro):
    return asyncio.run(coro)


@pytest.fixture(autouse=True)
def usage_env(monkeypatch):
    monkeypatch.setenv("USAGE_HASH_SECRET", "test-secret-with-at-least-32-bytes")
    monkeypatch.setenv("AI_FEATURES_ENABLED", "true")
    monkeypatch.setenv("AI_MAX_INPUT_CHARS", "1500")
    monkeypatch.setenv("AI_CONSULTANT_FREE_DAILY_LIMIT", "6")
    monkeypatch.setenv("AI_CONSULTANT_LEAD_DAILY_LIMIT", "18")
    monkeypatch.setenv("AI_JOB_RISK_FREE_DAILY_LIMIT", "4")
    monkeypatch.setenv("AI_JOB_RISK_LEAD_DAILY_LIMIT", "12")
    monkeypatch.setenv("AI_VISITOR_10MIN_LIMIT", "100")
    monkeypatch.setenv("AI_IP_HOURLY_LIMIT", "100")
    monkeypatch.setenv("AI_IP_DAILY_LIMIT", "100")
    monkeypatch.setenv("AI_GLOBAL_DAILY_LIMIT", "100")


def test_anonymous_consultant_allows_six_then_requires_lead():
    db = FakeDB()
    request = FakeRequest()
    now = datetime(2026, 7, 1, tzinfo=timezone.utc)

    usage = run(check_and_record_ai_usage(db, request, "consultant", "I want to grow my business with AI", now))
    assert usage["remaining"] == 5

    for _ in range(5):
        usage = run(check_and_record_ai_usage(db, request, "consultant", "I want to grow my business with AI", now))

    assert usage["remaining"] == 0
    with pytest.raises(AIUsageError) as exc:
        run(check_and_record_ai_usage(db, request, "consultant", "I want one more answer", now))

    assert exc.value.code == "feature_daily_limit"
    assert exc.value.usage["lead_required"] is True


def test_anonymous_job_risk_allows_four_then_requires_lead():
    db = FakeDB()
    request = FakeRequest()
    now = datetime(2026, 7, 1, tzinfo=timezone.utc)

    for _ in range(4):
        usage = run(check_and_record_ai_usage(db, request, "job_risk", "I write reports and reply to clients daily", now))

    assert usage["remaining"] == 0
    with pytest.raises(AIUsageError) as exc:
        run(check_and_record_ai_usage(db, request, "job_risk", "I also make dashboards", now))

    assert exc.value.code == "feature_daily_limit"
    assert exc.value.usage["lead_required"] is True


def test_lead_token_unlocks_higher_limit():
    db = FakeDB()
    token = create_ai_access_token("lead-1", "user@example.com", "professional")
    request = FakeRequest(token=token)
    now = datetime(2026, 7, 1, tzinfo=timezone.utc)

    for _ in range(18):
        usage = run(check_and_record_ai_usage(db, request, "consultant", "I want to save time on Instagram", now))

    assert usage["remaining"] == 0
    with pytest.raises(AIUsageError) as exc:
        run(check_and_record_ai_usage(db, request, "consultant", "Another refinement please", now))

    assert exc.value.code == "feature_daily_limit"
    assert exc.value.usage["lead_required"] is False


def test_invalid_token_falls_back_to_anonymous_limit():
    db = FakeDB()
    request = FakeRequest(token="not-a-real-token")
    now = datetime(2026, 7, 1, tzinfo=timezone.utc)

    for _ in range(6):
        run(check_and_record_ai_usage(db, request, "consultant", "I want to learn AI for my job", now))

    with pytest.raises(AIUsageError) as exc:
        run(check_and_record_ai_usage(db, request, "consultant", "Another anonymous answer", now))

    assert exc.value.usage["lead_required"] is True


def test_ip_hourly_limit_blocks_shared_network(monkeypatch):
    monkeypatch.setenv("AI_IP_HOURLY_LIMIT", "2")
    db = FakeDB()
    now = datetime(2026, 7, 1, tzinfo=timezone.utc)

    run(check_and_record_ai_usage(db, FakeRequest(visitor_id="visitor-one"), "consultant", "I want to learn AI", now))
    run(check_and_record_ai_usage(db, FakeRequest(visitor_id="visitor-two"), "consultant", "I want to learn AI", now))

    with pytest.raises(AIUsageError) as exc:
        run(check_and_record_ai_usage(db, FakeRequest(visitor_id="visitor-three"), "consultant", "I want to learn AI", now))

    assert exc.value.code == "ip_hourly_limit"


def test_global_daily_limit_blocks_all_ai(monkeypatch):
    monkeypatch.setenv("AI_GLOBAL_DAILY_LIMIT", "2")
    db = FakeDB()
    now = datetime(2026, 7, 1, tzinfo=timezone.utc)

    run(check_and_record_ai_usage(db, FakeRequest(visitor_id="visitor-one", ip="203.0.113.1"), "consultant", "I want to learn AI", now))
    run(check_and_record_ai_usage(db, FakeRequest(visitor_id="visitor-two", ip="203.0.113.2"), "job_risk", "I write reports daily", now))

    with pytest.raises(AIUsageError) as exc:
        run(check_and_record_ai_usage(db, FakeRequest(visitor_id="visitor-three", ip="203.0.113.3"), "consultant", "I want to learn AI", now))

    assert exc.value.code == "global_daily_limit"


def test_ai_features_enabled_switch_blocks_ai(monkeypatch):
    monkeypatch.setenv("AI_FEATURES_ENABLED", "false")
    db = FakeDB()

    with pytest.raises(AIUsageError) as exc:
        run(check_and_record_ai_usage(db, FakeRequest(), "consultant", "I want to learn AI"))

    assert exc.value.status_code == 503
    assert exc.value.code == "ai_disabled"


def test_long_input_is_rejected(monkeypatch):
    monkeypatch.setenv("AI_MAX_INPUT_CHARS", "10")
    db = FakeDB()

    with pytest.raises(AIUsageError) as exc:
        run(check_and_record_ai_usage(db, FakeRequest(), "consultant", "x" * 11))

    assert exc.value.status_code == 413
    assert exc.value.code == "input_too_long"
