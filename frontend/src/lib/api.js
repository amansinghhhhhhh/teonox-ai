import axios from 'axios';

const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
const API_BASE = `${BACKEND_URL}/api`;

const VISITOR_ID_KEY = 'teonox_visitor_id';
const AI_ACCESS_TOKEN_KEY = 'teonox_ai_access_token';

const makeId = () => {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const getVisitorId = () => {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
        visitorId = makeId();
        localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    return visitorId;
};

export const getAiAccessToken = () => localStorage.getItem(AI_ACCESS_TOKEN_KEY);

export const storeAiAccessToken = (token) => {
    if (token) localStorage.setItem(AI_ACCESS_TOKEN_KEY, token);
};

export const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
    timeout: 60000,
});

api.interceptors.request.use((config) => {
    config.headers['X-Visitor-Id'] = getVisitorId();
    const token = getAiAccessToken();
    if (token) config.headers['X-AI-Access-Token'] = token;
    return config;
});

export const getCourses = () => api.get('/courses').then((r) => r.data);

export const createLead = (payload) =>
    api.post('/leads', payload).then((r) => {
        storeAiAccessToken(r.data?.ai_access_token);
        return r.data;
    });

export const consultantMessage = (payload) =>
    api.post('/ai/course-consultant/message', payload).then((r) => r.data);

export const consultantReset = (session_id) =>
    api.post('/ai/course-consultant/reset', { session_id }).then((r) => r.data);

export const jobRiskMessage = (payload) =>
    api.post('/ai/job-risk/message', payload).then((r) => r.data);

export const jobRiskReset = (session_id) =>
    api.post('/ai/job-risk/reset', { session_id }).then((r) => r.data);
