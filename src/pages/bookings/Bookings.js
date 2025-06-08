import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import { TrashIcon, TicketIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

const Bookings = () => {
  const [bookings, setBookings] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await bookingService.getBookings();

      // Handle different API response structures
      let bookingsData = [];

      if (response && typeof response === 'object') {
        // Laravel Resource Collection format
        if (response.data && Array.isArray(response.data)) {
          bookingsData = response.data;
        }
        // Direct array format
        else if (Array.isArray(response)) {
          bookingsData = response;
        }
        // Single data property
        else if (response.data) {
          bookingsData = Array.isArray(response.data) ? response.data : [];
        }
        // Check for success property with data
        else if (response.success && response.data) {
          bookingsData = Array.isArray(response.data) ? response.data : [];
        }
      } else if (Array.isArray(response)) {
        bookingsData = response;
      }

      setBookings(bookingsData);
    } catch (error) {
      setError('Failed to fetch bookings');
      console.error('Error:', error);
      setBookings([]); // Ensure bookings is always an array even on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.deleteBooking(bookingId);
        fetchBookings(); // Refresh the list
      } catch (error) {
        setError('Failed to cancel booking');
        console.error('Error:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Additional safety check */}
        {!Array.isArray(bookings) || bookings.length === 0 ? (
          <div className="text-center py-12">
            <TicketIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {!Array.isArray(bookings) ? 'Error loading bookings' : 'No bookings yet'}
            </h3>
            <p className="text-gray-600">
              {!Array.isArray(bookings)
                ? 'Please try refreshing the page'
                : 'Start by booking your favorite movies!'
              }
            </p>
            {!Array.isArray(bookings) && (
              <button
                onClick={fetchBookings}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking, index) => (
              <div key={booking?.id || `booking-${index}`} className="bg-white rounded-xl shadow-lg p-6">
                {/* Film Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {booking?.film?.judul || booking?.film?.title || 'Movie Title'}
                  </h3>

                  {booking?.film?.poster_url && (
                    <img
                      src={booking.film.poster_url}
                      alt={booking.film.judul || booking.film.title}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x600?text=No+Image';
                      }}
                    />
                  )}
                </div>

                {/* Booking Details */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      Booking Date: {booking?.tanggal_pemesanan || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <TicketIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      Tickets: {booking?.jumlah_tiket || 1}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      Status: {booking?.status || 'Confirmed'}
                    </span>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-green-600 font-semibold">
                      Total: Rp {booking?.total_harga
                        ? parseInt(booking.total_harga).toLocaleString()
                        : (booking?.film?.harga_tiket
                          ? parseInt(booking.film.harga_tiket).toLocaleString()
                          : '50,000')
                      }
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(booking?.id)}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;