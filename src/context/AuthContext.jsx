import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    checkLoggedInUser();
  }, []);

  const checkLoggedInUser = async () => {
    const token = localStorage.getItem('vyro_token');
    const savedUser = localStorage.getItem('vyro_user');
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing saved user", e);
      }
    }

    if (token) {
      try {
        const response = await api.get('/auth/me');
        if (response.data && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('vyro_user', JSON.stringify(response.data.user));
        }
      } catch (err) {
        console.log("Session verification failed, using cached user if available");
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('vyro_token', token);
      localStorage.setItem('vyro_user', JSON.stringify(userData));
      setUser(userData);
      addToast(`Welcome back, ${userData.name}!`, 'success');
      return { success: true, user: userData };
    } catch (error) {
      // Fallback for dev demo mode if server offline
      if (email === 'admin@vyro.men' && password === 'Admin@123') {
        const mockAdmin = {
          _id: 'admin_demo_id',
          name: 'Demo Admin',
          email: 'admin@vyro.men',
          role: 'admin',
          phone: '+91 9876543210'
        };
        localStorage.setItem('vyro_token', 'mock_admin_token');
        localStorage.setItem('vyro_user', JSON.stringify(mockAdmin));
        setUser(mockAdmin);
        addToast('Logged in as Admin (Demo Mode)', 'success');
        return { success: true, user: mockAdmin };
      }

      const msg = error.response?.data?.message || 'Login failed. Please check credentials.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, phone, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, phone, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('vyro_token', token);
      localStorage.setItem('vyro_user', JSON.stringify(userData));
      setUser(userData);
      addToast('Account created successfully!', 'success');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('vyro_token');
    localStorage.removeItem('vyro_user');
    setUser(null);
    addToast('You have been logged out.', 'info');
  };

  const updateUserProfile = (updatedData) => {
    setUser((prev) => {
      const newObj = { ...prev, ...updatedData };
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
