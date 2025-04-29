import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';


export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      await checkAuth(); // Verify token and get user data
      return response;
    } catch (error) {
      throw error;//throw signifie que l'on veut lever l'erreur et qu'on ne veut pas que le code continue d'executer apres le throw
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const register = async (credentials) =>{
    try {
      const response = await authService.register(credentials);
      await checkAuth(); // Verify token and get user data
      return response;
    } catch (error) {
      throw error;
    }
  }
  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
