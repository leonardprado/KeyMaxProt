import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, Heart, ShoppingCart, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart, Product } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Link } from 'react-router-dom';
import Cart from '@/components/Cart';
import ImprovedNavigation from '@/components/ImprovedNavigation';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const [showFavorites, setShowFavorites] = useState(false);
  
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite, favorites } = useFavorites();

  // Datos de ejemplo de productos
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

  const categories = [
    { id: 'all', name: 'Todos los productos' },
    { id: 'tools', name: 'Herramientas' },
    { id: 'security', name: 'Seguridad' },
    { id: 'automotive', name: 'Automotriz' },
    { id: 'protection', name: 'Protección' }
  ];

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filtrar por favoritos si está activado
    if (showFavorites) {
      filtered = filtered.filter(product => isFavorite(product.id));
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filtrar por rango de precio
    if (priceRange !== 'all') {
      filtered = filtered.filter(product => {
        if (priceRange === 'low') return product.price < 10000;
        if (priceRange === 'medium') return product.price >= 10000 && product.price < 25000;
        if (priceRange === 'high') return product.price >= 25000;
        return true;
      });
    }

    // Ordenar
    filtered.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, priceRange, sortBy, showFavorites, isFavorite]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <ImprovedNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            {/* Búsqueda */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Buscar productos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Buscar por nombre o marca..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mostrar favoritos */}
                <div>
                  <Button
                    variant={showFavorites ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowFavorites(!showFavorites)}
                    className="w-full"
                  >
                    <Heart className={`w-4 h-4 mr-2 ${showFavorites ? 'fill-current' : ''}`} />
                    {showFavorites ? 'Mostrar todos' : 'Solo favoritos'}
                  </Button>
                </div>

                {/* Categorías */}
                <div>
                  <h4 className="font-medium mb-2">Categoría</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className="w-full justify-start"
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Precio */}
                <div>
                  <h4 className="font-medium mb-2">Rango de precio</h4>
                  <div className="space-y-2">
                    <Button
                      variant={priceRange === 'all' ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setPriceRange('all')}
                      className="w-full justify-start"
                    >
                      Todos los precios
                    </Button>
                    <Button
                      variant={priceRange === 'low' ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setPriceRange('low')}
                      className="w-full justify-start"
                    >
                      Menos de $10.000
                    </Button>
                    <Button
                      variant={priceRange === 'medium' ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setPriceRange('medium')}
                      className="w-full justify-start"
                    >
                      $10.000 - $25.000
                    </Button>
                    <Button
                      variant={priceRange === 'high' ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setPriceRange('high')}
                      className="w-full justify-start"
                    >
                      Más de $25.000
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Carrito */}
            <Cart />
          </div>

          {/* Contenido principal */}
          <div className="lg:w-3/4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Marketplace</h1>
                <p className="text-slate-600 mt-2">
                  {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} 
                  {showFavorites && ' favorito'}
                  {selectedCategory !== 'all' && ` en ${categories.find(c => c.id === selectedCategory)?.name}`}
                </p>
              </div>

              {/* Ordenar */}
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-slate-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-slate-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="name">Ordenar por nombre</option>
                  <option value="price">Ordenar por precio</option>
                  <option value="rating">Ordenar por valoración</option>
                </select>
              </div>
            </div>

            {/* Grid de productos */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
                    <div className="relative">
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      </Link>
                      
                      {product.discount && (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                          {product.discount}% OFF
                        </Badge>
                      )}
                      
                      {product.isBestSeller && (
                        <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600">
                          MÁS VENDIDO
                        </Badge>
                      )}

                      <button
                        onClick={() => toggleFavorite(product)}
                        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            isFavorite(product.id) 
                              ? 'text-red-500 fill-current' 
                              : 'text-slate-600'
                          }`} 
                        />
                      </button>
                    </div>

                    <CardContent className="p-4">
                      <div className="mb-2">
                        <span className="text-xs text-blue-600 font-semibold">
                          Por {product.brand}
                        </span>
                      </div>
                      
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-medium text-slate-800 line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-slate-600">
                          ({product.reviews})
                        </span>
                      </div>

                      <div className="mb-3">
                        {product.originalPrice && (
                          <div className="text-sm text-slate-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                        <div className="text-lg font-bold text-slate-900">
                          {formatPrice(product.price)}
                        </div>
                      </div>

                      {product.freeShipping && (
                        <p className="text-xs text-green-600 font-semibold mb-3">
                          ¡Envío gratis!
                        </p>
                      )}

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
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-slate-600 mb-4">
                  {showFavorites 
                    ? 'No tienes productos favoritos aún' 
                    : 'No se encontraron productos'
                  }
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setPriceRange('all');
                    setShowFavorites(false);
                  }}
                  variant="outline"
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
