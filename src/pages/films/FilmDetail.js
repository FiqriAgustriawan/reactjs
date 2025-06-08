import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { filmService } from '../../services/filmService';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import {
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon,
  CalendarIcon,
  TicketIcon
} from '@heroicons/react/24/outline';

const FilmDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState(1);

  useEffect(() => {
    fetchFilm();
  }, [id]);

  const fetchFilm = async () => {
    try {
      const response = await filmService.getFilm(id);

      // Handle Laravel Resource response
      let filmData = null;

      if (response && typeof response === 'object') {
        // Check if it's a Resource response with data property
        filmData = response.data || response;
      }

      setFilm(filmData);
    } catch (error) {
      setError('Film not found');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    try {
      // Sesuaikan dengan PemesananController validation
      await bookingService.createBooking({
        film_id: film.id,
        jumlah_tiket: ticketQuantity
        // total_harga akan dihitung otomatis di backend
      });

      setSuccess('Booking successful!');
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (error) {
      setError('Booking failed. Please try again.');
      console.error('Error:', error);
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateTotal = () => {
    if (film?.harga_tiket) {
      return parseInt(film.harga_tiket) * ticketQuantity;
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (error && !film) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Film Poster */}
            <div className="md:w-1/3">
              <img
                src={film?.poster_url || 'https://via.placeholder.com/400x600?text=No+Image'}
                alt={film?.judul}
                className="w-full h-96 md:h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x600?text=No+Image';
                }}
              />
            </div>

            {/* Film Details */}
            <div className="md:w-2/3 p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {film?.judul}
              </h1>

              <div className="flex items-center mb-4">
                <StarIcon className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="text-lg text-gray-600">8.5/10</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>{film?.durasi || '120 minutes'}</span>
                </div>

                <div className="flex items-center text-green-600 font-semibold">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                  <span>Rp {film?.harga_tiket ? parseInt(film.harga_tiket).toLocaleString() : '50,000'}</span>
                </div>
              </div>

              {film?.tanggal_rilis && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Release Date</h3>
                  <p className="text-gray-600">{new Date(film.tanggal_rilis).toLocaleDateString()}</p>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {film?.deskripsi || 'An amazing movie that will take you on an incredible journey filled with action, drama, and unforgettable moments.'}
                </p>
              </div>

              {/* Booking Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Book This Movie</h3>

                <div className="flex items-center mb-4">
                  <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">Available for booking today</span>
                </div>

                {film?.is_active ? (
                  <div className="space-y-4">
                    {/* Ticket Quantity Selector */}
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center text-gray-700">
                        <TicketIcon className="h-5 w-5 mr-2" />
                        Number of tickets:
                      </label>
                      <select
                        value={ticketQuantity}
                        onChange={(e) => setTicketQuantity(parseInt(e.target.value))}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>

                    {/* Total Price */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Total Price:</span>
                        <span className="text-xl font-bold text-green-600">
                          Rp {calculateTotal().toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleBooking}
                      disabled={bookingLoading}
                      className={`w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors ${bookingLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                      {bookingLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Booking...
                        </div>
                      ) : (
                        'Book Now'
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-red-600 font-medium">
                    This movie is currently not available for booking
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmDetail;