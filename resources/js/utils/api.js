// resources/js/utils/api.js
import axios from 'axios';

/**
 * Axios instance configured for Laravel API
 * Automatically handles CSRF tokens and authentication
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('auth-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

/**
 * Helper functions for common API operations
 */
export const apiHelpers = {
  // Get request
  get: (url, config = {}) => api.get(url, config),

  // Post request
  post: (url, data, config = {}) => api.post(url, data, config),

  // Put request
  put: (url, data, config = {}) => api.put(url, data, config),

  // Delete request
  delete: (url, config = {}) => api.delete(url, config),

  // Patch request
  patch: (url, data, config = {}) => api.patch(url, data, config),
};
