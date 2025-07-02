import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Truck, 
  Shield, 
  ArrowLeft,
  Plus,
  Minus,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import apiClient from '../api/axiosConfig'; // Asegúrate que la ruta sea correcta
import { Spin, Alert } from 'antd'; // Usaremos Spin y Alert para los estados de carga y errores
import { useToast } from '@/hooks/use-toast'; // Importar useToast
import AddReviewForm from '../components/AddReviewForm'; // Importa el componente del formulario

const ProductDetail = () => {
  const { id } = useParams(); // Obtiene el ID del producto de la URL
  const navigate = useNavigate();
  
  // Estados para manejar el producto, la carga y los errores
  const [product, setProduct] = useState<any>(null); // 'any' temporalmente, se puede tipar mejor
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Estados que ya tenías para la UI
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Hooks de contexto que se mantienen
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  // --- LÓGICA NUEVA: OBTENER DATOS DE LA API ---
  useEffect(() => {
    if (!id) {
      const errorMessage = 'ID de producto no válido.';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/products/${id}`);
        setProduct(response.data.data);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Producto no encontrado o error al cargar.';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, toast]); // Se ejecuta cada vez que el ID de la URL cambia

  // --- LÓGICAS DE LA UI (la mayoría se mantienen igual) ---

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    // Es importante asegurarse de que product no sea null antes de usarlo
    if (product) {
      // La lógica de tu CartContext necesita ser compatible con el objeto 'product' de la API
      addToCart({ ...product, id: product._id });
      toast({
        title: 'Éxito',
        description: 'Producto añadido al carrito.',
        variant: 'default',
      });
    }
  };

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  // --- RENDERIZADO CONDICIONAL ---

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin tip="Cargando producto..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p className="text-red-500 text-lg">{error}</p>
        <Button onClick={() => navigate('/marketplace')} className="mt-4">
          Volver al Marketplace
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
          <Button onClick={() => navigate('/marketplace')}>
            Volver al Marketplace
          </Button>
        </div>
      </div>
    );
  }

  // --- VARIABLES PARA EL JSX (adaptadas al nuevo objeto 'product') ---
  
  const productImages = product.images && product.images.length > 0 ? product.images : ['https://via.placeholder.com/400'];
  const productFeatures = product.features || [];
  // Lógica para obtener reseñas
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // Lógica para obtener reseñas
  const fetchReviews = async () => {
    if (!id) return;
    setReviewsLoading(true);
    setReviewsError(null);
    try {
      // Asumiendo que tienes una ruta en el backend como /api/reviews/item/:itemType/:itemId
      const response = await apiClient.get(`/api/reviews/item/Product/${id}`);
      setReviews(response.data.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar las reseñas.';
      setReviewsError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      console.error(err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id, toast]); // Se ejecuta cuando cambia el ID del producto 

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/marketplace')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Marketplace
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Galería de imágenes (sin cambios) */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-card dark:bg-card-foreground/10 border border-border">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors bg-card dark:bg-card-foreground/10 ${selectedImage === index ? 'border-primary' : 'border-border'}`}
                >
                  <img
                    src={image}
                    alt={`Vista ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Información del producto (sin cambios, pero ahora usa datos de la API) */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-primary font-semibold">
                  Por {product.brand}
                </span>
                {product.isBestSeller && ( // Asumiendo que este campo viene de la API
                  <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    MÁS VENDIDO
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.averageRating || 0) // Usa averageRating de la API
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  {product.averageRating?.toFixed(1) || 0} ({product.reviewCount || 0} reseñas)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {product.originalPrice && ( // Campo opcional
                <div className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
              <div className="text-4xl font-bold text-foreground">
                {formatPrice(product.price)}
              </div>
              {product.discount && ( // Campo opcional
                <div className="text-green-500 font-semibold">
                  ¡Ahorrás {formatPrice(product.originalPrice! - product.price)}! ({product.discount}% OFF)
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {product.freeShipping && ( // Campo opcional
                <div className="flex items-center gap-2 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Truck className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Envío gratis</span>
                </div>
              )}
              <div className="flex items-center gap-2 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Garantía</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Star className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Calidad Premium</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium text-foreground">Cantidad:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <button onClick={() => updateQuantity(quantity - 1)} className="p-2 ...">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 ...">{quantity}</span>
                  <button onClick={() => updateQuantity(quantity + 1)} className="p-2 ...">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleAddToCart} className="flex-1 ...">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Agregar al carrito
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toggleFavorite({ ...product, id: product._id })}
                  className={`... ${isFavorite(product._id) ? 'text-red-500 ...' : '...'}`}
                >
                  <Heart className={`... ${isFavorite(product._id) ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" className="...">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          {/* Aquí podrías añadir más secciones como descripción detallada, especificaciones, etc. */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Descripción</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </CardContent>
          </Card>
      </div>
    </div>

        {/* Sección de Reseñas */}
        <div className="mt-16 space-y-8">
          <h2 className="text-2xl font-bold">Reseñas de Clientes</h2>

          {reviewsLoading && <Spin tip="Cargando reseñas..." />}
          {reviewsError && <Alert message="Error" description={reviewsError} type="error" showIcon />}

          {!reviewsLoading && !reviewsError && (
            reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review: { _id: string; rating: number; user: { name: string } | null; createdAt: string; comment: string }) => (
                  <Card key={review._id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold">{review.user ? review.user.name : 'Usuario Desconocido'}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                      <p>{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aún no hay reseñas para este producto. ¡Sé el primero en dejar una!</p>
            )
          )}

          {/* Formulario para añadir reseña */}
          <AddReviewForm itemType="Product" itemId={id} onReviewAdded={fetchReviews} />

      </div>
    </div>
  );
};

export default ProductDetail;