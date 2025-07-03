// src/App.tsx (VERSIÓN FINAL Y COMPLETA)

import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './layouts/AdminLayout'; // Importa el layout de administrador

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
import ServiceDetail from './pages/ServiceDetail'; // Importa ServiceDetail
import SearchResultsPage from './pages/SearchResultsPage';
import ShopDetail from './pages/ShopDetail'; // Importa ShopDetail

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
import ServiceCreatePage from './pages/dashboard/services/ServiceCreatePage';
import ProductCreatePage from './pages/dashboard/products/ProductCreatePage';
import SalesChart from './pages/dashboard/SalesChart';
import CategoryChart from './pages/dashboard/CategoryChart';
import UserRoleChart from './pages/dashboard/UserRoleChart';

// ¡NUEVA RUTA AÑADIDA AQUÍ!
import Appointments from './pages/Appointments'; // <-- Importa tu componente de citas
import AppointmentPage from './pages/AppointmentPage';
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
        <Route path="/service/:id" element={<ServiceDetail />} /> {/* Añade la ruta para ServiceDetail */}
        <Route path="/shop/:id" element={<ShopDetail />} /> {/* Añade la ruta para ShopDetail */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/profile" element={<Profile />} />
        {/* --- Aquí se añade la ruta para las citas del usuario --- */}
        <Route path="/my-appointments" element={<Appointments />} />
        <Route path="/book-appointment" element={<AppointmentPage />} /> {/* <-- Agrega la ruta para reservar citas también */}
        <Route path="/search" element={<SearchResultsPage />} />
      </Route>
      
      {/* --- Rutas del Dashboard de Admin (Protegidas) --- */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="services" element={<ServiceListPage />} />
          <Route path="shops" element={<ShopListPage />} />
          <Route path="users" element={<UserListPage />} />
          <Route path="products/create" element={<ProductCreatePage />} />
          <Route path="services/create" element={<ServiceCreatePage />} />
          <Route path="sales-chart" element={<SalesChart />} />
          <Route path="category-chart" element={<CategoryChart />} />
          <Route path="user-role-chart" element={<UserRoleChart />} />
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