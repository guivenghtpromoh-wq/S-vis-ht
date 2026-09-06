// frontend/src/utils/api.js - Secure API client with token management

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.sevis-ht.com';

// Create axios instance with secure defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Send cookies for httpOnly token
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token refresh queue to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        await apiClient.post('/auth/refresh-token');
        isRefreshing = false;
        processQueue(null);
        return apiClient(originalRequest);
      } catch (err) {
        isRefreshing = false;
        processQueue(err, null);
        
        // Clear auth and redirect to login
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.warn('Aksè refize. Ou pa gen pèmisyon.');
    }

    // Handle 429 Rate Limited
    if (error.response?.status === 429) {
      console.error('Twòp demann. Tanpri tann kèk minit.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
