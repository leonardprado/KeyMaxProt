import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // La URL de tu backend
});

// Interceptor para añadir el token a todas las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Asumimos que guardas el token aquí
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;