import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImprovedNavigation from '../components/ImprovedNavigation';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';

const FeaturedProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/products?isFeatured=true&onSale=true');
        setProducts(res.data.data);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Error al cargar los productos destacados.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <ImprovedNavigation />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-8">Productos Destacados y en Promoción</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="ml-2 text-gray-600">Cargando productos...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 h-64 flex justify-center items-center">
            <p>{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-600 h-64 flex justify-center items-center">
            <p>No hay productos destacados o en promoción en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProductsPage;