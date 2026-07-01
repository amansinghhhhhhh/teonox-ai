"""
Teonox.ai Backend API Test Suite
Tests all 9 endpoints with realistic payloads and strict validation.
"""

import requests
import sys
import json
import os
from datetime import datetime
from typing import Dict, Any, List

BASE_URL = os.environ.get("BACKEND_API_URL", "http://localhost:8000/api")

# Canonical course IDs from courses_data.py
COURSE_IDS = [
    "ai-baat-prompt-engg",
    "ai-social-media-marketing",
    "ai-branding",
    "ai-ui-ux",
    "ai-digital-marketing",
    "ai-seo",
    "ai-in-depth-technical",
]

AUDIENCE_TYPES = ["student", "professional", "business_owner", "parent"]


class TeonoxAPITester:
    def __init__(self):
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def log(self, msg: str, level: str = "INFO"):
        prefix = {
            "INFO": "ℹ️ ",
            "PASS": "✅",
            "FAIL": "❌",
            "WARN": "⚠️ ",
        }.get(level, "")
        print(f"{prefix} {msg}")

    def test(self, name: str, method: str, endpoint: str, expected_status: int, data: Dict = None, validate_fn=None):
        """Run a single API test with optional custom validation."""
        url = f"{BASE_URL}{endpoint}"
        self.tests_run += 1
        self.log(f"Testing {name}...", "INFO")

        try:
            if method == "GET":
                response = requests.get(url, timeout=30)
            elif method == "POST":
                response = requests.post(url, json=data, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            result = {
                "name": name,
                "endpoint": endpoint,
                "status": response.status_code,
                "expected": expected_status,
                "passed": success,
            }

            if success:
                self.log(f"PASS - {name} (status {response.status_code})", "PASS")
                try:
                    payload = response.json()
                    result["payload"] = payload
                    if validate_fn:
                        valid, msg = validate_fn(payload)
                        if not valid:
                            self.log(f"  Validation failed: {msg}", "FAIL")
                            result["passed"] = False
                            result["validation_error"] = msg
                        else:
                            self.tests_passed += 1
                    else:
                        self.tests_passed += 1
                except Exception as e:
                    self.log(f"  JSON parse error: {e}", "FAIL")
                    result["passed"] = False
                    result["error"] = str(e)
            else:
                self.log(f"FAIL - {name} (expected {expected_status}, got {response.status_code})", "FAIL")
                try:
                    result["response_body"] = response.text[:500]
                except:
                    pass

            self.results.append(result)
            return success, result.get("payload", {})

        except Exception as e:
            self.log(f"FAIL - {name} (exception: {e})", "FAIL")
            self.results.append({
                "name": name,
                "endpoint": endpoint,
                "passed": False,
                "error": str(e),
            })
            return False, {}

    def validate_courses(self, payload: Dict) -> tuple[bool, str]:
        """Validate GET /api/courses response."""
        if "courses" not in payload:
            return False, "Missing 'courses' key"
        courses = payload["courses"]
        if not isinstance(courses, list):
            return False, "'courses' is not a list"
        if len(courses) != 7:
            return False, f"Expected 7 courses, got {len(courses)}"
        
        required_fields = ["id", "title", "subtitle", "level", "duration", "hours", 
                          "price_inr", "original_price_inr", "summary", "outcomes", "modules", "audience"]
        
        for course in courses:
            for field in required_fields:
                if field not in course:
                    return False, f"Course missing field: {field}"
            if course["id"] not in COURSE_IDS:
                return False, f"Invalid course_id: {course['id']}"
        
        return True, "ok"

    def validate_lead(self, payload: Dict) -> tuple[bool, str]:
        """Validate POST /api/leads response."""
        required = ["id", "name", "email", "phone", "audience_type", "created_at", "ai_access_token"]
        for field in required:
            if field not in payload:
                return False, f"Missing field: {field}"
        if payload["audience_type"] not in AUDIENCE_TYPES:
            return False, f"Invalid audience_type: {payload['audience_type']}"
        return True, "ok"

    def validate_consultant_response(self, payload: Dict) -> tuple[bool, str]:
        """Validate POST /api/ai/course-consultant/message response."""
        if "assistant_message" not in payload or not isinstance(payload["assistant_message"], str):
            return False, "Missing or invalid assistant_message"
        
        if "course_ranking" not in payload:
            return False, "Missing course_ranking"
        
        ranking = payload["course_ranking"]
        if not isinstance(ranking, list) or len(ranking) != 7:
            return False, f"course_ranking must be list of 7, got {len(ranking) if isinstance(ranking, list) else 'not a list'}"
        
        seen_ids = set()
        prev_pct = 101
        for item in ranking:
            if not isinstance(item, dict):
                return False, "ranking item not dict"
            
            cid = item.get("course_id")
            if cid not in COURSE_IDS:
                return False, f"Invalid course_id: {cid}"
            if cid in seen_ids:
                return False, f"Duplicate course_id: {cid}"
            seen_ids.add(cid)
            
            mp = item.get("match_percentage")
            if not isinstance(mp, int) or not (0 <= mp <= 100):
                return False, f"Invalid match_percentage for {cid}: {mp}"
            
            if mp > prev_pct:
                return False, f"Ranking not descending: {mp} > {prev_pct}"
            prev_pct = mp
            
            if not item.get("label") or not item.get("reason"):
                return False, f"Missing label or reason for {cid}"
        
        if seen_ids != set(COURSE_IDS):
            return False, "Ranking missing some course_ids"
        
        if "ready_to_recommend" not in payload or not isinstance(payload["ready_to_recommend"], bool):
            return False, "Missing or invalid ready_to_recommend"
        
        return True, "ok"

    def validate_job_risk_response(self, payload: Dict) -> tuple[bool, str]:
        """Validate POST /api/ai/job-risk/message response."""
        if "assistant_message" not in payload or not isinstance(payload["assistant_message"], str):
            return False, "Missing assistant_message"
        
        if "risk" not in payload or not isinstance(payload["risk"], dict):
            return False, "Missing or invalid risk object"
        
        risk = payload["risk"]
        
        prob = risk.get("probability")
        if not isinstance(prob, int) or not (0 <= prob <= 100):
            return False, f"Invalid probability: {prob}"
        
        sev = risk.get("severity")
        if sev not in {"low", "medium", "high", "critical"}:
            return False, f"Invalid severity: {sev}"
        
        if not risk.get("headline"):
            return False, "Missing headline"
        
        reasons = risk.get("reasons")
        if not isinstance(reasons, list) or len(reasons) < 2:
            return False, f"Need >=2 reasons, got {len(reasons) if isinstance(reasons, list) else 'not a list'}"
        
        if not isinstance(risk.get("safe_zones"), list):
            return False, "safe_zones not list"
        
        recs = risk.get("recommended_courses")
        if not isinstance(recs, list) or len(recs) < 1:
            return False, "Need >=1 recommended_courses"
        
        for rec in recs:
            if not isinstance(rec, dict):
                return False, "rec not dict"
            if rec.get("course_id") not in COURSE_IDS:
                return False, f"Invalid rec course_id: {rec.get('course_id')}"
            if not rec.get("why"):
                return False, "rec missing why"
        
        if not isinstance(payload.get("confidence"), int) or not (0 <= payload["confidence"] <= 100):
            return False, "Invalid confidence"
        
        return True, "ok"

    def run_all_tests(self):
        """Run all backend tests in sequence."""
        print("\n" + "=" * 80)
        print("TEONOX.AI BACKEND API TEST SUITE")
        print("=" * 80 + "\n")

        # 1. Health check
        self.test("Health check", "GET", "/", 200)

        # 2. GET /api/courses
        self.test("GET /api/courses", "GET", "/courses", 200, validate_fn=self.validate_courses)

        # 3. POST /api/leads - valid
        lead_payload = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+919876543210",
            "audience_type": "professional",
            "interest": "AI for marketing",
            "source": "test_suite",
            "form_started_at": datetime.now().timestamp() - 5,
        }
        self.test("POST /api/leads (valid)", "POST", "/leads", 200, data=lead_payload, validate_fn=self.validate_lead)

        # 4. POST /api/leads - invalid (missing email)
        invalid_lead = {
            "name": "Test",
            "phone": "+919876543210",
            "audience_type": "student",
        }
        success, _ = self.test("POST /api/leads (invalid - missing email)", "POST", "/leads", 422, data=invalid_lead)
        if success:
            self.tests_passed += 1

        # 5. POST /api/leads - invalid (bad audience_type)
        bad_audience = {
            "name": "Test",
            "email": "test@example.com",
            "phone": "+919876543210",
            "audience_type": "invalid_type",
        }
        success, _ = self.test("POST /api/leads (invalid - bad audience_type)", "POST", "/leads", 422, data=bad_audience)
        if success:
            self.tests_passed += 1

        # 6. GET /api/leads
        self.test("GET /api/leads", "GET", "/leads", 200)

        # 7. POST /api/ai/course-consultant/message (first turn)
        print("\n⏳ Testing AI Course Consultant (may take 10-20s)...")
        consultant_payload = {
            "audience_type": "professional",
            "specialization": "digital marketing",
            "message": "I post on Instagram daily for 5 brands",
            "is_first_turn": True,
        }
        success, consultant_resp = self.test(
            "POST /api/ai/course-consultant/message (first turn)",
            "POST",
            "/ai/course-consultant/message",
            200,
            data=consultant_payload,
            validate_fn=self.validate_consultant_response,
        )

        # Check if top recommendation is ai-social-media-marketing
        if success and consultant_resp:
            session_id = consultant_resp.get("session_id")
            ranking = consultant_resp.get("course_ranking", [])
            if ranking:
                top_course = ranking[0].get("course_id")
                top_pct = ranking[0].get("match_percentage")
                self.log(f"  Top recommendation: {top_course} ({top_pct}%)", "INFO")
                if top_course == "ai-social-media-marketing":
                    self.log("  ✓ Top course matches expected (ai-social-media-marketing)", "PASS")
                else:
                    self.log(f"  ⚠️  Expected ai-social-media-marketing as top, got {top_course}", "WARN")

            # 8. POST /api/ai/course-consultant/message (multi-turn)
            if session_id:
                print("\n⏳ Testing AI Course Consultant multi-turn (may take 10-20s)...")
                followup_payload = {
                    "session_id": session_id,
                    "audience_type": "professional",
                    "message": "I want to save time on caption writing",
                    "is_first_turn": False,
                }
                success2, resp2 = self.test(
                    "POST /api/ai/course-consultant/message (multi-turn)",
                    "POST",
                    "/ai/course-consultant/message",
                    200,
                    data=followup_payload,
                    validate_fn=self.validate_consultant_response,
                )
                if success2 and resp2:
                    # Check if context is retained (ranking should update)
                    ranking2 = resp2.get("course_ranking", [])
                    if ranking2:
                        top_course2 = ranking2[0].get("course_id")
                        self.log(f"  Multi-turn top: {top_course2}", "INFO")

                # 9. POST /api/ai/course-consultant/reset
                self.test(
                    "POST /api/ai/course-consultant/reset",
                    "POST",
                    "/ai/course-consultant/reset",
                    200,
                    data={"session_id": session_id},
                )

        # 10. POST /api/ai/job-risk/message (first turn)
        print("\n⏳ Testing AI Job Risk Analyzer (may take 10-20s)...")
        risk_payload = {
            "role": "Social media manager",
            "message": "I write 5 captions daily, schedule posts, and review ad performance",
            "is_first_turn": True,
        }
        success, risk_resp = self.test(
            "POST /api/ai/job-risk/message (first turn)",
            "POST",
            "/ai/job-risk/message",
            200,
            data=risk_payload,
            validate_fn=self.validate_job_risk_response,
        )

        if success and risk_resp:
            session_id_risk = risk_resp.get("session_id")
            risk_obj = risk_resp.get("risk", {})
            prob = risk_obj.get("probability", 0)
            sev = risk_obj.get("severity", "")
            recs = risk_obj.get("recommended_courses", [])
            self.log(f"  Risk: {prob}% ({sev}), {len(recs)} recommendations", "INFO")

            # 11. POST /api/ai/job-risk/message (multi-turn)
            if session_id_risk:
                print("\n⏳ Testing AI Job Risk multi-turn (may take 10-20s)...")
                followup_risk = {
                    "session_id": session_id_risk,
                    "message": "I don't use any AI tools currently",
                    "is_first_turn": False,
                }
                success3, resp3 = self.test(
                    "POST /api/ai/job-risk/message (multi-turn)",
                    "POST",
                    "/ai/job-risk/message",
                    200,
                    data=followup_risk,
                    validate_fn=self.validate_job_risk_response,
                )
                if success3 and resp3:
                    risk_obj2 = resp3.get("risk", {})
                    prob2 = risk_obj2.get("probability", 0)
                    self.log(f"  Updated risk: {prob2}%", "INFO")

                # 12. POST /api/ai/job-risk/reset
                self.test(
                    "POST /api/ai/job-risk/reset",
                    "POST",
                    "/ai/job-risk/reset",
                    200,
                    data={"session_id": session_id_risk},
                )

        # Summary
        print("\n" + "=" * 80)
        print("TEST SUMMARY")
        print("=" * 80)
        print(f"Total tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"Success rate: {success_rate:.1f}%")
        print("=" * 80 + "\n")

        return self.tests_passed == self.tests_run


def main():
    tester = TeonoxAPITester()
    all_passed = tester.run_all_tests()
    
    # Save results to JSON
    with open("/app/backend_test_results.json", "w") as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "total": tester.tests_run,
            "passed": tester.tests_passed,
            "failed": tester.tests_run - tester.tests_passed,
            "success_rate": (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0,
            "results": tester.results,
        }, f, indent=2)
    
    print(f"📄 Detailed results saved to /app/backend_test_results.json\n")
    
    return 0 if all_passed else 1


if __name__ == "__main__":
    sys.exit(main())
