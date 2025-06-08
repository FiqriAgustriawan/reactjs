import api from './api';

export const filmService = {
  async getFilms() {
    const response = await api.get('/films');
    return response.data;
  },

  async getFilm(slug) {
    const response = await api.get(`/films/${slug}`);
    return response.data;
  },

  async getFilmBySlug(slug) {
    const response = await api.get(`/films/${slug}`);
    return response.data;
  },

  async getAllFilms() {
    const response = await api.get('/admin/films');
    return response.data;
  },

  async createFilm(filmData) {
    // Konversi FormData jika ada file
    const formData = new FormData();

    Object.keys(filmData).forEach(key => {
      if (filmData[key] !== null && filmData[key] !== undefined) {
        formData.append(key, filmData[key]);
      }
    });

    const response = await api.post('/films', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateFilm(slug, filmData) {
    // Konversi FormData jika ada file
    const formData = new FormData();
    formData.append('_method', 'PUT'); // Laravel method spoofing

    Object.keys(filmData).forEach(key => {
      if (filmData[key] !== null && filmData[key] !== undefined) {
        formData.append(key, filmData[key]);
      }
    });

    const response = await api.post(`/films/${slug}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteFilm(slug) {
    const response = await api.delete(`/films/${slug}`);
    return response.data;
  }
};