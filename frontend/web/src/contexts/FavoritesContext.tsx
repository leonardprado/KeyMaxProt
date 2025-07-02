// src/contexts/FavoritesContext.tsx (CORREGIDO)

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types/product'; // <-- Importamos nuestro nuevo tipo

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void; // <-- Ahora el ID es un string
  isFavorite: (productId: string) => boolean;       // <-- Ahora el ID es un string
  toggleFavorite: (product: Product) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);

  const addToFavorites = (product: Product) => {
    setFavorites(prev => {
      // Comparamos usando _id
      if (prev.find(item => item._id === product._id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromFavorites = (productId: string) => { // Recibe string
    setFavorites(prev => prev.filter(item => item._id !== productId)); // Compara con _id
  };

  const isFavorite = (productId: string) => { // Recibe string
    return favorites.some(item => item._id === productId); // Compara con _id
  };

  const toggleFavorite = (product: Product) => {
    // Compara usando _id
    if (isFavorite(product._id)) {
      removeFromFavorites(product._id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      toggleFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};