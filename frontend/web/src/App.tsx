
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppointmentPage from './pages/AppointmentPage';
import Index from './pages/Index';
import AuthPage from './pages/AuthPage';
import Marketplace from './pages/Marketplace';
import Blog from './pages/Blog';
import PostPage from './pages/PostPage';
import AboutPage from './pages/AboutPage';
import FeaturedProductsPage from './pages/FeaturedProductsPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Appointments from './pages/Appointments';
import NotFound from './pages/NotFound';
import ShopListPage from './pages/dashboard/ShopListPage';
import ProductListPage from './pages/dashboard/products/ProductListPage';
import ServiceListPage from './pages/dashboard/ServiceListPage';
import UserListPage from './pages/dashboard/UserListPage';
import OverviewPage from './pages/dashboard/OverviewPage';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/featured-products" element={<FeaturedProductsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/book-appointment" element={<AppointmentPage />} />
        <Route path="/my-appointments" element={<Appointments />} />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }>
          <Route path="shops" element={<ShopListPage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="services" element={<ServiceListPage />} />
          <Route path="users" element={<UserListPage />} />
          <Route path="overview" element={<OverviewPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
