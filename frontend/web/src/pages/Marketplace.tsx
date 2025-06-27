import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, Heart, ShoppingCart, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/contexts/ProductContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Link } from 'react-router-dom';
import Cart from '@/components/Cart';
import ImprovedNavigation from '@/components/ImprovedNavigation';


const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const [showFavorites, setShowFavorites] = useState(false);
  
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { products } = useProducts();

  const categories = [
    { id: 'all', name: 'Todos los productos' },
    { id: 'tools', name: 'Herramientas' },
    { id: 'security', name: 'Seguridad' },
    { id: 'automotive', name: 'Automotriz' },
    { id: 'protection', name: 'Protección' },
    { id: 'residencial', name: 'Hogar y Comercio' },
    { id: 'lighting', name: 'Iluminación' },
    { id: 'audio', name: 'Audio' },
    
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
        (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filtrar por rango de precio
    filtered = filtered.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);

    // Ordenar
    filtered.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, priceRange, sortBy, showFavorites, isFavorite]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 100000]);
    setSortBy('name');
    setShowFavorites(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ImprovedNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            {/* Búsqueda */}
            <Card className="bg-card text-card-foreground border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Search className="w-5 h-5" />
                  Buscar productos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Buscar por name o marca..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-input text-foreground border-border placeholder:text-muted-foreground"
                />
              </CardContent>
            </Card>

            {/* Filtros */}
            <Card className="bg-card text-card-foreground border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
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
                  <h4 className="font-medium mb-2 text-foreground">Categoría</h4>
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

                {/* Rango de precios con Slider */}
                <div>
                  <h4 className="font-medium mb-2 text-foreground">Rango de precios</h4>
                  <Slider
                    min={0}
                    max={100000}
                    step={1000}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>

                {/* Botón Limpiar filtros */}
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Limpiar filtros
                </Button>
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
                <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
                <p className="text-muted-foreground mt-2">
                  {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} 
                  {showFavorites && ' favorito'}
                  {selectedCategory !== 'all' && ` en ${categories.find(c => c.id === selectedCategory)?.name}`}
                </p>
              </div>

              {/* Ordenar */}
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-border bg-background text-foreground rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary"
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
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200 bg-card text-card-foreground border-border">
                    <div className="relative">
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      </Link>
                      
                      {product.discount && (
                        <Badge variant="destructive" className="absolute top-2 left-2">
                          {product.discount}% OFF
                        </Badge>
                      )}
                      
                      {product.isBestSeller && (
                        <Badge variant="secondary" className="absolute top-2 right-2">
                          MÁS VENDIDO
                        </Badge>
                      )}

                      <button
                        onClick={() => toggleFavorite(product)}
                        className="absolute top-2 right-2 p-2 bg-card/80 rounded-full hover:bg-card transition-colors text-muted-foreground hover:text-red-500"
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            isFavorite(product.id) 
                              ? 'text-red-500 fill-current' 
                              : 'text-muted-foreground'
                          }`} 
                        />
                      </button>
                    </div>

                    <CardContent className="p-4">
                      <div className="mb-2">
                        <span className="text-xs text-primary font-semibold">
                          Por {product.brand}
                        </span>
                      </div>
                      
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-medium text-foreground line-clamp-2 mb-2 hover:text-primary transition-colors">
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
                                  : 'text-muted-foreground/30'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({product.reviews})
                        </span>
                      </div>

                      <div className="mb-3">
                        {product.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                        <div className="text-lg font-bold text-foreground">
                          {formatPrice(product.price)}
                        </div>
                      </div>

                      {product.freeShipping && (
                        <p className="text-xs text-green-500 font-semibold mb-3">
                          ¡Envío gratis!
                        </p>
                      )}

                      <Button
                        onClick={() => addToCart(product)}
                        className="w-full"
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
                <p className="text-lg text-muted-foreground mb-4">
                  {showFavorites 
                    ? 'No tienes productos favoritos aún' 
                    : 'No se encontraron productos'
                  }
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
