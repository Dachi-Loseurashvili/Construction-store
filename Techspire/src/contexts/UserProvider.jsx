import React, { useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import API from '../api/axios';

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await API.get('/api/auth/me');
        setUser(response.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await API.post('/api/auth/login', { email, password });
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      await API.post('/api/auth/logout');
    } catch {
      // Ignore logout errors
    }
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, isAdmin, loading }}>
      {children}
    </UserContext.Provider>
  );
};
