import api from "./api";

export const filmService = {
  // Get all films (public - active films only)
  getAllFilms: async (page = 1) => {
    const response = await api.get(`/films?page=${page}`);
    return response.data;
  },

  // Get all films for admin (including inactive)
  getAllFilmsAdmin: async (page = 1) => {
    const response = await api.get(`/admin/films?page=${page}`);
    return response.data;
  },

  // Get single film by slug
  getFilm: async (slug) => {
    const response = await api.get(`/films/${slug}`);
    return response.data;
  },

  // Create new film
  createFilm: async (formData) => {
    const response = await api.post("/admin/films", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update film
  updateFilm: async (id, formData) => {
    const response = await api.post(`/admin/films/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-HTTP-Method-Override": "PUT",
      },
    });
    return response.data;
  },

  // Delete film
  deleteFilm: async (id) => {
    const response = await api.delete(`/admin/films/${id}`);
    return response.data;
  },
};
