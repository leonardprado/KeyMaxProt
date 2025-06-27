
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
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                      <Route path="/admin" element={<AdminDashboard />} />
                    </Route>
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
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
