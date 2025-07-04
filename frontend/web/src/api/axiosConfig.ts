// src/api/axiosConfig.js (VERSIÓN CORREGIDA Y FINAL)

import axios from 'axios';
import { toast } from '@/hooks/use-toast'; // Importar la función toast

// La URL base de nuestra API de backend que está corriendo en el puerto 3001
const API_URL = 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Interceptor para añadir el token JWT a todas las peticiones salientes
apiClient.interceptors.request.use(
  (config) => {
    // Leemos el usuario del localStorage
    const userString = localStorage.getItem('keymax_user');
    
    if (userString) {
      try {
        const user = JSON.parse(userString);
        // Si el usuario y el token existen, los añadimos a la cabecera
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error("Error al parsear datos del usuario desde localStorage", e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo mostramos el toast si el error no es una cancelación de petición
    // y si no es un error 401 (Unauthorized) que se maneja en el AuthContext
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado.';
    const statusCode = error.response?.status;

    // Evitar mostrar toast para errores 401, ya que AuthContext los maneja
    if (statusCode !== 401) {
      toast({
        title: `Error ${statusCode || ''}`.trim(),
        description: errorMessage,
        variant: 'destructive',
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;