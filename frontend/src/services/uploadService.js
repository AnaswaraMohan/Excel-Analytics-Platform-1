import axios from 'axios';

const API_URL = 'http://localhost:5000/api/upload';

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

// Upload Excel file
export const uploadExcelFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Get user's uploads
export const getUserUploads = async () => {
  const response = await api.get('/');
  return response.data;
};

// Get specific upload by ID
export const getUploadById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};
