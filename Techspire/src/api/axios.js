import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Temporary diagnostic - remove after confirming auth works
  if (import.meta.env.DEV || config.url?.includes('/api/uploads') || config.url?.includes('/api/categories') || config.url?.includes('/api/products')) {
    console.log('[API]', config.method?.toUpperCase(), config.url, token ? 'TOKEN_SET' : 'NO_TOKEN');
  }
  return config;
});

export default API;