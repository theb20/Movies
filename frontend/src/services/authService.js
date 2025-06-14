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

  deleteUser: async (userId) => {
    const response = await api.delete(`/user/${userId}`);
    return response.data;
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
  },
  putUserById: async (id, userData) => {
    const response = await api.put(`/user/${id}`, userData);
    return response.data;
  },
  requestReset: async (email) => {
    const response = await api.post('/auth/reset-code', { email });
    return response.data;
  },
  verifyCode: async (email, resetCode) => {
    const response = await api.post('/auth/verify-code', { email, resetCode });
    return response.data;
  },
  resetPassword: async (email, resetCode, newPassword) => {
    const response = await api.post('/auth/reset-password', { email, resetCode, newPassword });
    return response.data;
  }
};

export default authService;
