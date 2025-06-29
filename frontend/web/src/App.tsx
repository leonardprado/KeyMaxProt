
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";

import { AppointmentProvider } from "@/contexts/AppointmentContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ProductProvider } from "@/contexts/ProductContext";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import Appointments from "./pages/Appointments";
import AdminDashboard from "./pages/AdminDashboard";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import AuthPage from "./pages/AuthPage";
import AppointmentPage from "./pages/AppointmentPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from './components/layout/DashboardLayout';
import ProductListPage from './pages/dashboard/products/ProductListPage';
import ProductCreatePage from './pages/dashboard/products/ProductCreatePage';
import ProductEditPage from './pages/dashboard/products/ProductEditPage';
// Importa tus otras páginas, como Login, Home, etc.
// Importa las páginas específicas del dashboard

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <CartProvider>
          <FavoritesProvider>
            <AppointmentProvider>
              <ProductProvider>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                  <TooltipProvider>
                    <Toaster />
                <Sonner />
                <BrowserRouter future={{ v7_relativeSplatPath: true }}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route element={<ProtectedRoute />}>
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/my-appointments" element={<Appointments />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/book-appointment" element={<AppointmentPage />} />
                    </Route>

                    {/* Rutas protegidas del Dashboard */}
                    <Route path="/dashboard" element={<DashboardLayout />}>
                      {/* La página de inicio del dashboard */}
                      {/* <Route index element={<OverviewPage />} /> */}
                      
                      {/* La ruta para la lista de productos */}
                      <Route path="products" element={<ProductListPage />} />

                      {/* Aquí añadirás más rutas como /dashboard/products/new, etc. */}
                      <Route path="products/new" element={<ProductCreatePage />} />
                      <Route path="products/edit/:productId" element={<ProductEditPage />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </ThemeProvider>
          </ProductProvider>
        </AppointmentProvider>
      </FavoritesProvider>
    </CartProvider>
  </NotificationProvider>
</QueryClientProvider>
);

export default App;
