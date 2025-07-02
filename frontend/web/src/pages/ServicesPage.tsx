import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImprovedNavigation from '../components/ImprovedNavigation';
import ServiceCard from '../components/ServiceCard';
import { Loader2 } from 'lucide-react';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/services');
        setServices(res.data.servicios);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Error al cargar los servicios.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div>
      <ImprovedNavigation />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-8">Nuestros Servicios</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="ml-2 text-gray-600">Cargando servicios...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 h-64 flex justify-center items-center">
            <p>{error}</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center text-gray-600 h-64 flex justify-center items-center">
            <p>No hay servicios disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(service => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;