// src/components/dashboard/UserRoleChart.tsx

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, Spin, Alert } from 'antd';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import apiClient from '../../api/axiosConfig';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserRoleChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const response = await apiClient.get('/stats/user-roles');
        const apiData = response.data.data;

        const labels = apiData.map(item => item._id); // ej: 'admin', 'user'
        const dataPoints = apiData.map(item => item.count);

        setChartData({
          labels,
          datasets: [{
            label: 'Número de Usuarios',
            data: dataPoints,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
          }],
        });
      } catch (error) {
        console.error("Error fetching user role data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoleData();
  }, []);

  const options = {
    indexAxis: 'y' as const, // <-- ¡LA SOLUCIÓN!
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Distribución de Usuarios por Rol' },
    },
  };
  
  if (loading) return <Spin />;
  if (!chartData) return <Alert message="No se pudieron cargar los datos de roles." type="warning" />;

  return (
    <Card title="Usuarios por Rol">
      <Bar options={options} data={chartData} />
    </Card>
  );
};

export default UserRoleChart;