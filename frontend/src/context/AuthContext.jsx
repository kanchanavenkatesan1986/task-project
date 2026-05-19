import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, id, fullName, role } = response.data;
      
      const userData = { id, fullName, email, role };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName, email, password, confirmPassword) => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/register', {
        fullName,
        email,
        password,
        confirmPassword,
      });
      const { token, id, role } = response.data;
      
      const userData = { id, fullName, email, role };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = (fullName) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, fullName };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
