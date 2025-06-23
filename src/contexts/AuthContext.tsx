
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: 'customer' | 'admin';
  createdAt: Date;
  preferences?: {
    notifications: boolean;
    marketing: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simular carga inicial desde localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('keymax_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('keymax_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular validación básica
    if (email && password.length >= 6) {
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'customer',
        createdAt: new Date(),
        preferences: {
          notifications: true,
          marketing: false
        }
      };
      
      setUser(newUser);
      localStorage.setItem('keymax_user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password.length >= 6 && name.trim()) {
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name: name.trim(),
        role: 'customer',
        createdAt: new Date(),
        preferences: {
          notifications: true,
          marketing: false
        }
      };
      
      setUser(newUser);
      localStorage.setItem('keymax_user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('keymax_user');
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('keymax_user', JSON.stringify(updatedUser));
    setIsLoading(false);
    return true;
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};
