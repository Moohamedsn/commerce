import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyToken } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('edge_admin_token');
    if (!token) { setLoading(false); return; }
    verifyToken()
      .then(res => setAdmin(res.data.admin))
      .catch(() => localStorage.removeItem('edge_admin_token'))
      .finally(() => setLoading(false));
  }, []);

  const loginAdmin = (token, adminData) => {
    localStorage.setItem('edge_admin_token', token);
    setAdmin(adminData);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('edge_admin_token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
