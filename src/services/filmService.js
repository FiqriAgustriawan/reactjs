import api from "./api";

export const filmService = {
  // Get all films (public - active films only)
  getAllFilms: async (page = 1) => {
    try {
      const response = await api.get(`/films?page=${page}`);
      return response.data;
    } catch (error) {
      console.error("Error getting all films:", error);
      throw error;
    }
  },

  // Get all films for admin (including inactive)
  getAllFilmsAdmin: async (page = 1) => {
    try {
      const response = await api.get(`/admin/films?page=${page}`);
      return response.data;
    } catch (error) {
      console.error("Error getting admin films:", error);
      throw error;
    }
  },

  // Get single film by slug (untuk public)
  getFilm: async (slug) => {
    try {
      console.log("Fetching film with slug:", slug);
      const response = await api.get(`/films/${slug}`);
      console.log("Film API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting film by slug:", slug, error);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  },

  // Get single film by ID (untuk admin)
  getFilmById: async (id) => {
    try {
      const response = await api.get(`/admin/films/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error getting film by ID:", id, error);
      throw error;
    }
  },

  // Create new film
  createFilm: async (formData) => {
    try {
      const response = await api.post("/admin/films", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating film:", error);
      throw error;
    }
  },

  // Update film
  updateFilm: async (id, formData) => {
    try {
      const response = await api.post(`/admin/films/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-HTTP-Method-Override": "PUT",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating film:", error);
      throw error;
    }
  },

  // Delete film
  deleteFilm: async (id) => {
    try {
      const response = await api.delete(`/admin/films/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting film:", error);
      throw error;
    }
  },
};
