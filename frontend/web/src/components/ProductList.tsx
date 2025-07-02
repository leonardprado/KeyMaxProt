// ProductList.tsx (Refactorizado)

import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig'; // O la ruta correcta a tu apiClient
import { Spin, Alert } from 'antd'; // O tu componente de UI preferido
import ProductCard from './ProductCard'; // Tu componente para mostrar un producto

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/products'); // <-- ¡Llamada a la API!
        setProducts(response.data.data); // Asumiendo que tus datos están en response.data.data
      } catch (err) {
        setError('No se pudieron cargar los productos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // El array vacío hace que se ejecute solo una vez

  if (loading) {
    return <Spin tip="Cargando productos..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;