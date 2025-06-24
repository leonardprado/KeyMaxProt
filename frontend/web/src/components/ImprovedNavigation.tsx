
import { useState } from 'react';
import { Menu, X, Calendar, User, ShoppingCart, Store, LogOut, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';
import NotificationCenter from './NotificationCenter';

const ImprovedNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const { totalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Keymax Prot
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link to="/" className="text-slate-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Inicio
                </Link>
                <Link to="/marketplace" className="text-slate-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Marketplace
                </Link>
                <button 
                  onClick={() => scrollToSection('servicios')}
                  className="text-slate-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Servicios
                </button>
                <button 
                  onClick={() => scrollToSection('nosotros')}
                  className="text-slate-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Nosotros
                </button>
                <button 
                  onClick={() => scrollToSection('contacto')}
                  className="text-slate-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Contacto
                </button>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <NotificationCenter />
              
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-2 text-slate-700 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Link to="/profile">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {user?.name || 'Perfil'}
                    </Button>
                  </Link>
                  
                  {user?.role === 'admin' && (
                    <Link to="/admin">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="border-red-200 text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => handleAuthClick('login')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    onClick={() => handleAuthClick('register')}
                  >
                    Registrarse
                  </Button>
                </>
              )}

              <Link to="/appointments">
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Cita
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <NotificationCenter />
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-2 text-slate-700 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-700 hover:text-blue-600 p-2"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-slate-200">
                <Link to="/" className="block px-3 py-2 text-slate-700 hover:text-blue-600 font-medium">
                  Inicio
                </Link>
                <Link to="/marketplace" className="block px-3 py-2 text-slate-700 hover:text-blue-600 font-medium">
                  Marketplace
                </Link>
                <button 
                  onClick={() => scrollToSection('servicios')}
                  className="block px-3 py-2 text-slate-700 hover:text-blue-600 font-medium w-full text-left"
                >
                  Servicios
                </button>
                <button 
                  onClick={() => scrollToSection('nosotros')}
                  className="block px-3 py-2 text-slate-700 hover:text-blue-600 font-medium w-full text-left"
                >
                  Nosotros
                </button>
                <button 
                  onClick={() => scrollToSection('contacto')}
                  className="block px-3 py-2 text-slate-700 hover:text-blue-600 font-medium w-full text-left"
                >
                  Contacto
                </button>
                
                <div className="flex flex-col space-y-2 pt-4">
                  {isAuthenticated ? (
                    <>
                      <Link to="/profile">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-blue-200 text-blue-700 w-full"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Mi Perfil
                        </Button>
                      </Link>
                      
                      {user?.role === 'admin' && (
                        <Link to="/admin">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-purple-200 text-purple-700 w-full"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Administración
                          </Button>
                        </Link>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleLogout}
                        className="border-red-200 text-red-700 w-full"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar Sesión
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-blue-200 text-blue-700 w-full"
                        onClick={() => handleAuthClick('login')}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Iniciar Sesión
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-blue-600 to-blue-700 w-full"
                        onClick={() => handleAuthClick('register')}
                      >
                        Registrarse
                      </Button>
                    </>
                  )}
                  <Link to="/appointments">
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 w-full"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Agendar Cita
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cart Dropdown */}
        {isCartOpen && (
          <div className="absolute right-4 top-16 z-50">
            <div className="bg-white rounded-lg shadow-2xl border border-slate-200 p-4">
              <div className="w-80">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Carrito de compras</h3>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {totalItems === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Tu carrito está vacío</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-slate-600">{totalItems} productos en tu carrito</p>
                    <Link to="/marketplace">
                      <Button 
                        className="w-full" 
                        onClick={() => setIsCartOpen(false)}
                      >
                        Ver carrito completo
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </>
  );
};

export default ImprovedNavigation;
