import axios from 'axios';

// In production (cloud), VITE_API_URL is set to the full backend URL.
// In local dev, it falls back to '/api' which Vite proxies to localhost:5000.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  create: (userData) => api.post('/users', userData),
  delete: (userId) => api.delete(`/users/${userId}`),
};

// Flat Members API
export const flatMembersAPI = {
  getAll: () => api.get('/flat-members'),
  create: (memberData) => api.post('/flat-members', memberData),
  update: (memberId, memberData) => api.put(`/flat-members/${memberId}`, memberData),
  delete: (memberId) => api.delete(`/flat-members/${memberId}`),
};

// Transactions API
export const transactionsAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/transactions?${params}`);
  },
  create: (transactionData) => api.post('/transactions', transactionData),
  update: (transactionId, transactionData) => api.put(`/transactions/${transactionId}`, transactionData),
  delete: (transactionId) => api.delete(`/transactions/${transactionId}`),
};

// Dashboard API
export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary'),
};

// Reports API
export const reportsAPI = {
  getExpenseSummary: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/reports/expense-summary?${params}`);
  },
  getMaintenanceStatus: (month, year) => {
    const params = new URLSearchParams({ month, year });
    return api.get(`/reports/maintenance-status?${params}`);
  },
  getMonthlySummary: (year) => {
    const params = new URLSearchParams({ year });
    return api.get(`/reports/monthly-summary?${params}`);
  },
};

export default api;

// Made with Bob
