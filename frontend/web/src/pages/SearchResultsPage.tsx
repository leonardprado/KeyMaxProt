import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { Product } from '../types/product';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
}

interface Post {
  _id: string;
  title: string;
  content: string;
}

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState<{ products: Product[]; services: Service[]; posts: Post[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      const queryParams = new URLSearchParams(location.search);
      const query = queryParams.get('query');

      if (!query) {
        setError('No se proporcionó un término de búsqueda.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/search?query=${encodeURIComponent(query)}`);
        setSearchResults(response.data.data);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Error al cargar los resultados de búsqueda.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [location.search]);

  if (loading) {
    return <div className="container mx-auto p-4">Cargando resultados...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  if (!searchResults || (searchResults.products.length === 0 && searchResults.services.length === 0 && searchResults.posts.length === 0)) {
    return <div className="container mx-auto p-4">No se encontraron resultados para su búsqueda.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Resultados de Búsqueda</h1>

      {searchResults.products.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Productos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.products.map((product) => (
              <div key={product._id} className="border rounded-lg p-4 shadow-sm">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
                <a href={`/product/${product._id}`} className="text-blue-500 hover:underline">Ver Producto</a>
              </div>
            ))}
          </div>
        </section>
      )}

      {searchResults.services.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.services.map((service) => (
              <div key={service._id} className="border rounded-lg p-4 shadow-sm">
                <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-2">{service.description}</p>
                <p className="text-lg font-semibold">${service.price.toFixed(2)}</p>
                <a href={`/service/${service._id}`} className="text-blue-500 hover:underline">Ver Servicio</a>
              </div>
            ))}
          </div>
        </section>
      )}

      {searchResults.posts.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Publicaciones de Blog</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.posts.map((post) => (
              <div key={post._id} className="border rounded-lg p-4 shadow-sm">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-2">{post.content.substring(0, 150)}...</p>
                <a href={`/blog/${post._id}`} className="text-blue-500 hover:underline">Leer Publicación</a>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchResultsPage;