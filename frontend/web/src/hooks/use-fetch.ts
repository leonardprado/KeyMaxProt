import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axiosConfig';
import { useToast } from '@/hooks/use-toast';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchData: (params?: Record<string, any>) => Promise<void>;
}

export const useFetch = <T>(url: string, initialData: T | null = null): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = useCallback(async (params?: Record<string, any>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<T>(url, { params });
      setData(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || `Error al cargar datos de ${url}.`;
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      console.error(`Error fetching from ${url}:`, err);
    } finally {
      setLoading(false);
    }
  }, [url, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, fetchData };
};
