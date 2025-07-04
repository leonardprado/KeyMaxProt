// src/App.tsx (VERSIÓN FINAL Y COMPLETA)

import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Páginas Públicas (Lazy Loaded)
import { lazyLoad } from './utils/lazyLoad';


// Páginas Públicas (Lazy Loaded)
const Index = lazyLoad('pages/Index');
const Marketplace = lazyLoad('pages/Marketplace');
const Blog = lazyLoad('pages/Blog');
const PostPage = lazyLoad('pages/PostPage');
const AboutPage = lazyLoad('pages/AboutPage');
const ServicesPage = lazyLoad('pages/ServicesPage');
const ContactPage = lazyLoad('pages/ContactPage');
const FAQPage = lazyLoad('pages/FAQPage');
const ProductDetail = lazyLoad('pages/ProductDetail');
const ServiceDetail = lazyLoad('pages/ServiceDetail');
const SearchResultsPage = lazyLoad('pages/SearchResultsPage');
const ShopDetail = lazyLoad('pages/ShopDetail');

// Páginas de Autenticación y Perfil (Lazy Loaded)
const AuthPage = lazyLoad('pages/AuthPage');
const Profile = lazyLoad('pages/Profile');

// Páginas del Dashboard (Lazy Loaded)
const AdminDashboard = lazyLoad('pages/AdminDashboard');
const OverviewPage = lazyLoad('pages/dashboard/OverviewPage');
const ProductListPage = lazyLoad('pages/dashboard/products/ProductListPage');
const ServiceListPage = lazyLoad('pages/dashboard/services/ServiceListPage');
const ShopListPage = lazyLoad('pages/dashboard/ShopListPage');
const UserListPage = lazyLoad('pages/dashboard/UserListPage');
const ServiceCreatePage = lazyLoad('pages/dashboard/services/ServiceCreatePage');
const ProductCreatePage = lazyLoad('pages/dashboard/products/ProductCreatePage');
const SalesChart = lazyLoad('pages/dashboard/SalesChart');
const CategoryChart = lazyLoad('pages/dashboard/CategoryChart');
const UserRoleChart = lazyLoad('pages/dashboard/UserRoleChart');

// Otras (Lazy Loaded)
const Appointments = lazyLoad('pages/Appointments');
const AppointmentPage = lazyLoad('pages/AppointmentPage');
const ProtectedRoute = lazyLoad('components/ProtectedRoute');
const NotFound = lazyLoad('pages/NotFound');

function App() {
  return (
    <Suspense fallback={<div role="status" aria-live="polite">Cargando...</div>}>
      <Routes>
        {/* --- Rutas Públicas con Navegación Principal --- */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/shop/:id" element={<ShopDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-appointments" element={<Appointments />} />
          <Route path="/book-appointment" element={<AppointmentPage />} />
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
          </Route>
        </Route>

        {/* --- Rutas que no usan el Layout Principal (como login) --- */}
        <Route path="/auth" element={<AuthPage />} />

        {/* --- Ruta para Página no Encontrada --- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;