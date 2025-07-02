// src/pages/dashboard/OverviewPage.jsx (VERSIÓN FINAL)

import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Spin, Alert } from 'antd';
import { UserOutlined, ShopOutlined, AppstoreOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import apiClient from '../../api/axiosConfig';

// ¡Aseguramos que estas rutas de importación sean correctas!
import SummaryCard from '../../components/dashboard/SummaryCard';
import SalesChart from '../../components/dashboard/SalesChart';
import CategoryChart from '../../components/dashboard/CategoryChart';
import UserRoleChart from '../../components/dashboard/UserRoleChart';

const OverviewPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverviewStats = async () => {
      try {
        const response = await apiClient.get('/stats/overview');
        setStats(response.data.data);
      } catch (err) {
        console.error('Error fetching overview stats:', err);
        setError('Error al cargar las estadísticas principales.');
      } finally {
        setLoading(false);
      }
    };
    fetchOverviewStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div className="p-4">
      <Typography.Title level={2} style={{ marginBottom: '24px' }}>
        Resumen de la Plataforma
      </Typography.Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <SummaryCard title="Total de Usuarios" value={stats?.userCount || 0} icon={<UserOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <SummaryCard title="Total de Talleres" value={stats?.shopCount || 0} icon={<ShopOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <SummaryCard title="Total de Productos" value={stats?.productCount || 0} icon={<AppstoreOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <SummaryCard title="Total de Órdenes" value={stats?.orderCount || 0} icon={<ShoppingCartOutlined />} />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <SalesChart /> 
        </Col>
        <Col xs={24} lg={12}>
          <UserRoleChart /> 
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24}>
           <CategoryChart />
        </Col>
      </Row>
    </div>
  );
};

export default OverviewPage;