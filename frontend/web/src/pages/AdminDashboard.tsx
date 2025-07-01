
import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import AdminTabs from '@/components/admin/AdminTabs';
import OverviewSection from '@/components/admin/OverviewSection';
import AppointmentManagement from '@/components/admin/AppointmentManagement';
import ProductManagement from '@/components/admin/ProductManagement';
import UserManagement from '@/components/admin/UserManagement';
import ServiceListPage from './dashboard/services/ServiceListPage';
import { Button } from '@/components/ui/button';

type TabType = 'overview' | 'appointments' | 'products' | 'users' | 'services';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

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

  // Datos de ejemplo para el dashboard
  const stats = {
    totalAppointments: 45,
    pendingAppointments: 12,
    totalProducts: 156,
    totalRevenue: 89500,
    monthlyGrowth: 15.2
  };

  const mockAppointments = [
    {
      id: 1,
      client: 'Juan Pérez',
      service: 'Polarizado Premium',
      date: '2024-06-25',
      time: '10:00',
      status: 'confirmed' as const,
      phone: '+54 11 1234-5678'
    },
    {
      id: 2,
      client: 'María González',
      service: 'Alarma X28',
      date: '2024-06-25',
      time: '14:30',
      status: 'pending' as const,
      phone: '+54 11 8765-4321'
    },
    {
      id: 3,
      client: 'Carlos López',
      service: 'Instalación Audio',
      date: '2024-06-26',
      time: '09:00',
      status: 'confirmed' as const,
      phone: '+54 11 5555-0000'
    }
  ];

  const mockProducts = [
    {
      id: 1,
      name: 'Set Herramientas 46 Piezas',
      sales: 23,
      revenue: 311000,
      stock: 15
    },
    {
      id: 2,
      name: 'Parlante Bluetooth JD E300',
      sales: 18,
      revenue: 1346000,
      stock: 8
    },
    {
      id: 3,
      name: 'Auriculares Xiaomi Redmi',
      sales: 31,
      revenue: 660000,
      stock: 22
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-orange-600 bg-orange-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewSection
            stats={stats}
            appointments={mockAppointments}
            products={mockProducts}
            formatPrice={formatPrice}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        );
      case 'appointments':
        return (
          <AppointmentManagement
            appointments={mockAppointments}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        );
      case 'products':
        return (
          <ProductManagement
            products={mockProducts}
            formatPrice={formatPrice}
          />
        );
      case 'users':
        return <UserManagement />;
      case 'services':
        return <ServiceListPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <ImprovedNavigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Panel de Administración</h1>
          <p className="text-slate-600">Gestiona tu plataforma desde aquí</p>
        </div>

        <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
