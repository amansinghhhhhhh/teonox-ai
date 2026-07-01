# Teonox.ai

Self-hosted React + FastAPI + MongoDB app for Teonox.ai.

## Environment

Copy the example files and fill in your own values:

- `backend/.env.example` -> `backend/.env`
- `frontend/.env.example` -> `frontend/.env`

Backend:

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=teonox_ai
CORS_ORIGINS=http://localhost:3000
GROQ_API_KEY=replace-with-your-groq-api-key
GROQ_MODEL=llama-3.3-70b-versatile
USAGE_HASH_SECRET=replace-with-a-long-random-secret
AI_FEATURES_ENABLED=true
```

Frontend:

```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

## Services

- Backend: FastAPI, MongoDB, Groq chat completions
- Frontend: React, CRACO, Tailwind/shadcn components

Set `BACKEND_API_URL` when running `backend_test.py` against a deployed backend.

## AI Usage Controls

The public AI tools are low-friction demos with backend-only limits:

- Course Consultant: 6 anonymous AI turns/day, 18 after masterclass signup
- Job Risk: 4 anonymous AI turns/day, 12 after masterclass signup
- Shared abuse limits: 10 visitor calls/10 min, 60 IP calls/hour, 200 IP calls/day, 1000 global calls/day
- Masterclass signup returns a 30-day signed AI access token; no OTP or CAPTCHA is required

All limits are configurable in `backend/.env`.
