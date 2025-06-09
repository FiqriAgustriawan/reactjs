import React, { useState, useEffect } from "react";
import { filmService } from "../../services/filmService";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import AdminLayout from "../../components/AdminLayout";
import FilmForm from "../../components/admin/FilmForm";

const AdminFilms = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pagination, setPagination] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFilm, setEditingFilm] = useState(null);

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async (page = 1) => {
    setLoading(true);
    try {
      const response = await filmService.getAllFilmsAdmin(page);

      let filmsData = [];
      let paginationData = null;

      if (response && typeof response === "object") {
        if (response.data && Array.isArray(response.data)) {
          filmsData = response.data;
          if (response.meta && response.meta.pagination) {
            paginationData = response.meta.pagination;
          } else {
            paginationData = {
              current_page: response.current_page,
              last_page: response.last_page,
              per_page: response.per_page,
              total: response.total,
            };
          }
        } else if (Array.isArray(response)) {
          filmsData = response;
        } else if (response.data) {
          filmsData = Array.isArray(response.data) ? response.data : [];
        }
      } else if (Array.isArray(response)) {
        filmsData = response;
      }

      setFilms(filmsData);
      setPagination(paginationData);
      setError(""); // Clear any previous errors
    } catch (error) {
      setError(
        "Failed to fetch films: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error fetching films:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFilm = () => {
    setEditingFilm(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleEditFilm = (film) => {
    setEditingFilm(film);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleSubmitFilm = async (formData) => {
    try {
      if (editingFilm) {
        await filmService.updateFilm(editingFilm.id, formData);
        setSuccess("Film berhasil diperbarui!");
      } else {
        await filmService.createFilm(formData);
        setSuccess("Film berhasil ditambahkan!");
      }

      await fetchFilms(); // Refresh the list
      setShowForm(false);
      setEditingFilm(null);
      setError("");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      throw error; // Let the form handle the error
    }
  };

  const handleDelete = async (filmId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this film? This action cannot be undone."
      )
    ) {
      try {
        setError("");
        const response = await filmService.deleteFilm(filmId);

        if (response.success || response.message) {
          setSuccess(response.message || "Film berhasil dihapus!");
          await fetchFilms(); // Refresh the list

          // Clear success message after 3 seconds
          setTimeout(() => setSuccess(""), 3000);
        }
      } catch (error) {
        console.error("Error deleting film:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to delete film";
        setError("Failed to delete film: " + errorMessage);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingFilm(null);
    setError("");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Films Management
            </h1>
            {pagination && (
              <p className="text-sm text-gray-500 mt-1">
                Total: {pagination.total} films
              </p>
            )}
          </div>
          <button
            onClick={handleAddFilm}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Film
          </button>
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        ) : (
          /* Films Table */
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {films.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No films found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Film
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Release Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {films.map((film) => (
                      <tr key={film.id || Math.random()}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={
                                film.poster_url ||
                                "https://via.placeholder.com/60x80?text=No+Image"
                              }
                              alt={film.judul}
                              className="h-16 w-12 object-cover rounded"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/60x80?text=No+Image";
                              }}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {film.judul || "Untitled"}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-2">
                                {film.deskripsi || "No description"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {film.durasi ? `${film.durasi} min` : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {film.harga_tiket
                            ? `Rp ${parseInt(
                                film.harga_tiket
                              ).toLocaleString()}`
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {film.tanggal_rilis
                            ? new Date(film.tanggal_rilis).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              film.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {film.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleEditFilm(film)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Edit film"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(film.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete film"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => fetchFilms(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className={`px-3 py-1 rounded-md ${
                  pagination.current_page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === pagination.last_page ||
                    (page >= pagination.current_page - 1 &&
                      page <= pagination.current_page + 1)
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 py-1 text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => fetchFilms(page)}
                      className={`px-3 py-1 rounded-md ${
                        page === pagination.current_page
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}

              <button
                onClick={() => fetchFilms(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className={`px-3 py-1 rounded-md ${
                  pagination.current_page === pagination.last_page
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {/* Film Form Modal */}
        <FilmForm
          isOpen={showForm}
          onClose={handleCloseForm}
          onSubmit={handleSubmitFilm}
          initialData={editingFilm}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminFilms;
