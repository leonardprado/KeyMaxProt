// src/pages/dashboard/OverviewPage.jsx (VERSIÓN CORREGIDA Y SIMPLIFICADA)

import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast'; // Asumiendo que esta ruta es correcta
import { Loader2, User, Store, ShoppingCart, DollarSign } from 'lucide-react';
import { Row, Col, Typography } from 'antd'; // Usando AntD para el layout

// Corregimos las rutas de importación para que sean consistentes
import SummaryCard from '@/components/dashboard/SummaryCard'; 
import SalesChart from '@/components/dashboard/SalesChart';
import CategoryChart from '@/components/dashboard/CategoryChart';
import UserRoleChart from '@/components/dashboard/UserRoleChart'; // Sería bueno crear este componente también
import apiClient from '../../api/axiosConfig'; // Usando nuestra instancia de axios

const OverviewPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOverviewStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // Ahora solo necesitamos llamar a un endpoint para las tarjetas
        const response = await apiClient.get('/stats/overview');
        setStats(response.data.data);
      } catch (err) {
        console.error('Error fetching overview stats:', err);
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
  }, [toast]); // Añadimos toast a las dependencias del useEffect

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <Typography.Title level={2} className="mb-6">Resumen de la Plataforma</Typography.Title>
      
      {/* Tarjetas de Resumen */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <SummaryCard title="Total de Usuarios" value={stats?.userCount || 0} icon={User} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <SummaryCard title="Total de Talleres" value={stats?.shopCount || 0} icon={Store} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <SummaryCard title="Total de Productos" value={stats?.productCount || 0} icon={ShoppingCart} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <SummaryCard title="Total de Órdenes" value={stats?.orderCount || 0} icon={DollarSign} />
        </Col>
      </Row>

      {/* Gráficos */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
            {/* SalesChart llamará a su propio endpoint internamente */}
            <SalesChart /> 
        </Col>
        <Col xs={24} lg={12}>
            {/* Sería ideal crear un UserRoleChart que llame a /stats/user-roles */}
            <UserRoleChart /> 
        </Col>
        <Col xs={24} lg={12}>
            {/* CategoryChart llamará a su propio endpoint internamente */}
            <CategoryChart />
        </Col>
      </Row>
    </div>
  );
};

export default OverviewPage;