
import { useState } from 'react';
import { Menu, X, Calendar, User, ShoppingCart, Store, LogOut, Settings, Home } from 'lucide-react';
import { ModeToggle } from '@/components/ui/mode-toggle';
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
      {/* Top Navigation for Desktop */}
      <nav className="hidden md:flex bg-background/90 backdrop-blur-sm border-b border-border sticky top-0 z-40 justify-between items-center h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0 flex items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Keymax Prot
          </Link>
        </div>
        <div className="flex items-baseline space-x-8">
          <Link to="/marketplace" className="text-foreground/80 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
            Marketplace
          </Link>
          <Link to="/blog" className="text-foreground/80 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
            Blog
          </Link>
          <button onClick={() => scrollToSection('servicios')} className="text-foreground/80 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
            Servicios
          </button>
          <button onClick={() => scrollToSection('nosotros')} className="text-foreground/80 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
            Nosotros
          </button>
          <button onClick={() => scrollToSection('contacto')} className="text-foreground/80 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
            Contacto
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationCenter />
          <button onClick={() => setIsCartOpen(!isCartOpen)} className="relative p-2 text-foreground/80 hover:text-primary transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Link to="/profile"><Button variant="outline" size="sm"><User className="w-4 h-4 mr-2" />{user?.name || 'Perfil'}</Button></Link>
              {user?.role === 'admin' && <Link to="/admin"><Button variant="outline" size="sm"><Settings className="w-4 h-4 mr-2" />Admin</Button></Link>}
              <Button variant="destructive" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4" /></Button>
            </div>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => handleAuthClick('login')}><User className="w-4 h-4 mr-2" />Iniciar Sesión</Button>
              <Button size="sm" onClick={() => handleAuthClick('register')}>Registrarse</Button>
            </>
          )}
          <Link to="/appointments"><Button size="sm" variant="secondary"><Calendar className="w-4 h-4 mr-2" />Agendar Cita</Button></Link>
          <ModeToggle />
        </div>
      </nav>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
        <div className="flex justify-around items-center h-16">
          <Link to="/" className={`flex flex-col items-center justify-center text-xs font-medium ${location.pathname === '/' ? 'text-primary' : 'text-foreground/80'}`}>
            <Home className="w-6 h-6 mb-1" />
            Inicio
          </Link>
          <Link to="/marketplace" className={`flex flex-col items-center justify-center text-xs font-medium ${location.pathname.startsWith('/marketplace') ? 'text-primary' : 'text-foreground/80'}`}>
            <Store className="w-6 h-6 mb-1" />
            Tienda
          </Link>
          <Link to="/appointments" className="relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background p-2 rounded-full shadow-md">
              <Button size="icon" className="w-14 h-14 rounded-full shadow-lg">
                <Calendar className="w-6 h-6" />
              </Button>
            </div>
          </Link>
          <button onClick={() => setIsCartOpen(!isCartOpen)} className={`relative flex flex-col items-center justify-center text-xs font-medium ${isCartOpen ? 'text-primary' : 'text-foreground/80'}`}>
            <ShoppingCart className="w-6 h-6 mb-1" />
            Carrito
            {totalItems > 0 && (
              <span className="absolute -top-1 right-1 bg-destructive text-destructive-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <Link to="/profile" className={`flex flex-col items-center justify-center text-xs font-medium ${location.pathname.startsWith('/profile') ? 'text-primary' : 'text-foreground/80'}`}>
            <User className="w-6 h-6 mb-1" />
            Perfil
          </Link>
          <ModeToggle />
        </div>
      </div>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsCartOpen(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-full max-w-sm bg-background shadow-xl p-6 transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Tu Carrito</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 text-foreground/80 hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>
            {/* Cart content will be rendered here */}
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </>
  );
};

export default ImprovedNavigation;
