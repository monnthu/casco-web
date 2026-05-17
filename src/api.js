import axios from 'axios';

const API = axios.create({
    baseURL: https://casco-backend.onrender.com
});

// Adjuntar token JWT en cada request
API.interceptors.request.use(cfg => {
    const token = localStorage.getItem('token');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

export default API;