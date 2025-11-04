import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api';
const HOST_BASE_URL = 'https://campus-connect-one-green.vercel.app/api'

const api = axios.create({
  baseURL: HOST_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
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

export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  getCurrentUser: () => api.get('/auth/me'),
};

export default api;