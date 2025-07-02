// src/components/dashboard/CategoryChart.tsx

import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Card, Spin, Alert } from 'antd';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
} from 'chart.js';
import apiClient from '../../api/axiosConfig';

// Registrar los componentes para un gráfico de pastel
ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await apiClient.get('/stats/category-distribution');
        const apiData = response.data.data;

        const labels = apiData.map(item => item._id); // Ej: ['Car Audio', 'Seguridad']
        const dataPoints = apiData.map(item => item.count); // Ej: [35, 50]

        setChartData({
          labels,
          datasets: [{
            label: '# de Productos',
            data: dataPoints,
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
              'rgba(255, 159, 64, 0.7)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          }],
        });
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, []);

  if (loading) return <Spin tip="Cargando datos de categorías..." />;
  if (!chartData) return <Alert message="No se pudieron cargar los datos de categorías." type="warning" />;

  return (
    <Card title="Distribución de Productos por Categoría">
      <Pie data={chartData} />
    </Card>
  );
};

export default CategoryChart;