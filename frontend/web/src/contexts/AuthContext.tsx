
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  email: string;
  profile: {
    name?: string;
    lastName?: string;
    address?: string;
    phone?: string;
    avatar?: string;
  };
  role: 'user' | 'admin' | 'tecnico' | 'shop_owner' | 'superadmin';
  createdAt: Date;
  preferences?: {
    notifications: boolean;
    marketing: boolean;
  };
  token?: string; // Add token to User interface
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; message?: string }>;
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
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('keymax_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('keymax_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const data = await authService.login({ email, password });
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('keymax_user', JSON.stringify(data.user));
        toast({
          title: 'Éxito',
          description: 'Inicio de sesión exitoso.',
          variant: 'default',
        });
        return { success: true };
      }
      toast({
        title: 'Error',
        description: 'Credenciales inválidas.',
        variant: 'destructive',
      });
      return { success: false, message: 'Credenciales inválidas.' };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      console.error('Login failed:', error);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const data = await authService.register({ email, password, name });
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('keymax_user', JSON.stringify(data.user));
        toast({
          title: 'Éxito',
          description: 'Registro exitoso. ¡Bienvenido!',
          variant: 'default',
        });
        return { success: true };
      }
      toast({
        title: 'Error',
        description: 'Error al registrar usuario.',
        variant: 'destructive',
      });
      return { success: false, message: 'Error al registrar usuario.' };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al registrar usuario.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      console.error('Registration failed:', error);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('keymax_user');
    navigate('/'); // Redirigir al usuario a la página de inicio después de cerrar sesión
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    try {
      // Llamada real a la API para actualizar el perfil
      const updatedUserData = await authService.updateProfile(data);

      // Update user in state and localStorage
      const updatedUser = { ...user, ...updatedUserData.data }; // Acceder a data.data
      setUser(updatedUser);
      localStorage.setItem('keymax_user', JSON.stringify(updatedUser));

      toast({
        title: 'Éxito',
        description: 'Perfil actualizado correctamente.',
        variant: 'default',
      });

      setIsLoading(false);
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar el perfil.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      console.error('Error updating profile:', error);
      setIsLoading(false);
      return false;
    }
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
