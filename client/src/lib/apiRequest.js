import axios from 'axios';

// const baseURL = 'http://localhost:8800/api';
const baseURL = 'https://full-stack-estate-main.onrender.com/api';
const apiRequest = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export default apiRequest;
