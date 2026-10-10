import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject Auth token header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hypril_token') || localStorage.getItem('vyro_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global retries for GET requests and 401 unauth
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (config && config.method === 'get' && (!config._retryCount || config._retryCount < 2)) {
      config._retryCount = (config._retryCount || 0) + 1;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return api(config);
    }
    return Promise.reject(error);
  }
);

export default api;
