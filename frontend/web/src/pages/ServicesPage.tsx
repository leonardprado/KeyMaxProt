// src/pages/ServicesPage.tsx (VERSIÓN CORREGIDA)

import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig'; // <-- Usa tu apiClient estandarizado
import ImprovedNavigation from '../components/ImprovedNavigation';
import ServiceCard from '../components/ServiceCard';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ServicesPage = () => {
  // Inicializa el estado como un array vacío, lo cual es correcto.
  const [services, setServices] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        // Usamos apiClient en lugar de axios directamente
        const res = await apiClient.get('/service-catalog'); // <-- ¡Llama a la ruta correcta!
        
        // --- LÍNEA CORREGIDA ---
        // Accedemos a res.data.data, que es donde está el array
        if (res.data && Array.isArray(res.data.data)) {
          setServices(res.data.data);
        } else {
          // Si la respuesta no es lo que esperamos, lo manejamos como un error
          console.error("La respuesta de la API no tiene el formato esperado:", res.data);
          const errorMessage = 'Error al procesar los datos de los servicios.';
          setError(errorMessage);
          setServices([]); // Nos aseguramos que services sea un array
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        }

      } catch (err: any) {
        console.error('Error fetching services:', err);
        const errorMessage = err.response?.data?.message || 'Error al cargar los servicios.';
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
    fetchServices();
  }, []);

  // El resto de tu JSX ya está bien, no necesita cambios.
  // Tu renderizado condicional ya maneja el caso de array vacío correctamente.

  if (loading) {
    return (
      <div>
        <ImprovedNavigation />
        <div className="container mx-auto p-8 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-gray-600">Cargando servicios...</p>
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
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-8">Nuestros Servicios</h1>
        {services.length === 0 && !loading ? (
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