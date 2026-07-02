import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

// Request interceptor: add auth token or any headers
axios.interceptors.request.use(
  (config) => {
    config.headers = { "Content-Type": "application/json" };
    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;