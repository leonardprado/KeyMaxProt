// ProductDetail.tsx (Refactorizado)

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { Spin, Alert } from 'antd';

const ProductDetail = () => {
  const { id } = useParams(); // Obtiene el ID del producto de la URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; // No hacer nada si no hay ID

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/products/${id}`); // <-- ¡Llamada a la API!
        setProduct(response.data.data);
      } catch (err) {
        setError('Producto no encontrado.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Se vuelve a ejecutar si el ID de la URL cambia

  if (loading) {
    return <Spin tip="Cargando producto..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" />;
  }
  
  if (!product) {
      return <div>Producto no encontrado</div>
  }

  return (
    <div>
      {/* ... Tu JSX para mostrar los detalles del 'product' ... */}
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      {/* ... etc ... */}
    </div>
  );
};

export default ProductDetail;