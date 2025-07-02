// src/main.tsx (VERSIÓN ESTRUCTURAL FINAL)
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App'; // Importamos el componente App
import './index.css';

// Importamos todos nuestros providers
import { ThemeProvider } from './components/theme-provider'; // De Shadcn
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { Toaster } from "@/components/ui/sonner" // O la que uses

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <NotificationProvider>
                <App />
                <Toaster />
              </NotificationProvider>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);