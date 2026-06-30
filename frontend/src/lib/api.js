import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
    timeout: 60000,
});

export const getCourses = () => api.get('/courses').then((r) => r.data);

export const createLead = (payload) => api.post('/leads', payload).then((r) => r.data);

export const consultantMessage = (payload) =>
    api.post('/ai/course-consultant/message', payload).then((r) => r.data);

export const consultantReset = (session_id) =>
    api.post('/ai/course-consultant/reset', { session_id }).then((r) => r.data);

export const jobRiskMessage = (payload) =>
    api.post('/ai/job-risk/message', payload).then((r) => r.data);

export const jobRiskReset = (session_id) =>
    api.post('/ai/job-risk/reset', { session_id }).then((r) => r.data);
