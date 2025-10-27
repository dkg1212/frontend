// src/api.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export const googleAuth = (code, params = {}) =>
  axios.get(`${API_BASE}/auth/google`, {
    params: { code, ...params },
    withCredentials: true,
  });
