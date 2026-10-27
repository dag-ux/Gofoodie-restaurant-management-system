import axios from 'axios';

const axiosClient = axios.create({
  // 👇 Uses Vercel Environment Variable in production, falls back to localhost for development
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Automatically attach the token to every request if it exists
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('gofoodie_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;