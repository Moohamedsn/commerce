import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
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
  const base = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
  return base + src;
};
