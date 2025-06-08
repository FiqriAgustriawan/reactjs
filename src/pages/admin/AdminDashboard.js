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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Overview of your cinema application</p>
        </div>

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
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-blue-100">
                    <FilmIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Films</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.films}</p>
                  </div>
                </div>
                <Link
                  to="/admin/films"
                  className="mt-4 block text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  View all films →
                </Link>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-green-100">
                    <TicketIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.bookings}</p>
                  </div>
                </div>
                <Link
                  to="/admin/bookings"
                  className="mt-4 block text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  View all bookings →
                </Link>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-purple-100">
                    <UserGroupIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.users}</p>
                  </div>
                </div>
                <Link
                  to="/admin/users"
                  className="mt-4 block text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  View all users →
                </Link>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-yellow-100">
                    <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">Rp {stats.revenue.toLocaleString()}</p>
                  </div>
                </div>
                <Link
                  to="/admin/bookings"
                  className="mt-4 block text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  View financial details →
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/admin/films"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <FilmIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Add New Film</p>
                    <p className="text-sm text-gray-500">Create a new movie listing</p>
                  </div>
                </Link>

                <Link
                  to="/admin/bookings"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="p-2 rounded-full bg-green-100 mr-3">
                    <TicketIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Manage Bookings</p>
                    <p className="text-sm text-gray-500">View and update bookings</p>
                  </div>
                </Link>

                <Link
                  to="/admin/users"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="p-2 rounded-full bg-purple-100 mr-3">
                    <UserGroupIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Manage Users</p>
                    <p className="text-sm text-gray-500">View user accounts</p>
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;