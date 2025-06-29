import axios from 'axios';

const API_URL = 'http://localhost:5000/api/charts';

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Save chart metadata
export const saveChart = async (chartData) => {
  const response = await api.post('/', chartData);
  return response.data;
};

// Mark chart as exported
export const markChartExported = async (chartId) => {
  const response = await api.put(`/${chartId}/export`);
  return response.data;
};

// Get user's charts
export const getUserCharts = async () => {
  const response = await api.get('/');
  return response.data;
};

// Get chart by ID
export const getChartById = async (chartId) => {
  const response = await api.get(`/${chartId}`);
  return response.data;
};

// Delete chart
export const deleteChart = async (chartId) => {
  const response = await api.delete(`/${chartId}`);
  return response.data;
};
