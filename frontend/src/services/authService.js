import api from '../configuration/api_axios';

const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Erreur de connexion:', error.response?.data || error.message);
      throw error;
    }
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);

    // Stocke le token seulement après une réponse positive
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data;
  },

  logout: async () => {
    try {
      await api.get('/auth/logout');
      localStorage.removeItem('token');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // User information
  getCurrentUser: async () => {
    try {
      const response = await api.get('/user/me');
      return response.data;
    } catch (error) {
      console.error('Erreur getCurrentUser:', error.response?.data || error.message);
      throw error;
    }
  },

  getAllUsers: async () => {
    const response = await api.get('/user');
    return response.data;
  },

  // Token management
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;
