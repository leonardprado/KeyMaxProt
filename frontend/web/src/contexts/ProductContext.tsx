import React, { createContext, useContext } from "react";

export type Producto = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  descripcion: string;
  stock: number;
  cuotas?: number;
  color?: string;
  rating: number;
  vendidos?: number;
  category?: string;
  brand?: string;
  reviews?: number;
  discount?: number;
  isBestSeller?: boolean;
  freeShipping?: boolean;
};

const productosIniciales: Producto[] = [
  {
    id: 1,
    name: "Set Caja Herramientas Juego Llave Tubo Kit 46 Piezas Estuche",
    price: 17460,
    originalPrice: 35053,
    image: "/img/herramientas.jpg",
    descripcion: "Set de herramientas completo con 46 piezas, ideal para el hogar o taller.",
    stock: 50,
    cuotas: 3,
    color: "Naranja",
    rating: 4.1,
    vendidos: 100,
  },
  // Puedes agregar más productos aquí
];

type ProductContextType = {
  productos: Producto[];
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("ProductContext debe estar dentro de ProductProvider");
  return ctx;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProductContext.Provider value={{ productos: productosIniciales }}>
    {children}
  </ProductContext.Provider>
);