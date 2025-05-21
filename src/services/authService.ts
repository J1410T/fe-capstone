import axios from 'axios';
import { env } from '@/config/env';

// Create axios instance
const api = axios.create({
  baseURL: env.API_SERVER,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth service
export const authService = {
  // Google OAuth login
  googleLogin: async (credential: string) => {
    try {
      const response = await api.post('/auth/google', { credential });
      return response.data;
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('accessToken');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still remove token on client side even if server logout fails
      localStorage.removeItem('accessToken');
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  },
};

export default authService;
