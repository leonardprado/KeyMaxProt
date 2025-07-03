import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth'; // Actualizado para coincidir con el puerto del backend

const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    if (response.data.token) {
      localStorage.setItem('keymax_user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error; // Re-lanza el error para que el componente que llama lo maneje
  }
};

const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    if (response.data.token) {
      localStorage.setItem('keymax_user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error; // Re-lanza el error para que el componente que llama lo maneje
  }
};

const logout = () => {
  localStorage.removeItem('keymax_user');
};

const updateProfile = async ({ name, lastName, email, phone, address }) => {
  // Obtener el token del usuario autenticado desde localStorage
  const storedUser = localStorage.getItem('keymax_user');
  let token = null;
  if (storedUser) {
    const user = JSON.parse(storedUser);
    token = JSON.parse(storedUser).token; // Asumiendo que el token se guarda junto con los datos del usuario
  }

  // Configurar headers con el token
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Realizar la llamada PUT a la ruta de actualización de perfil
  try {
    const response = await axios.put(`${API_URL}/perfil`, {
      email,
      name,
      lastName,
      phone,
      address
    }, config);

    // Opcional: Actualizar el usuario en localStorage con los nuevos datos si la API retorna el usuario actualizado
    // if (response.data.user) {
    //   localStorage.setItem('keymax_user', JSON.stringify(response.data.user));
    // }

    return response.data; // Retornar los datos de respuesta de la API
  } catch (error) {
    throw error; // Re-lanza el error para que el componente que llama lo maneje
  }
};

const authService = {
  register,
  login,
  logout,
  updateProfile, // Añadir el nuevo método
};

export default authService;