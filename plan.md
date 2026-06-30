# plan.md — Teonox.ai Multi‑Page EdTech Landing (MVP)

## 1) Objectives
- Build a mobile-first, multi-page landing site that converts 4 audiences (students, professionals, business owners, parents) into **Free Live Masterclass** signups.
- Establish trust via “The Gap” narrative: most AI courses are incomplete; Teonox teaches job-used, practical AI workflows.
- Deliver 2 core AI experiences powered by **Claude Sonnet 4.5** that drive personalization:
  - **AI Course Consultant** (chat + structured course ranking for live reshuffle UI)
  - **“AI aapki Job legi?” Risk Analyzer** (chat + structured risk metrics for infographic + course recommendations)
- Create updated **teonox.ai** logo (heritage-inspired, not identical) and modern brand system (charcoal/navy + orange + white, subtle AI hint).

## 2) Implementation Steps (Phased)

### Phase 1 — Core POC (Isolation) ✅ must pass before app work
**Goal:** Prove Claude can reliably return **(a) human chat text + (b) strict JSON** for live UI updates.

**Build (single Python script):**
- Websearch: best practice for Anthropic/Claude structured outputs + JSON schema prompting + retry strategies.
- Implement `poc_llm_structured.py` using `emergentintegrations` (Claude Sonnet 4.5) with two functions:
  1) `course_consultant(profile_type, specialization, user_message)` → returns:
     - `assistant_message` (string)
     - `course_ranking[]`: `{course_id, match_percentage(0-100), label, reason}`
  2) `job_risk_analyzer(role, tasks, tools_used, user_message)` → returns:
     - `assistant_message` (string)
     - `risk`: `{probability(0-100), severity(low/med/high), reasons[], recommended_courses[]}`
- Enforce strict JSON parsing:
  - Response must include a JSON block only (or `json` fenced block), parse with Python, validate keys/types.
  - Add retry-on-parse-failure with a “return valid JSON only” correction prompt.
- Test with 8–10 representative inputs (each audience + 2 edge cases like vague answers).

**Exit criteria (must meet):**
- ≥95% successful parses across the test set.
- Rankings are stable (all 7 course_ids always present, percentages in range, sensible ordering).
- Risk output always includes probability + severity + ≥2 reasons + ≥1 recommended course.

**User stories (Phase 1):**
1. As a user, I want the consultant to recommend courses that match my background so I don’t waste time.
2. As a user, I want the recommendations to update live so the experience feels intelligent and trustworthy.
3. As a user, I want the job-risk analysis to show a clear probability so I can judge urgency.
4. As a user, I want reasons behind the risk score so it doesn’t feel like a random number.
5. As a user, I want course recommendations tied to my risk so I know what to do next.

---

### Phase 2 — V1 App Development (React + FastAPI + MongoDB)
**Goal:** Build the full multi-page site around the proven LLM core, optimized for mobile.

**Backend (FastAPI):**
- Mongo models/collections:
  - `leads` (masterclass signups: name, email, phone/whatsapp, audience_type, interest, created_at)
  - `chat_sessions` (optional lightweight logging for iteration)
- API endpoints:
  - `POST /api/leads` (masterclass signup)
  - `POST /api/ai/course-consultant` (wrap proven POC logic)
  - `POST /api/ai/job-risk` (wrap proven POC logic)
  - `GET /api/courses` (returns 7 pilot courses)
- Generate realistic placeholder course data (modules, duration, level, outcomes, suggested projects).

**Frontend (React + Tailwind + shadcn/ui + Framer Motion + Lottie):**
- Global:
  - Mobile-first layout, sticky CTA, fast loading, reduced-motion support.
  - Brand tokens: charcoal/navy + orange + white; subtle AI hint via gradients/lines (no heavy 3D libs).
  - New `teonox.ai` logo as SVG (heritage-inspired wordmark; orange `.ai`; updated x-corner node motif).
- Pages:
  1) **Home**: hero + witty tagline, animated abstract “3D-feel” (Lottie/CSS), scroll storytelling → masterclass signup.
  2) **The Gap**: trust narrative + 4 audience sections, credibility blocks, clear CTA.
  3) **Explore Courses**: audience selector → specialization → chatbot; live reshuffle list with match badges; toggle library view.
  4) **Results**: before/after story cards mapped to courses.
  5) **AI aapki Job legi?**: chatbot + live infographic driven by structured risk JSON.

**End of Phase 2:** Run 1 full E2E test pass (signup, both chatbots, reshuffle UI, infographic updates, mobile breakpoints).

**User stories (Phase 2):**
1. As a visitor, I want the homepage to quickly explain Teonox in one scroll so I know I’m in the right place.
2. As a visitor, I want to sign up for the free masterclass in under 30 seconds on mobile.
3. As a learner, I want course recommendations to visually reorder so I instantly see what fits best.
4. As a user, I want to view a normal course list if I don’t want to chat.
5. As a visitor, I want to see relatable results stories so I can picture my own transformation.

---

### Phase 3 — UX/Quality Improvements (MVP+)
**Goal:** Improve trust, conversion, and robustness without adding heavy complexity.

- Prompt tuning based on real QA: reduce verbosity, increase decisiveness, enforce “ask 1 question at a time”.
- Add guardrails:
  - “Not medical/legal advice” microcopy where relevant.
  - Safer outputs + refusal handling.
- Performance:
  - Route-based code splitting, image optimization, Lottie lazy load.
- Lead handling:
  - Basic admin view (minimal) to list/export leads OR CSV export endpoint.
- Better storytelling:
  - Add micro-interactions (badge transitions, progress indicator in chat flows).

**End of Phase 3:** Run 1 more E2E test pass + mobile UX pass (low-end Android responsiveness).

**User stories (Phase 3):**
1. As a user, I want the chatbot to ask fewer, better questions so I reach recommendations faster.
2. As a user, I want the site to load fast on mobile data so I don’t bounce.
3. As an operator, I want to export leads so I can follow up on WhatsApp.
4. As a visitor, I want clearer trust signals so I feel safe submitting my phone number.
5. As a user, I want the risk infographic to update smoothly so I understand changes instantly.

---

### Phase 4 — Optional Additions (only after V1 is stable)
- Add WhatsApp click-to-chat confirmation after signup (no WhatsApp API dependency).
- Add lightweight CMS-ish JSON editing for course content.
- SEO polish: structured data, meta, OG images per page.

**User stories (Phase 4):**
1. As a user, I want to instantly open WhatsApp after signup so I feel confirmed.
2. As a visitor, I want to share Teonox pages with rich previews so it looks credible.
3. As an operator, I want to update course copy without redeploying frequently.
4. As a user, I want FAQs that answer objections so I can decide faster.
5. As a user, I want localized Hinglish microcopy so the brand feels relatable.

## 3) Next Actions
1. Execute Phase 1 POC: implement the single Python script + run the test set until parse success is consistent.
2. Freeze the JSON schemas for both AI features (course ranking + risk metrics).
3. Draft the 7 course objects (IDs/names fixed) to match the schemas.
4. Proceed to Phase 2 build only after Phase 1 exit criteria pass.

## 4) Success Criteria
- POC: consistent strict JSON parsing and validation for both AI features (meets Phase 1 exit criteria).
- V1: All 5 pages work end-to-end on mobile; CTAs visible; signup stored in MongoDB.
- Explore Courses: live reshuffle + match badges update from structured AI output without UI glitches.
- Job Risk page: infographic updates from structured AI output; includes recommendations.
- Overall: clear narrative + trust + measurable conversion path to masterclass signup.
