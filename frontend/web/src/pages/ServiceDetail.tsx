import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// Importar otros componentes necesarios como el formulario de reseñas y la visualización de reseñas
// import AddReviewForm from '@/components/AddReviewForm';
// import ReviewsList from '@/components/ReviewsList';

interface ServiceDetailProps {
  // Definir las props si son necesarias
}

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  // Añadir otras propiedades del servicio
}

const ServiceDetail: React.FC<ServiceDetailProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Aquí se implementaría la lógica para obtener los detalles del servicio por ID
  // useEffect(() => {
  //   const fetchServiceDetail = async () => {
  //     try {
  //       // const response = await api.get(`/services/${id}`);
  //       // setService(response.data);
  //       // setLoading(false);
  //     } catch (err) {
  //       // setError('Error al cargar los detalles del servicio.');
  //       // setLoading(false);
  //     }
  //   };
  //   fetchServiceDetail();
  // }, [id]);

  if (loading) {
    return <div>Cargando detalles del servicio...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!service) {
    return <div>Servicio no encontrado.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{service.name}</h1>
      <p className="text-lg mb-4">{service.description}</p>
      <p className="text-2xl font-semibold mb-6">Precio: ${service.price.toFixed(2)}</p>
      {/* Aquí se integrarían el formulario de reseñas y la lista de reseñas */}
      {/* <AddReviewForm itemId={service._id} itemType="service" onReviewAdded={fetchReviews} /> */}
      {/* <ReviewsList itemId={service._id} itemType="service" /> */}
    </div>
  );
};

export default ServiceDetail;