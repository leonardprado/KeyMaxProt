import apiClient from '../api/axiosConfig';
import { User } from '../types';
import axios from 'axios'; // Importar axios

const API_URL = '/auth'; // La URL base ya está en axiosConfig

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(`${API_URL}/register`, userData);
    if (response.data.token && response.data.user) {
      localStorage.setItem('keymax_user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error; // Re-lanza el error de Axios
    } else {
      throw new Error('An unexpected error occurred during registration.');
    }
  }
};

const login = async (userData: LoginData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(`${API_URL}/login`, userData);
    if (response.data.token && response.data.user) {
      localStorage.setItem('keymax_user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else {
      throw new Error('An unexpected error occurred during login.');
    }
  }
};

const logout = () => {
  localStorage.removeItem('keymax_user');
};

const updateProfile = async (userData: Partial<User>): Promise<AuthResponse> => {
  try {
    const response = await apiClient.put<AuthResponse>(`${API_URL}/perfil`, userData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else {
      throw new Error('An unexpected error occurred during profile update.');
    }
  }
};

const authService = {
  register,
  login,
  logout,
  updateProfile, // Añadir el nuevo método
};

export default authService;