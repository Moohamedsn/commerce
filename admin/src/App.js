import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Wilayas from './pages/Wilayas';
import Layout from './components/Layout';
import './index.css';

function PrivateRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <div className="loader"><div className="spinner" /></div>;
  return admin ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
            <Route path="wilayas" element={<Wilayas />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
