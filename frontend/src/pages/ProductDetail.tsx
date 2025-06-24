
import React, { useState } from 'react';
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
import { useCart, Product } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import ImprovedNavigation from '@/components/ImprovedNavigation';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Datos de ejemplo del producto - en una app real vendrían de una API
  const product: Product = {
    id: 1,
    name: 'Set Caja Herramientas Juego Llave Tubo Kit 46 Piezas Estuche',
    price: 13519,
    originalPrice: 22200,
    image: 'https://images.unsplash.com/photo-1573089988574-cf9c24c6c1b6?w=400&h=300&fit=crop',
    category: 'tools',
    brand: 'ALPINA',
    rating: 4.4,
    reviews: 3750,
    discount: 39,
    isBestSeller: true,
    freeShipping: true
  };

  const productImages = [
    'https://images.unsplash.com/photo-1573089988574-cf9c24c6c1b6?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop'
  ];

  const productFeatures = [
    'Kit completo de 46 piezas profesionales',
    'Llaves de tubo de 8mm a 32mm',
    'Material de alta calidad y durabilidad',
    'Estuche de almacenamiento incluido',
    'Ideal para uso profesional y doméstico',
    'Garantía de 2 años del fabricante'
  ];

  const reviews = [
    {
      id: 1,
      user: 'Juan P.',
      rating: 5,
      comment: 'Excelente calidad, muy completo el kit. Lo recomiendo.',
      date: '2024-06-20'
    },
    {
      id: 2,
      user: 'María G.',
      rating: 4,
      comment: 'Buena relación precio-calidad. Las herramientas son sólidas.',
      date: '2024-06-18'
    },
    {
      id: 3,
      user: 'Carlos R.',
      rating: 5,
      comment: 'Perfecto para mi taller. Llegó en tiempo y forma.',
      date: '2024-06-15'
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <ImprovedNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
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
          {/* Galería de imágenes */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-white">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-blue-500' : 'border-slate-200'
                  }`}
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

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-blue-600 font-semibold">
                  Por {product.brand}
                </span>
                {product.isBestSeller && (
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
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-slate-600">
                  {product.rating} ({product.reviews} reseñas)
                </span>
              </div>
            </div>

            {/* Precio */}
            <div className="space-y-2">
              {product.originalPrice && (
                <div className="text-lg text-slate-500 line-through">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
              <div className="text-4xl font-bold text-slate-900">
                {formatPrice(product.price)}
              </div>
              {product.discount && (
                <div className="text-green-600 font-semibold">
                  ¡Ahorrás {formatPrice(product.originalPrice! - product.price)}! ({product.discount}% OFF)
                </div>
              )}
            </div>

            {/* Características principales */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {product.freeShipping && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Envío gratis</span>
                </div>
              )}
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Garantía 2 años</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                <Star className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">Mejor calificado</span>
              </div>
            </div>

            {/* Cantidad y acciones */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Cantidad:</span>
                <div className="flex items-center border border-slate-300 rounded-lg">
                  <button
                    onClick={() => updateQuantity(quantity - 1)}
                    className="p-2 hover:bg-slate-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(quantity + 1)}
                    className="p-2 hover:bg-slate-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Agregar al carrito
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toggleFavorite(product)}
                  className={`h-12 px-4 ${
                    isFavorite(product.id) 
                      ? 'text-red-600 border-red-200 bg-red-50' 
                      : 'text-slate-600 border-slate-300'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" className="h-12 px-4">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          {/* Características detalladas */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Características del producto
              </h3>
              <ul className="space-y-3">
                {productFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Reseñas */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Reseñas de clientes
              </h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-slate-200 pb-4 last:border-b-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-slate-900">{review.user}</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-slate-500">{review.date}</span>
                    </div>
                    <p className="text-slate-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
