
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Mock API URL - in real projects, this would be an environment variable
const API_URL = 'https://reqres.in/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to add the token to all requests
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication services
export const authApi = {
  // Register a new user
  register: async (email: string, password: string) => {
    try {
      // For reqres.in we're using their register endpoint
      const response = await api.post('/register', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login a user
  login: async (email: string, password: string) => {
    try {
      // For reqres.in we're using their login endpoint
      const response = await api.post('/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      // For reqres.in we can use their users endpoint to get a mock user
      const response = await api.get('/users/2');
      
      // Transform the response to match our expected profile format
      return {
        email: response.data.data.email || 'test@example.com',
        registrationDate: new Date().toISOString(),
        subscriptions: ['Free Plan', 'Basic Access'],
      };
    } catch (error) {
      throw error;
    }
  },
};
