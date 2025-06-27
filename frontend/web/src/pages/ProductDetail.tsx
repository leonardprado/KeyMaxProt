
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
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useProducts } from '@/contexts/ProductContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Obtener producto del contexto
  const { getProductById } = useProducts();
  const product = getProductById(Number(id));

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

  const productImages = product.image ? [product.image, product.image, product.image] : [];

  const productFeatures = (product as any).features || [];
  const reviews = (product as any).reviews || [];

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
    <div className="min-h-screen bg-background text-foreground">
      {/* ImprovedNavigation ya no es necesario aquí si se maneja globalmente en App.tsx */}
      
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
            <div className="aspect-square rounded-lg overflow-hidden bg-card dark:bg-card-foreground/10 border border-border">
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

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-primary font-semibold">
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
                <span className="text-muted-foreground">
                  {product.rating} ({product.reviews} reseñas)
                </span>
              </div>
            </div>

            {/* Precio */}
            <div className="space-y-2">
              {product.originalPrice && (
                <div className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
              <div className="text-4xl font-bold text-foreground">
                {formatPrice(product.price)}
              </div>
              {product.discount && (
                <div className="text-green-500 font-semibold">
                  ¡Ahorrás {formatPrice(product.originalPrice! - product.price)}! ({product.discount}% OFF)
                </div>
              )}
            </div>

            {/* Características principales */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {product.freeShipping && (
                <div className="flex items-center gap-2 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Truck className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Envío gratis</span>
                </div>
              )}
              <div className="flex items-center gap-2 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Garantía 2 años</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Star className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Mejor calificado</span>
              </div>
            </div>

            {/* Cantidad y acciones */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium text-foreground">Cantidad:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => updateQuantity(quantity - 1)}
                    className="p-2 hover:bg-accent hover:text-accent-foreground transition-colors text-foreground"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center text-foreground">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(quantity + 1)}
                    className="p-2 hover:bg-accent hover:text-accent-foreground transition-colors text-foreground"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary hover:bg-primary/90 h-12"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Agregar al carrito
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toggleFavorite(product)}
                  className={`h-12 px-4 ${isFavorite(product.id) ? 'text-red-500 border-red-500 dark:text-red-400 dark:border-red-400' : 'text-muted-foreground'}`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" className="h-12 px-4 text-muted-foreground">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          {/* Características detalladas */}
          <Card className="bg-card text-card-foreground border-border">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Características del producto
              </h3>
              <ul className="space-y-3">
                {productFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Reseñas */}
          <Card className="bg-card text-card-foreground border-border">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Reseñas de clientes
              </h3>
              <div className="space-y-4">
                {Array.isArray(reviews) && reviews.length > 0 ? (
                  reviews.map((review: any) => (
                    <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-foreground">{review.user}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">Aún no hay reseñas para este producto.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
