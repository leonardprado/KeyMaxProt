
import React from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (totalItems === 0) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Tu carrito
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-slate-400 text-4xl mb-4">🛒</div>
          <p className="text-slate-500 mb-4">Tu carrito está vacío</p>
          <p className="text-sm text-slate-400">
            Agregá productos desde el marketplace
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Tu carrito ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-96 overflow-y-auto space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-slate-800 line-clamp-2 mb-1">
                  {item.name}
                </h4>
                <p className="text-sm font-semibold text-blue-600">
                  {formatPrice(item.price)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-slate-200 rounded"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-slate-200 rounded"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total:</span>
            <span className="text-blue-600">{formatPrice(totalPrice)}</span>
          </div>
          
          <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            Proceder al pago
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Cart;
