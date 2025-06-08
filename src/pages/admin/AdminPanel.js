import React, { useState, useEffect } from 'react';
import { filmService } from '../../services/filmService';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import AdminLayout from '../../components/AdminLayout';

const AdminPanel = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    try {
      const response = await filmService.getAllFilms();

      // Handle Laravel Resource Collection response
      let filmsData = [];
      let paginationData = null;

      if (response && typeof response === 'object') {
        // Laravel Resource Collection format
        if (response.data && Array.isArray(response.data)) {
          filmsData = response.data;
          // Extract pagination info
          paginationData = {
            current_page: response.current_page,
            last_page: response.last_page,
            per_page: response.per_page,
            total: response.total
          };
        }
        // Direct array format
        else if (Array.isArray(response)) {
          filmsData = response;
        }
        // Single data property
        else if (response.data) {
          filmsData = Array.isArray(response.data) ? response.data : [];
        }
      } else if (Array.isArray(response)) {
        filmsData = response;
      }

      setFilms(filmsData);
      setPagination(paginationData);
    } catch (error) {
      setError('Failed to fetch films');
      console.error('Error:', error);
      setFilms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filmId) => {
    if (window.confirm('Are you sure you want to delete this film?')) {
      try {
        await filmService.deleteFilm(filmId);
        fetchFilms(); // Refresh the list
      } catch (error) {
        setError('Failed to delete film');
        console.error('Error:', error);
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Films Management</h1>
            {pagination && (
              <p className="text-sm text-gray-500 mt-1">
                Total: {pagination.total} films
              </p>
            )}
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Film
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Films Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {films.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No films found</p>
            </div>
          ) : (
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
                          src={film.poster_url || 'https://via.placeholder.com/60x80?text=No+Image'}
                          alt={film.judul}
                          className="h-16 w-12 object-cover rounded"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/60x80?text=No+Image';
                          }}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{film.judul || 'Untitled'}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{film.deskripsi || 'No description'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {film.durasi || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {film.harga_tiket ? `Rp ${parseInt(film.harga_tiket).toLocaleString()}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {film.tanggal_rilis ? new Date(film.tanggal_rilis).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${film.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {film.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(film.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPanel;