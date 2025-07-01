import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth'; // Actualizado para coincidir con el puerto del backend

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  if (response.data.token) {
    localStorage.setItem('keymax_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data.token) {
    localStorage.setItem('keymax_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('keymax_user');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;