import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers you need
  },
});

export default axiosInstance;
