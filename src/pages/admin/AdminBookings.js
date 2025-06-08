import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import AdminLayout from '../../components/AdminLayout';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async (page = 1) => {
    setLoading(true);
    try {
      const response = await bookingService.getAllBookings(page); // Admin endpoint to get all bookings

      let bookingsData = [];
      let paginationData = null;

      if (response && typeof response === 'object') {
        if (response.data && Array.isArray(response.data)) {
          bookingsData = response.data;
          // Extract pagination info
          if (response.meta && response.meta.pagination) {
            paginationData = response.meta.pagination;
          } else {
            paginationData = {
              current_page: response.current_page,
              last_page: response.last_page,
              per_page: response.per_page,
              total: response.total
            };
          }
        }
        else if (Array.isArray(response)) {
          bookingsData = response;
        }
        else if (response.data) {
          bookingsData = Array.isArray(response.data) ? response.data : [];
        }
      } else if (Array.isArray(response)) {
        bookingsData = response;
      }

      setBookings(bookingsData);
      setPagination(paginationData);
    } catch (error) {
      setError('Failed to fetch bookings: ' + (error.response?.data?.message || error.message));
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await bookingService.updateBooking(bookingId, { status });
      fetchBookings(); // Refresh the list
    } catch (error) {
      setError('Failed to update booking: ' + (error.response?.data?.message || error.message));
      console.error('Error updating booking:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
            {pagination && (
              <p className="text-sm text-gray-500 mt-1">
                Total: {pagination.total} bookings
              </p>
            )}
          </div>
        </div>

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
          /* Bookings Table */
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {bookings.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No bookings found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Film
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tickets
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
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
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #{booking.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.user?.name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500">{booking.user?.email || 'No email'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.film?.judul || 'Unknown'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.jumlah_tiket || '1'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.waktu_pemesanan
                            ? new Date(booking.waktu_pemesanan).toLocaleDateString()
                            : (booking.created_at ? new Date(booking.created_at).toLocaleDateString() : 'N/A')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-700">
                          Rp {booking.total_harga ? parseInt(booking.total_harga).toLocaleString() : '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            {booking.status !== 'confirmed' && (
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                className="p-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
                                title="Confirm"
                              >
                                <CheckIcon className="h-4 w-4" />
                              </button>
                            )}
                            {booking.status !== 'canceled' && (
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'canceled')}
                                className="p-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                                title="Cancel"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            )}
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
                onClick={() => fetchBookings(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className={`px-3 py-1 rounded-md ${pagination.current_page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
              >
                Previous
              </button>

              {/* Page numbers */}
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                .filter(page =>
                  page === 1 ||
                  page === pagination.last_page ||
                  (page >= pagination.current_page - 1 && page <= pagination.current_page + 1)
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 py-1 text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => fetchBookings(page)}
                      className={`px-3 py-1 rounded-md ${page === pagination.current_page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))
              }

              <button
                onClick={() => fetchBookings(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className={`px-3 py-1 rounded-md ${pagination.current_page === pagination.last_page
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;