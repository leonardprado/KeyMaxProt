import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, User, Store, ShoppingCart, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SummaryCard from '@/components/SummaryCard';
import SalesChart from '@/components/admin/SalesChart';
import CategoryChart from '@/components/admin/CategoryChart';

const OverviewPage = () => {
  const [stats, setStats] = useState(null);
  const [userRoleStats, setUserRoleStats] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOverviewStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const [overviewRes, userRoleRes, salesRes, categoryRes] = await Promise.all([
          axios.get('/api/stats/overview'),
          axios.get('/api/stats/user-roles'),
          axios.get('/api/stats/sales-data'),
          axios.get('/api/stats/category-distribution'),
        ]);
        setStats(overviewRes.data.data);
        setUserRoleStats(userRoleRes.data.data);
        setSalesData(salesRes.data.data);
        setCategoryData(categoryRes.data.data);
      } catch (error) {
        console.error('Error fetching overview stats:', error);
        setError('Error al cargar las estadísticas del dashboard.');
        toast({
          title: "Error",
          description: "Error al cargar las estadísticas del dashboard.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-2 text-gray-600">Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 h-screen flex justify-center items-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Resumen de la Plataforma</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total de Usuarios"
          value={stats?.userCount || 0}
          icon={User}
          iconColor="text-blue-500"
        />
        <SummaryCard
          title="Total de Talleres"
          value={stats?.shopCount || 0}
          icon={Store}
          iconColor="text-green-500"
        />
        <SummaryCard
          title="Total de Productos"
          value={stats?.productCount || 0}
          icon={ShoppingCart}
          iconColor="text-purple-500"
        />
        <SummaryCard
          title="Total de Órdenes"
          value={stats?.orderCount || 0}
          icon={DollarSign}
          iconColor="text-yellow-500"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Usuarios por Rol</h2>
          {userRoleStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userRoleStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Cantidad de Usuarios" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-600 h-32 flex justify-center items-center">
              <p>No hay datos de roles de usuario disponibles.</p>
            </div>
          )}
        </div>

        {salesData.length > 0 ? (
          <SalesChart data={salesData} />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600 h-96 flex justify-center items-center">
            <p>No hay datos de ventas disponibles.</p>
          </div>
        )}

        {categoryData.length > 0 ? (
          <CategoryChart data={categoryData} />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600 h-96 flex justify-center items-center">
            <p>No hay datos de distribución por categorías disponibles.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewPage;