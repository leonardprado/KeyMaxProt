import { useState } from 'react';
import { Menu, X, Calendar, User as UserIcon, ShoppingCart, Store, LogOut, Settings, Home } from 'lucide-react'; // Renombrado User a UserIcon
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import NotificationCenter from './NotificationCenter';
import GlobalSearchBar from './GlobalSearchBar';

const ImprovedNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();
  // Importa isLoading para saber si la autenticación está cargando
  const { user, isLoading: authLoading, logout, isAuthenticated } = useAuth(); 
  const location = useLocation();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      // Si no estamos en la página principal, navegamos a la sección usando la URL
      window.location.href = `/#${sectionId}`;
    } else {
      // Si estamos en la página principal, hacemos scroll suave
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  // Accede a las propiedades del usuario de forma segura
  const userName = user?.profile?.name?.split(' ')[0]; // Toma solo el primer nombre
  const userRole = user?.role;

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
          <GlobalSearchBar />
          <Link to="/marketplace" className="text-foreground/80 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
            Marketplace
          </Link>
          <Link to="/blog" className="text-foreground/80 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
            Blog
          </Link>
          <Link to="/services" className="text-foreground/80 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
            Servicios
          </Link>
          <Link to="/about" className="text-foreground/80 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
            Nosotros
          </Link>
          <Link to="/contact" className="text-foreground/80 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
            Contacto
          </Link>
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
          {/* ModeToggle for Desktop */}
          <ModeToggle />
          
          {/* --- LÓGICA DE AUTENTICACIÓN SEGURA --- */}
          {authLoading ? ( // Mostrar un estado de carga si la autenticación aún está procesándose
            <Button variant="outline" size="sm" disabled>
              <UserIcon className="w-4 h-4 mr-2" />
              Cargando...
            </Button>
          ) : isAuthenticated ? ( // Si el usuario está autenticado
            <div className="flex items-center space-x-2">
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  <UserIcon className="w-4 h-4 mr-2" />
                  {/* Acceso seguro a userName */}
                  {userName || 'Perfil'} 
                </Button>
              </Link>
              {/* Mostrar enlace de Admin solo si el rol es admin */}
              {userRole === 'admin' && (
                <Link to="/admin">
                  <Button variant="outline" size="sm"><Settings className="w-4 h-4 mr-2" />Admin</Button>
                </Link>
              )}
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : ( // Si no está autenticado
            <Button variant="outline" size="sm" onClick={handleAuthClick}>
              <UserIcon className="w-4 h-4 mr-2" />
              Iniciar Sesión
            </Button>
          )}
          
          <Link to="/book-appointment"><Button size="sm" variant="secondary"><Calendar className="w-4 h-4 mr-2" />Agendar Cita</Button></Link>
          <Link to="/my-appointments" className="text-foreground/80 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
            Mis Citas
          </Link>
          <ModeToggle /> {/* Mover ModeToggle aquí para evitar duplicidad */}
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
          <Link to="/book-appointment" className="relative">
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
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <Link to="/profile" className={`flex flex-col items-center justify-center text-xs font-medium ${location.pathname.startsWith('/profile') ? 'text-primary' : 'text-foreground/80'}`}>
            <UserIcon className="w-6 h-6 mb-1" />
            Perfil
          </Link>
          <Link to="/my-appointments" className={`flex flex-col items-center justify-center text-xs font-medium ${location.pathname.startsWith('/my-appointments') ? 'text-primary' : 'text-foreground/80'}`}>
            <Calendar className="w-6 h-6 mb-1" />
            Mis Citas
          </Link >
          {/* ModeToggle for Mobile */}
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
    </>
  );
};

export default ImprovedNavigation;