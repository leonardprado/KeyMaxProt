
import React, { useState } from 'react';
import { Search, ShoppingCart, Filter, Star, Heart, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useCart, Product } from '@/contexts/CartContext';
import Navigation from '@/components/Navigation';

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart, totalItems } = useCart();

  const categories = [
    { id: 'all', name: 'Todas las ofertas', icon: '🏷️' },
    { id: 'automotive', name: 'Accesorios para Vehículos', icon: '🚗' },
    { id: 'electronics', name: 'Electrónicos', icon: '📱' },
    { id: 'tools', name: 'Herramientas', icon: '🔧' },
    { id: 'audio', name: 'Audio y Sonido', icon: '🎵' },
    { id: 'security', name: 'Seguridad', icon: '🔒' },
    { id: 'lighting', name: 'Iluminación', icon: '💡' }
  ];

  const products: Product[] = [
    {
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
    },
    {
      id: 2,
      name: 'Parlante Bluetooth 30w Rms Jd E300 Portátil Luces Led Inalámbrico',
      price: 74787,
      originalPrice: 149999,
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop',
      category: 'audio',
      brand: 'JD',
      rating: 4.5,
      reviews: 132,
      discount: 50,
      freeShipping: true
    },
    {
      id: 3,
      name: 'Auriculares Inalámbricos Xiaomi Redmi Buds 6 Play Black',
      price: 21299,
      originalPrice: 29980,
      image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop',
      category: 'audio',
      brand: 'XIAOMI',
      rating: 4.8,
      reviews: 15925,
      discount: 26,
      isBestSeller: true,
      freeShipping: true
    },
    {
      id: 4,
      name: 'Alarma Auto X28 Z10 Rs + 2 Controles + Sensor Impacto',
      price: 89990,
      originalPrice: 129990,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      category: 'security',
      brand: 'X28',
      rating: 4.6,
      reviews: 892,
      discount: 31,
      freeShipping: true
    },
    {
      id: 5,
      name: 'Kit Polarizado Láminas 3M Crystalline 70% Ventanas Laterales',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
      category: 'automotive',
      brand: '3M',
      rating: 4.9,
      reviews: 234,
      freeShipping: true
    },
    {
      id: 6,
      name: 'Luces LED Kit Xenón H4 H7 H11 9005 9006 Philips 12000LM',
      price: 32500,
      originalPrice: 48000,
      image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=300&fit=crop',
      category: 'lighting',
      brand: 'PHILIPS',
      rating: 4.7,
      reviews: 567,
      discount: 32,
      freeShipping: true
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      {/* Header del Marketplace */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Marketplace Keymax Prot</h1>
            <p className="text-xl text-blue-100">
              ¡Encontrá precios increíbles cada día!
            </p>
          </div>

          {/* Barra de búsqueda */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Buscar productos, marcas y más..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-lg"
              />
            </div>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 px-8">
              Buscar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar con categorías */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Categorías
              </h3>
              
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-sm">{category.name}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Envío gratis
                </h4>
                <p className="text-sm text-green-700">
                  En miles de productos seleccionados
                </p>
              </div>
            </div>
          </div>

          {/* Lista de productos */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {selectedCategory === 'all' ? 'Todas las ofertas' : 
                 categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <div className="text-slate-600">
                {filteredProducts.length} productos
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {product.discount && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                        {product.discount}% OFF
                      </div>
                    )}
                    {product.isBestSeller && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        MÁS VENDIDO
                      </div>
                    )}
                    <button className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-2">
                      <span className="text-xs text-blue-600 font-semibold">
                        Por {product.brand}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-slate-600">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    <div className="space-y-1 mb-3">
                      {product.originalPrice && (
                        <div className="text-sm text-slate-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </div>
                      )}
                      <div className="text-2xl font-bold text-slate-900">
                        {formatPrice(product.price)}
                      </div>
                      {product.freeShipping && (
                        <div className="text-sm text-green-600 font-semibold flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          Envío gratis
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => addToCart(product)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Agregar al carrito
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-slate-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-slate-600 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-slate-500">
                  Intentá con otros términos de búsqueda o categorías
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
