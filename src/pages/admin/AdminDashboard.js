import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FilmIcon, TicketIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import AdminLayout from '../../components/AdminLayout';
import { filmService } from '../../services/filmService';
import { bookingService } from '../../services/bookingService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    films: 0,
    bookings: 0,
    users: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Gunakan endpoints yang sudah ada untuk menyusun dashboard stats
      const filmsData = await filmService.getAllFilms();
      const bookingsData = await bookingService.getAllBookings();

      // Extract data
      let filmsCount = 0;
      let bookingsCount = 0;
      let usersCount = 0;
      let totalRevenue = 0;

      // Process films data
      if (filmsData && filmsData.data) {
        filmsCount = filmsData.data.length;
      } else if (Array.isArray(filmsData)) {
        filmsCount = filmsData.length;
      } else if (filmsData && filmsData.meta && filmsData.meta.total) {
        filmsCount = filmsData.meta.total;
      }

      // Process bookings data
      if (bookingsData && bookingsData.data) {
        bookingsCount = bookingsData.data.length;
        // Calculate revenue
        bookingsData.data.forEach(booking => {
          if (booking.total_harga && booking.status === 'confirmed') {
            totalRevenue += parseInt(booking.total_harga);
          }
        });
      } else if (Array.isArray(bookingsData)) {
        bookingsCount = bookingsData.length;
        // Calculate revenue
        bookingsData.forEach(booking => {
          if (booking.total_harga && booking.status === 'confirmed') {
            totalRevenue += parseInt(booking.total_harga);
          }
        });
      } else if (bookingsData && bookingsData.meta && bookingsData.meta.total) {
        bookingsCount = bookingsData.meta.total;
      }

      // For user count, we can estimate from bookings for now
      // Typically would use a separate userService.getUsers() call
      const uniqueUserIds = new Set();
      if (bookingsData && bookingsData.data) {
        bookingsData.data.forEach(booking => {
          if (booking.user && booking.user.id) {
            uniqueUserIds.add(booking.user.id);
          }
        });
      } else if (Array.isArray(bookingsData)) {
        bookingsData.forEach(booking => {
          if (booking.user && booking.user.id) {
            uniqueUserIds.add(booking.user.id);
          }
        });
      }
      usersCount = uniqueUserIds.size;

      setStats({
        films: filmsCount,
        bookings: bookingsCount,
        users: usersCount,
        revenue: totalRevenue
      });
    } catch (error) {
      setError('Failed to fetch dashboard data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6   shadow-md border border-gray-100">
                <div className="flex items-center space-x-4">
                 
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total User</p>
                    <p className="text-2xl font-semibold text-gray-900 text-center">150</p>
                  </div>
                </div>
              
              </div>

              <div className="bg-white p-6  shadow-md border border-gray-100">
                <div className="flex items-center space-x-4">
                 
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Pendapatan</p>
                    <p className="text-2xl font-semibold text-gray-900 text-center ">20</p>
                  </div>
                </div>
           
              </div>

              <div className="bg-white p-6 shadow-md border border-gray-100">
                <div className="flex items-center space-x-4">
               
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Materi</p>
                    <p className="text-2xl font-semibold text-gray-900 text-center">100</p>
                  </div>
                </div>
              
              </div>

              <div className="bg-white p-6  shadow-md border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Soal</p>
                    <p className="text-2xl font-semibold text-gray-900 text-center">50</p>
                  </div>
                </div>
                
              </div>
              <div className="bg-white p-6  shadow-md border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Sesi Soal</p>
                    <p className="text-2xl font-semibold text-gray-900 text-center">300</p>
                  </div>
                </div>
                
              </div>
            </div>

          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;