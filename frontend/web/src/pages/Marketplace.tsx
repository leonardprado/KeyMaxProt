// src/pages/Marketplace.tsx (CORREGIDO)

import { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig'; // Usa tu instancia de axios
import ImprovedNavigation from '../components/ImprovedNavigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import ProductCard from '../components/ProductCard';
import ServiceCard from '../components/ServiceCard';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Marketplace = () => {
  // --- Inicializa los estados SIEMPRE como arrays vacíos ---
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  
  // ... resto de tus estados (searchTerm, etc.)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // --- useEffect para cargar las categorías ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [productRes, serviceRes] = await Promise.all([
          apiClient.get('/products/categories'),
          apiClient.get('/service-catalog/categories') // <-- RUTA CORREGIDA
        ]);
        setProductCategories(productRes.data.data || []); // Asegura que sea un array
        setServiceCategories(serviceRes.data.data || []); // Asegura que sea un array
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error",
          description: "Error al cargar las categorías.",
          variant: "destructive",
        });
      }
    };
    fetchCategories();
  }, []);

  // --- useEffect para cargar los datos principales (productos y servicios) ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // ... tu lógica de params ...
        const [productRes, serviceRes] = await Promise.all([
          apiClient.get('/products'/*, { params }*/),
          apiClient.get('/service-catalog'/*, { params }*/) // <-- RUTA CORREGIDA
        ]);
        
        setProducts(productRes.data.data || []);
        setServices(serviceRes.data.data || []); // <-- Accede a .data
        // ... tu lógica de paginación ...
        toast({
          title: "Éxito",
          description: "Productos y servicios cargados exitosamente.",
        });
      } catch (err: any) {
        console.error('Error fetching data:', err);
        const errorMessage = err.response?.data?.message || 'Error al cargar productos y servicios.';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [/* searchTerm, category, priceRange, page */]); // Dependencias

  // Combinar categorías sin duplicados para el <Select>
  const allCategories = [...new Set([...productCategories, ...serviceCategories])];

  if (loading) {
    return (
      <div>
        <ImprovedNavigation />
        <div className="container mx-auto p-8 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-gray-600">Cargando productos y servicios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <ImprovedNavigation />
        <div className="container mx-auto p-8 text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ImprovedNavigation />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar de filtros */}
          <div className="col-span-1">
            <h2 className="text-2xl font-bold mb-4">Filtros</h2>
            <div className="space-y-4">
              {/* ... tu input de búsqueda ... */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
                <Select /* ... */ >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {/* AHORA ESTO ES SEGURO */}
                    {allCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* ... tu slider de precio ... */}
            </div>
          </div>
          {/* Contenido principal */}
          <div className="col-span-3">
            {/* ... tu renderizado de productos y servicios ... */}
            <h2 className="text-2xl font-bold mb-4">Productos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            
            <h2 className="text-2xl font-bold my-4">Servicios</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
            {/* ... tu paginación ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;