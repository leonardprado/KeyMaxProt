// src/App.tsx (VERSIÓN FINAL Y COMPLETA)

import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout'; // Crearemos este

// Páginas Públicas
import Index from './pages/Index';
import Marketplace from './pages/Marketplace';
import Blog from './pages/Blog';
import PostPage from './pages/PostPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import ProductDetail from './pages/ProductDetail';

// Páginas de Autenticación y Perfil (sin el MainLayout)
import AuthPage from './pages/AuthPage';
import Profile from './pages/Profile'; // Asumiendo que Profile tiene su propio layout/nav

// Páginas del Dashboard
import AdminDashboard from './pages/AdminDashboard';
import OverviewPage from './pages/dashboard/OverviewPage';
import ProductListPage from './pages/dashboard/products/ProductListPage';
import ServiceListPage from './pages/dashboard/services/ServiceListPage';
import ShopListPage from './pages/dashboard/ShopListPage';
import UserListPage from './pages/dashboard/UserListPage';

// Otros
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      {/* --- Rutas Públicas con Navegación Principal --- */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      
      {/* --- Rutas del Dashboard de Admin (Protegidas) --- */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="services" element={<ServiceListPage />} />
          <Route path="shops" element={<ShopListPage />} />
          <Route path="users" element={<UserListPage />} />
          {/* Aquí irían las rutas de creación/edición del dashboard */}
        </Route>
      </Route>

      {/* --- Rutas que no usan el Layout Principal (como login) --- */}
      <Route path="/auth" element={<AuthPage />} />

      {/* --- Ruta para Página no Encontrada --- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;