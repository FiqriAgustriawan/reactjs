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




  return (
    <AdminLayout>
      
    </AdminLayout>
  );
};

export default AdminBookings;