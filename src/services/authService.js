import api from './api';

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      const response = await api.post('/logout');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  async getProfile() {
    try {
      const response = await api.get('/profile');
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data.data; // Laravel Resource format
      }
      return response.data; // Direct format
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }
};