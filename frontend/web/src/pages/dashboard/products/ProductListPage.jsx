import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axiosInstance from '../../../api/axiosConfig';
import { Link } from 'react-router-dom';



const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/products');
      setProducts(response.data);
    } catch (error) {
      message.error('Error al cargar los productos.');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
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
        pagination={{ pageSize: 10 }}
      />


    </div>
  );
};

export default ProductListPage;