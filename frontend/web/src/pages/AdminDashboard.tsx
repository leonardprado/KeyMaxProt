import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, Outlet } from 'react-router-dom';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import { Button } from '@/components/ui/button';
import DashboardSidebar from '@/components/admin/DashboardSidebar';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Verificar si el usuario es admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <ImprovedNavigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Acceso Denegado</h2>
            <p className="text-slate-600 mb-4">No tienes permisos para acceder a esta página</p>
            <Link to="/">
              <Button>Volver al inicio</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <ImprovedNavigation />
      
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <Outlet /> {/* Aquí se renderizarán las rutas anidadas */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;