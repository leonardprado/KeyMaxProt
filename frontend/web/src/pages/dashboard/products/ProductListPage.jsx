import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Pagination } from 'antd'; // Importa Pagination si no está ya
import { EditOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axiosInstance from '../../../api/axiosConfig';
import { Link } from 'react-router-dom';



const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [pageSize] = useState(10); // Número de productos por página (pageSize)
  const [totalItems, setTotalItems] = useState(0); // Estado para el total de productos (total)
  // Puedes añadir estados para los filtros aquí, por ejemplo:
  // const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchProducts();
  }, [currentPage]); // Añade currentPage como dependencia

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Añade los parámetros de query a la llamada de la API
      const response = await axiosInstance.get('/products', {
        params: {
          page: currentPage,
          limit: pageSize,
          // Añade aquí los parámetros de filtro si los implementas:
          // ...filters,
        },
      });
      setProducts(response.data.data); // Asumiendo que los datos paginados están en response.data.data
      setTotalItems(response.data.totalDocs); // Asumiendo que el total está en response.data.totalDocs
    } catch (error) {
      message.error('Error al cargar los productos.');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el cambio de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteProduct = async (productId) => {
    Modal.confirm({
      title: '¿Estás seguro de que quieres eliminar este producto?',
      icon: <ExclamationCircleOutlined />,
      content: 'Esta acción no se puede deshacer.',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'No, cancelar',
      onOk: async () => {
        try {
          await axiosInstance.delete(`/products/${productId}`);
          message.success('Producto eliminado exitosamente.');
          fetchProducts();
        } catch (error) {
          message.error('Error al eliminar el producto.');
          console.error('Error deleting product:', error);
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
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      render: (text) => `$${text.toFixed(2)}`,
    },
    {
      title: 'Categoría',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/dashboard/products/edit/${record._id}`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteProduct(record._id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Gestión de Productos</h2>
        <Link to="/dashboard/products/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Añadir Producto
          </Button>
        </Link>
      </div>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="_id"
        loading={loading}
        // Configura la paginación para ser controlada por el backend
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          onChange: handlePageChange, // Llama a handlePageChange al cambiar de página
          // Puedes añadir opciones para cambiar el tamaño de página si lo deseas
          // showSizeChanger: true,
          // onShowSizeChange: (current, size) => setPageSize(size),
        }}
      />


    </div>
  );
};

export default ProductListPage;