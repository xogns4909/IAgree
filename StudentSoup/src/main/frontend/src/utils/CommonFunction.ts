import { ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE } from 'utils/CommonConstant';

export const setAccessToken = (accessTokenValue: string) => {
  const accessToken = JSON.stringify({
    value: accessTokenValue,
    expire: Date.now() + ACCESS_TOKEN_EXPIRE,
  });

  localStorage.setItem('access-token', accessToken);
};

export const setRefreshToken = (RefreshTokenValue: string) => {
  const refreshToken = JSON.stringify({
    value: RefreshTokenValue,
    expire: Date.now() + REFRESH_TOKEN_EXPIRE,
  });

  localStorage.setItem('refresh-token', refreshToken);
};
