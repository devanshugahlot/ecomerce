import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('hypril_user') || localStorage.getItem('vyro_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    checkLoggedInUser();
  }, []);

  const checkLoggedInUser = async () => {
    const token = localStorage.getItem('hypril_token') || localStorage.getItem('vyro_token');
    const savedUser = localStorage.getItem('hypril_user') || localStorage.getItem('vyro_user');

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }

    if (token) {
      try {
        const response = await api.get('/auth/me');
        if (response.data && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('hypril_user', JSON.stringify(response.data.user));
          localStorage.setItem('vyro_user', JSON.stringify(response.data.user));
        }
      } catch (err) {
        // Token expired or invalid
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('hypril_token');
          localStorage.removeItem('hypril_user');
          localStorage.removeItem('vyro_token');
          localStorage.removeItem('vyro_user');
          setUser(null);
        }
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !password) {
      addToast('Please enter both email and password', 'error');
      return { success: false, message: 'Email and password required' };
    }

    try {
      const response = await api.post('/auth/login', { email: cleanEmail, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('hypril_token', token);
      localStorage.setItem('hypril_user', JSON.stringify(userData));
      localStorage.setItem('vyro_token', token);
      localStorage.setItem('vyro_user', JSON.stringify(userData));
      setUser(userData);
      addToast(`Welcome back, ${userData.name}!`, 'success');
      return { success: true, user: userData };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Login failed. Please check your credentials!';
      addToast(errMsg, 'error');
      return { success: false, message: errMsg };
    }
  };

  const register = async (name, email, phone, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();

    try {
      const response = await api.post('/auth/register', { name, email: cleanEmail, phone, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('hypril_token', token);
      localStorage.setItem('hypril_user', JSON.stringify(userData));
      localStorage.setItem('vyro_token', token);
      localStorage.setItem('vyro_user', JSON.stringify(userData));
      setUser(userData);
      addToast('Account created & logged in successfully!', 'success');
      return { success: true, user: userData };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      addToast(errMsg, 'error');
      return { success: false, message: errMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('hypril_token');
    localStorage.removeItem('hypril_user');
    localStorage.removeItem('vyro_token');
    localStorage.removeItem('vyro_user');
    setUser(null);
    addToast('You have been logged out.', 'info');
  };

  const updateUserProfile = (updatedData) => {
    setUser((prev) => {
      const newObj = { ...prev, ...updatedData };
      localStorage.setItem('hypril_user', JSON.stringify(newObj));
      localStorage.setItem('vyro_user', JSON.stringify(newObj));
      return newObj;
    });
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
