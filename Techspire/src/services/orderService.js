import API from '../api/axios';

// Create a new order
export const createOrder = async (orderData) => {
  const response = await API.post('/api/orders', orderData);
  return response.data;
};

// Get logged-in user's orders
export const getMyOrders = async () => {
  const response = await API.get('/api/orders/myorders');
  return response.data;
};

// Admin: Get all orders
export const getAllOrders = async () => {
  const response = await API.get('/api/orders');
  return response.data;
};