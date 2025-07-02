
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import apiClient from '../../api/axiosConfig';
import { Spin, Alert } from 'antd';

interface SalesData {
  _id: string; // Assuming _id contains the month/period identifier
  totalSales: number;
}

interface SalesChartProps {
  data: SalesData[];
}

const SalesChart: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await apiClient.get('/stats/sales-over-time');
        // Assuming the response data format matches SalesData[]
        setSalesData(response.data.data);
      } catch (err: any) {
        console.error('Error fetching sales data:', err);
        setError('Error al cargar los datos de ventas.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ventas Mensuales</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center" style={{ height: 300 }}>
          <Spin size="large" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ventas Mensuales</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert message="Error" description={error} type="error" showIcon />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas Mensuales</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}> {/* Use fetched data */} 
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" /> // Adjust dataKey if backend uses a different field for month/period
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalSales" stroke="#8884d8" activeDot={{ r: 8 }} name="Ventas Totales" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
