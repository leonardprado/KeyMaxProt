// src/main.tsx (VERSIÓN CORREGIDA PARA EL TEMA)

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import Index from './pages/Index.tsx';
import './index.css';

// Importación de todos los Providers necesarios
import { ThemeProvider } from '@material-tailwind/react'; // <-- Tu import actual
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
// ... otros imports

// NO necesitas importar el theme aquí, withMT lo hace por debajo.
// Solo asegúrate de que el archivo tailwind.config.js exista.

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* El ThemeProvider de Material Tailwind NO necesita un 'value' prop si usas 'withMT' */}
      {/* Simplemente envolviendo la app es suficiente. */}
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <Index />
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);