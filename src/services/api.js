import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://ecomerce-khjs.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject Auth token header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vyro_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global 401 unauth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      // localStorage.removeItem('vyro_token');
    }
    return Promise.reject(error);
  }
);

export default api;
