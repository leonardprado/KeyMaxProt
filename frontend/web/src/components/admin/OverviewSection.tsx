
import React from 'react';
import StatsCards from './StatsCards';
import RecentAppointments from './RecentAppointments';
import TopProducts from './TopProducts';

interface StatsData {
  totalAppointments: number;
  pendingAppointments: number;
  totalProducts: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

interface Appointment {
  id: number;
  client: string;
  service: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending';
  phone: string;
}

interface Product {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  stock: number;
}

interface OverviewSectionProps {
  stats: StatsData;
  appointments: Appointment[];
  products: Product[];
  formatPrice: (price: number) => string;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({
  stats,
  appointments,
  products,
  formatPrice,
  getStatusColor,
  getStatusIcon
}) => {
  return (
    <div className="space-y-8">
      <StatsCards stats={stats} formatPrice={formatPrice} />
      
      <div className="grid lg:grid-cols-2 gap-8">
        <RecentAppointments 
          appointments={appointments}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
        />
        <TopProducts 
          products={products}
          formatPrice={formatPrice}
        />
      </div>
    </div>
  );
};

export default OverviewSection;
