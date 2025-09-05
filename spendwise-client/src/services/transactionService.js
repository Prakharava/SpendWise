import api from './api';

export const getTransactions = async (params = {}) => {
  const response = await api.get('/transactions', { params });
  return response.data;
};

export const addTransaction = async (payload) => {
  const response = await api.post('/transactions', payload);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};

export const getCategorySummary = async (params = {}) => {
  const response = await api.get('/transactions/category-summary', { params });
  return response.data; // [{ _id: 'food', total: 123, count: 3 }, ...]
};

export const getSummary = async (params = {}) => {
  // Optional params can include date range if backend supports it
  const response = await api.get('/transactions/summary', { params });
  return response.data; // { totalIncome, totalExpense, balance }
};
