import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '@/api/axiosConfig'; // Asegúrate que la ruta sea correcta
import { useToast } from '@/hooks/use-toast';
// Importar otros componentes necesarios como el formulario de reseñas y la visualización de reseñas
// import AddReviewForm from '@/components/AddReviewForm';
// import ReviewsList from '@/components/ReviewsList';

// --- Interfaces ---
interface ShopDetailProps {
  // Definir las props si son necesarias
}

interface Shop {
  _id: string;
  name: string;
  description: string;
  location: string;
  is_verified: boolean;
  // Añadir otras propiedades de la tienda según el modelo del backend
  // Por ejemplo:
  // owner_id?: { name: string, email: string };
  // offeredServices?: string[]; // Si se populationa, será un array de objetos o IDs
  // city?: string;
}

const ShopDetail: React.FC<ShopDetailProps> = () => {
  const { id } = useParams<{ id: string }>(); // Obtiene el ID de la URL
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // --- Lógica para obtener los detalles de la tienda por ID ---
  useEffect(() => {
    const fetchShopDetail = async () => {
      if (!id) {
        setError('ID de tienda no proporcionado.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/api/shops/${id}`); // Llama a tu API
        setShop(response.data.data); // Asume que los datos están en response.data.data
        toast({
          title: 'Tienda cargada',
          description: `Detalles de ${response.data.data.name} cargados.`,
        });
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Error al cargar los detalles de la tienda.';
        setError(errorMessage);
        toast({
          title: 'Error al cargar la tienda',
          description: errorMessage,
          variant: 'destructive',
        });
        console.error('Error fetching shop details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShopDetail(); // Ejecuta la función asíncrona
  }, [id, toast]); // Dependencias: se vuelve a ejecutar si el ID cambia o si toast cambia (aunque toast no debería cambiar)

  // --- Renderizado condicional según el estado ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando detalles de la tienda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p className="text-destructive text-lg">{error}</p>
      </div>
    );
  }

  if (!shop) {
    // Esto ocurriría si el loading es false y el error es null, pero shop sigue null
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Tienda no encontrada.</p>
      </div>
    );
  }

  // --- JSX para mostrar los detalles de la tienda ---
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{shop.name}</h1>
      <p className="text-lg mb-4">{shop.description}</p>
      <p className="text-lg mb-4">Ubicación: {shop.location}</p>
      <p className={`text-lg font-semibold mb-4 ${shop.is_verified ? 'text-green-600' : 'text-orange-600'}`}>
        Estado: {shop.is_verified ? 'Verificado' : 'No Verificado'}
      </p>
      
      {/* Aquí se integrarían el formulario de reseñas y la lista de reseñas */}
      {/* <AddReviewForm itemId={shop._id} itemType="shop" onReviewAdded={fetchReviews} /> */}
      {/* <ReviewsList itemId={shop._id} itemType="shop" /> */}
    </div>
  );
};

export default ShopDetail;