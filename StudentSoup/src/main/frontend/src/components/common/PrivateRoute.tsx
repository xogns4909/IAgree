import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  const accessToken = JSON.parse(localStorage.getItem('access-token') ?? '{}');
  const refreshToken = JSON.parse(localStorage.getItem('refresh-token') ?? '{}');

  if (!accessToken || !refreshToken || Date.now() >= refreshToken.expire) {
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
  }

  return refreshToken ? <Outlet /> : <Navigate to="login" />;
};

export default PrivateRoute;
