import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❗ 인증 오류 발생:', error.response.data);
      if (process.env.NODE_ENV === 'production') {
        if (typeof window !== 'undefined') {
          window.location.href = '/signin/email';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
