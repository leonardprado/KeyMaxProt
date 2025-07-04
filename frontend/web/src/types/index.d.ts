declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';
declare module '*.webp';
declare module '*.bmp';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images?: string[];
  brand: string;
  category: string;
  stock: number;
  freeShipping?: boolean;
  onSale?: boolean;
  tags?: string[];
  averageRating: number;
  reviewCount: number;
  isBestSeller?: boolean;
  seller: {
    seller_id: string;
    seller_model: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  name?: string;
  lastName?: string;
  address?: string;
  phone?: string;
  avatar?: string;
}

export interface User {
  id: string;
  email: string;
  profile: UserProfile;
  role: 'user' | 'admin' | 'tecnico' | 'shop_owner' | 'superadmin';
  createdAt: string;
  preferences?: {
    notifications: boolean;
    marketing: boolean;
  };
  token?: string;
}

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  user: { _id: string; name: string } | null; // Assuming user might be populated with _id and name
  product?: string; // If it's a product review
  service?: string; // If it's a service review
  createdAt: string;
  updatedAt: string;
}
