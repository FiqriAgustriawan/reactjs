import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

const AdminUsers = () => {
  const [loading, setLoading] = useState(false);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage user accounts</p>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-600">
            User management functionality will be available in the next update.
            <br />
            This requires additional API endpoint implementation in the backend.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;