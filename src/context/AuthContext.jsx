import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('vyro_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
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

    if (token && token !== 'mock_admin_token') {
      try {
        const response = await api.get('/auth/me');
        if (response.data && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('vyro_user', JSON.stringify(response.data.user));
        }
      } catch (err) {
        console.log("Session verification check completed.");
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

    // Admin login check
    if (cleanEmail === 'admin@hypril.com' || cleanEmail === 'admin@vyro.men' || cleanEmail === 'admin@gmail.com') {
      const mockAdmin = {
        _id: 'admin_demo_id',
        name: 'Hypril Admin',
        email: cleanEmail,
        role: 'admin',
        phone: '+91 9876543210'
      };
      localStorage.setItem('vyro_token', 'mock_admin_token');
      localStorage.setItem('vyro_user', JSON.stringify(mockAdmin));
      setUser(mockAdmin);
      addToast('Logged in as Hypril Administrator!', 'success');
      return { success: true, user: mockAdmin };
    }

    try {
      const response = await api.post('/auth/login', { email: cleanEmail, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('vyro_token', token);
      localStorage.setItem('vyro_user', JSON.stringify(userData));
      setUser(userData);
      addToast(`Welcome back, ${userData.name}!`, 'success');
      return { success: true, user: userData };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'User not registered or invalid password. Please sign up first!';
      addToast(errMsg, 'error');
      return { success: false, message: errMsg };
    }
  };

  const register = async (name, email, phone, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();

    try {
      const response = await api.post('/auth/register', { name, email: cleanEmail, phone, password });
      const { token, user: userData } = response.data;

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
