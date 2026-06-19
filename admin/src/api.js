import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach token to every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem('edge_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('edge_admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const login = (email, password) => API.post('/auth/login', { email, password });
export const verifyToken = () => API.get('/auth/verify');

// Products
export const getProducts = () => API.get('/products/admin');
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Orders
export const getOrders = (params) => API.get('/orders', { params });
export const getOrderStats = () => API.get('/orders/stats');
export const updateOrderStatus = (id, status) => API.patch(`/orders/${id}/status`, { status });

// Wilayas
export const getWilayas = () => API.get('/wilayas');
export const updateWilaya = (id, data) => API.put(`/wilayas/${id}`, data);
export const bulkUpdateWilayas = (updates) => API.put('/wilayas/bulk/update', { updates });

export default API;


// Image upload
export const uploadImages = (files) => {
  const formData = new FormData();
  files.forEach(f => formData.append('images', f));
  return API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteImage = (filename) => API.delete('/upload', { data: { filename } });
