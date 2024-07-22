import axios from 'axios';

// const baseURL = 'http://localhost:8800/api';
const baseURL = 'https://biddershubbackend.onrender.com/api';
const apiRequest = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export default apiRequest;
