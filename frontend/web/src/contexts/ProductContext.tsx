import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Producto {
  id: number;
  name: string;
  descripcion: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  stock: number;
  discount?: number;
  isBestSeller?: boolean;
  freeShipping?: boolean;
}

interface ProductContextType {
  products: Producto[];
  getProductById: (id: number) => Producto | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const productsData: Producto[] = [
    {
        id: 1,
        descripcion: 'Set completo de herramientas con 46 piezas incluyendo llaves, tubos y accesorios en un práctico estuche',
        stock: 150,
        name: 'Set Caja Herramientas Juego Llave Tubo Kit 46 Piezas Estuche',
        price: 13519,
        originalPrice: 22200,
        image: 'https://images.unsplash.com/photo-1573089988574-cf9c24c6c1b6?w=400&h=300&fit=crop',
        category: 'tools',
        brand: 'ALPINA',
        rating: 4.4,
        reviews: 3750,
        discount: 39,
        isBestSeller: true,
        freeShipping: true
      },
      {
        id: 2,
        descripcion: 'Parlante Bluetooth portátil con luces LED, potencia de 30W RMS, conectividad inalámbrica y diseño moderno',
        stock: 75,
        name: 'Parlante Bluetooth 30w Rms Jd E300 Portátil Luces Led Inalámbrico',
        price: 74787,
        originalPrice: 149999,
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop',
        category: 'audio',
        brand: 'JD',
        rating: 4.5,
        reviews: 132,
        discount: 50,
        freeShipping: true
      },
      {
        id: 3,
        descripcion: 'Auriculares inalámbricos con cancelación de ruido, batería de larga duración y diseño ergonómico',
        stock: 200,
        name: 'Auriculares Inalámbricos Xiaomi Redmi Buds 6 Play Black',
        price: 21299,
        originalPrice: 29980,
        image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop',
        category: 'audio',
        brand: 'XIAOMI',
        rating: 4.8,
        reviews: 15925,
        discount: 26,
        isBestSeller: true,
        freeShipping: true
      },
      {
        id: 4,
        descripcion: 'Sistema de alarma para auto con 2 controles remotos y sensor de impacto incluido',
        stock: 100,
        name: 'Alarma Auto X28 Z10 Rs + 2 Controles + Sensor Impacto',
        price: 89990,
        originalPrice: 129990,
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
        category: 'security',
        brand: 'X28',
        rating: 4.6,
        reviews: 892,
        discount: 31,
        freeShipping: true
      },
      {
        id: 5,
        descripcion: 'Kit de láminas polarizadas 3M Crystalline con 70% de transparencia para ventanas laterales de vehículos',
        stock: 50,
        name: 'Kit Polarizado Láminas 3M Crystalline 70% Ventanas Laterales',
        price: 45000,
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
        category: 'automotive',
        brand: '3M',
        rating: 4.9,
        reviews: 234,
        freeShipping: true
      },
      {
        id: 6,
        descripcion: 'Kit de luces LED Xenón de alta potencia con 12000 lúmenes, compatible con múltiples modelos',
        stock: 120,
        name: 'Luces LED Kit Xenón H4 H7 H11 9005 9006 Philips 12000LM',
        price: 32500,
        originalPrice: 48000,
        image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=300&fit=crop',
        category: 'lighting',
        brand: 'PHILIPS',
        rating: 4.7,
        reviews: 567,
        discount: 32,
        freeShipping: true
      }
];

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products] = useState<Producto[]>(productsData);

  const getProductById = (id: number) => {
    return products.find(p => p.id === id);
  };

  return (
    <ProductContext.Provider value={{ products, getProductById }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};