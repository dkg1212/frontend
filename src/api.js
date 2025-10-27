// src/api.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

// Exchange Google auth code on backend; accepts optional profile params during first login
export const googleAuth = (code, params = {}) =>
  axios.get(`${API_BASE}/auth/google`, {
    params: { code, ...params },
    withCredentials: true,
  });

// Update logged-in user's profile after login using JWT
export const updateProfile = (payload, token) =>
  axios.put(`${API_BASE}/auth/profile`, payload, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
