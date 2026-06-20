import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://edge-prnl.onrender.com/api',
});

export const getProducts = () => API.get('/products');
export const getProduct = (id) => API.get(`/products/${id}`);
export const getWilayas = () => API.get('/wilayas');
export const placeOrder = (orderData) => API.post('/orders', orderData);

export default API;

// Resolve uploaded image paths to full URLs
export const resolveImageUrl = (src) => {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  const base = process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://edge-prnl.onrender.com/api';
  return base + src;
};
