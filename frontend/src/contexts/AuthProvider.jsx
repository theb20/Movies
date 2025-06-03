import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
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
      await checkAuth();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/logout');
    }
  };

  const register = async (credentials) => {
    try {
      const response = await authService.register(credentials);
      await checkAuth();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const putUserById = async (id, userData) => {
    try {
      const response = await authService.putUserById(id, userData);
      await checkAuth();
      return response;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, putUserById }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
