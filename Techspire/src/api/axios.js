import axios from 'axios';

const API = axios.create({
  baseURL: '', // Empty for Vite proxy (relative URLs)
  withCredentials: true, // Required for cookie handling
});

export default API;