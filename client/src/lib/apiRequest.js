import axios from 'axios';

const apiRequest = axios.create({
  baseURL: 'https://biddershubbackend.onrender.com/api',
  withCredentials: true,
});

export default apiRequest;
