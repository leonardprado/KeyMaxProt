import { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { useToast } from '@/hooks/use-toast';
import { Product } from '../types';

interface UseProductsOptions {
  page?: number;
  limit?: number;
  filters?: Record<string, any>;
}

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  setPage: (page: number) => void;
  setFilters: (filters: Record<string, any>) => void;
}

export const useProducts = (initialOptions?: UseProductsOptions): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialOptions?.page || 1);
  const [filters, setFilters] = useState<Record<string, any>>(initialOptions?.filters || {});

  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/products', {
          params: {
            page: currentPage,
            limit: initialOptions?.limit || 9,
            ...filters,
          },
        });
        setProducts(response.data.data);
        setTotalProducts(response.data.totalDocs || 0);
        setTotalPages(response.data.totalPages || 0);
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
  }, [currentPage, filters, initialOptions?.limit, toast]);

  return {
    products,
    loading,
    error,
    totalProducts,
    totalPages,
    currentPage,
    setPage: setCurrentPage,
    setFilters,
  };
};
