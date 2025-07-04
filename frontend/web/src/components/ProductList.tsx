// ProductList.tsx (Refactorizado con useProducts, paginación y filtros)

import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import ProductCard from './ProductCard';
import { useProducts } from '@/hooks/use-products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Importa Input
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Importa Select
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFetch } from '@/hooks/use-fetch'; // Importa useFetch para categorías

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { products, loading, error, currentPage, totalPages, setPage, setFilters } = useProducts({ limit: 9 });
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useFetch<string[]>('/products/categories', []);

  useEffect(() => {
    const newFilters: Record<string, any> = {};
    if (searchTerm) {
      newFilters.name = searchTerm; // Asumiendo que el backend filtra por 'name'
    }
    if (selectedCategory) {
      newFilters.category = selectedCategory;
    }
    setFilters(newFilters);
  }, [searchTerm, selectedCategory, setFilters]);

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
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select onValueChange={setSelectedCategory} value={selectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas las Categorías</SelectItem>
            {categoriesLoading ? (
              <SelectItem value="" disabled>Cargando categorías...</SelectItem>
            ) : categoriesError ? (
              <SelectItem value="" disabled>Error al cargar categorías</SelectItem>
            ) : (
              categories?.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Componente de Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};

export default ProductList;