import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Spin, Alert, Typography, Pagination } from 'antd'; // Importa Pagination
import { EditOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axiosInstance from '../../../api/axiosConfig';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const ServiceListPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [pageSize] = useState(10); // Número de servicios por página (pageSize)
  const [totalItems, setTotalItems] = useState(0); // Estado para el total de servicios (total)
  // Puedes añadir estados para los filtros aquí

  useEffect(() => {
    fetchServices();
  }, [currentPage]); // Añade currentPage como dependencia

  const fetchServices = async () => {
    setLoading(true);
    try {
      // Añade los parámetros de query a la llamada de la API
      const response = await axiosInstance.get('/service-catalog', {
        params: {
          page: currentPage,
          limit: pageSize,
          // Añade aquí los parámetros de filtro si los implementas
          // ...filters,
        },
      });
      setServices(response.data.data); // Asumiendo que los datos paginados están en response.data.data
      setTotalItems(response.data.totalDocs); // Asumiendo que el total está en response.data.totalDocs
    } catch (err) {
      setError(err);
      message.error('Error al cargar los servicios del catálogo.');
      console.error('Error fetching service catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el cambio de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteService = async (serviceId) => {
    Modal.confirm({
      title: '¿Estás seguro de que quieres eliminar este servicio del catálogo?',
      icon: <ExclamationCircleOutlined />,
      content: 'Esta acción no se puede deshacer.',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'No, cancelar',
      onOk: async () => {
        try {
          await axiosInstance.delete(`/service-catalog/${serviceId}`);
          message.success('Servicio del catálogo eliminado exitosamente.');
          fetchServices();
        } catch (error) {
          message.error('Error al eliminar el servicio del catálogo.');
          console.error('Error deleting service catalog:', error);
        }
      },
    });
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Categoría',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      render: (text) => `$${text.toFixed(2)}`,
    },
    {
      title: 'Duración Estimada',
      dataIndex: 'estimatedDuration',
      key: 'estimatedDuration',
      render: (text) => `${text} minutos`,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/dashboard/services/edit/${record._id}`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteService(record._id)} />
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <Spin size="large" tip="Cargando servicios..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="No se pudieron cargar los servicios del catálogo. Por favor, inténtalo de nuevo más tarde."
        type="error"
        showIcon
      />
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Gestión de Servicios del Catálogo</Title>
        <Link to="/dashboard/services/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Añadir Servicio
          </Button>
        </Link>
      </div>
      <Table
        columns={columns}
        dataSource={services}
        rowKey="_id"
        loading={loading}
        // Configura la paginación para ser controlada por el backend
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          onChange: handlePageChange, // Llama a handlePageChange al cambiar de página
          // showSizeChanger: true,
          // onShowSizeChange: (current, size) => setPageSize(size),
        }}
      />
    </div>
  );
};

export default ServiceListPage;