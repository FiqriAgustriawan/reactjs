import api from './api';

export const bookingService = {
  async getBookings() {
    try {
      const response = await api.get('/pemesanan');
      return response.data;
    } catch (error) {
      console.error('Get bookings error:', error);
      throw error;
    }
  },

  async getAllBookings(page = 1) {
    try {
      const response = await api.get(`/pemesanan?page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Get all bookings error:', error);
      throw error;
    }
  },

  async getBooking(id) {
    try {
      const response = await api.get(`/pemesanan/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get booking error:', error);
      throw error;
    }
  },

  async createBooking(bookingData) {
    try {
      const response = await api.post('/pemesanan', bookingData);
      return response.data;
    } catch (error) {
      console.error('Create booking error:', error);
      throw error;
    }
  },

  async updateBooking(id, bookingData) {
    try {
      const response = await api.put(`/pemesanan/${id}`, bookingData);
      return response.data;
    } catch (error) {
      console.error('Update booking error:', error);
      throw error;
    }
  },

  async deleteBooking(id) {
    try {
      const response = await api.delete(`/pemesanan/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete booking error:', error);
      throw error;
    }
  }
};