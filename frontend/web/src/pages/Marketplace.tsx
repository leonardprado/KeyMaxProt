
import { useState, useEffect } from 'react';
import axios from 'axios';
import ImprovedNavigation from '../components/ImprovedNavigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import ProductCard from '../components/ProductCard';
import ServiceCard from '../components/ServiceCard';
import { Loader2 } from 'lucide-react';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [productRes, serviceRes] = await Promise.all([
          axios.get('/api/products/categories'),
          axios.get('/api/services/categories')
        ]);
        setProductCategories(productRes.data.data);
        setServiceCategories(serviceRes.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error al cargar las categorías.');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          keyword: searchTerm,
          category: category === 'all' ? '' : category,
          'price[gte]': priceRange[0],
          'price[lte]': priceRange[1],
          page
        };
        const [productRes, serviceRes] = await Promise.all([
          axios.get('/api/products', { params }),
          axios.get('/api/services', { params })
        ]);
        setProducts(productRes.data.data);
        setServices(serviceRes.data.servicios);
        setTotalPages(Math.max(productRes.data.pagination.pages || 1, serviceRes.data.pagination.pages || 1));
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error al cargar productos y servicios.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchTerm, category, priceRange, page]);

  return (
    <div>
      <ImprovedNavigation />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h2 className="text-2xl font-bold mb-4">Filtros</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">Buscar</label>
                <Input id="search" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por nombre..." />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {[...new Set([...productCategories, ...serviceCategories])].map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Rango de precios</label>
                <Slider
                  id="price"
                  min={0}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-3">
            <h2 className="text-2xl font-bold mb-4">Resultados</h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="ml-2 text-gray-600">Cargando...</p>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 h-64 flex justify-center items-center">
                <p>{error}</p>
              </div>
            ) : (products.length === 0 && services.length === 0) ? (
              <div className="text-center text-gray-600 h-64 flex justify-center items-center">
                <p>No se encontraron productos o servicios que coincidan con los filtros.</p>
              </div>
            ) : (
              <>
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
                <div className="flex justify-center mt-8">
                  <Button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>Anterior</Button>
                  <span className="mx-4">Página {page} de {totalPages}</span>
                  <Button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>Siguiente</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
