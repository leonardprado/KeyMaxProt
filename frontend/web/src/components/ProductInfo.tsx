import React from 'react';
import { Star, Heart, ShoppingCart, Truck, Shield, Plus, Minus, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '../types';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/hooks/use-toast';

interface ProductInfoProps {
  product: Product;
  quantity: number;
  setQuantity: (quantity: number) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, quantity, setQuantity }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product) {
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

  return (
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
                  i < Math.floor(product.averageRating || 0)
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {product.freeShipping && (
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
            <button onClick={() => updateQuantity(quantity - 1)} className="p-2 ">
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 ">{quantity}</span>
            <button onClick={() => updateQuantity(quantity + 1)} className="p-2 ">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleAddToCart} className="flex-1 ">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Agregar al carrito
          </Button>
          <Button
            variant="outline"
            onClick={() => toggleFavorite({ ...product, id: product._id })}
            className={` ${isFavorite(product._id) ? 'text-red-500 ' : ''}`}
          >
            <Heart className={` ${isFavorite(product._id) ? 'fill-current' : ''}`} />
          </Button>
          <Button variant="outline" className="">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
