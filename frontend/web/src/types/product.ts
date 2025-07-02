// src/types/product.ts

export interface Product {
    _id: string; 
    name: string;
    description?: string;
    price: number;
    category?: string;
    brand?: string;
    images?: string[];
    // Añade aquí cualquier otro campo que venga de tu API
    stock_quantity?: number; 
    averageRating?: number;
    reviewCount?: number;
  }