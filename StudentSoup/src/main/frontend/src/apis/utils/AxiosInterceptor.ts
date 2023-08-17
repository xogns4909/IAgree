import axios from 'axios';
import { refreshAccessToken } from '../auth/AuthAPI';

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

axiosInstance.interceptors.request.use(
  config => {
    if (localStorage.getItem('access-token') !== null) {
      const accessToken = JSON.parse(localStorage.getItem('access-token') ?? '{}');
      const refreshToken = JSON.parse(localStorage.getItem('refresh-token') ?? '{}');

      if (Date.now() >= accessToken.expire && Date.now() <= refreshToken.expire) {
        refreshAccessToken(refreshToken.value).then(response => {
          const newAccessToken = JSON.parse(localStorage.getItem('access-token') ?? '{}');

          config.headers.Authorization = `Bearer ${newAccessToken.value}`;
        });
      } else {
        config.headers.Authorization = `Bearer ${accessToken.value}`;
      }
    }

    return config;
  },
  async error => {
    return await Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    const refreshToken = JSON.parse(localStorage.getItem('refresh-token') ?? '{}');

    if (error.response.status === 403 && localStorage.getItem('refresh-token') !== null) {
      if (refreshToken) {
        originalRequest._retry = true;

        await refreshAccessToken(refreshToken.value)
          .then(() => {
            const newAccessToken = JSON.parse(localStorage.getItem('access-token') ?? '{}');

            originalRequest.headers.Authorization = `Bearer ${newAccessToken.value}`;
          })
          .catch(err => {
            console.log(err);
          });

        return await axiosInstance(originalRequest);
      }
    }

    return await Promise.reject(error);
  },
);

export default axiosInstance;
