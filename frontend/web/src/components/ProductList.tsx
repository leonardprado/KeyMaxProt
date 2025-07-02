// ProductList.tsx (Refactorizado)

import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig'; // O la ruta correcta a tu apiClient
import { Spin } from 'antd'; // O tu componente de UI preferido
import { useToast } from '@/hooks/use-toast';
import ProductCard from './ProductCard'; // Tu componente para mostrar un producto

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [productsPerPage] = useState(9); // Número de productos por página
  const [totalProducts, setTotalProducts] = useState(0); // Estado para el total de productos
  const { toast } = useToast();
  // Puedes añadir más estados aquí para los filtros, por ejemplo:
  // const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Añade los parámetros de query a la llamada de la API
        const response = await apiClient.get('/products', {
          params: {
            page: currentPage,
            limit: productsPerPage,
            // Añade aquí los parámetros de filtro si los implementas:
            // ...filters,
          },
        });
        setProducts(response.data.data);
        setTotalProducts(response.data.totalDocs || 0);
        toast({
          title: 'Éxito',
          description: 'Productos cargados correctamente.',
          variant: 'default',
        });
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'No se pudieron cargar los productos.';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // Añade currentPage y filters (si se implementan) como dependencias para que se recargue al cambiar
  }, [currentPage, toast]); // <-- Se ejecuta cada vez que cambia la página actual

  // Lógica de paginación (necesitarás un componente de paginación en el JSX)
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin tip="Cargando productos..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 h-64 flex justify-center items-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Aquí iría tu componente de paginación */}
      {/* Por ejemplo, usando Ant Design Pagination */}
      {/*
      <Pagination
        current={currentPage}
        pageSize={productsPerPage}
        total={totalProducts}
        onChange={paginate}
        className="mt-6 text-center"
      />
      */}

      {/* Aquí irían los controles de filtro si los implementas */}
    </>
  );
};

export default ProductList;