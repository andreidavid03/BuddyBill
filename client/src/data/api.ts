import axios from 'axios';

const getToken = () => {
  return localStorage.getItem("token");
};

const api = axios.create({
  baseURL: 'http://localhost:5000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;