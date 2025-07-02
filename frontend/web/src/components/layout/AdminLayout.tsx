import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../admin/DashboardSidebar'; // Tu menú lateral

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-4 sm:p-6">
        <Outlet /> {/* Aquí se renderizan las páginas de admin */}
      </main>
    </div>
  );
};
export default AdminLayout;