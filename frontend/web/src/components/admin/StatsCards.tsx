
import React from 'react';
import { Calendar, Clock, Package, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsData {
  totalAppointments: number;
  pendingAppointments: number;
  totalProducts: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

interface StatsCardsProps {
  stats: StatsData;
  formatPrice: (price: number) => string;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, formatPrice }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Citas</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalAppointments}</p>
            </div>
            <Calendar className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Citas Pendientes</p>
              <p className="text-2xl font-bold text-foreground">{stats.pendingAppointments}</p>
            </div>
            <Clock className="w-8 h-8 text-destructive" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Productos</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalProducts}</p>
            </div>
            <Package className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ingresos Mes</p>
              <p className="text-2xl font-bold text-foreground">{formatPrice(stats.totalRevenue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
