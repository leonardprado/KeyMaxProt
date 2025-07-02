// src/api/axiosConfig.js (VERSIÓN CORREGIDA Y FINAL)

import axios from 'axios';

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

export default apiClient;