import axios, { type AxiosResponse } from 'axios';
import { type SignUpUserInfo } from '../../interfaces/AuthAPITypes';
import { setAccessToken, setRefreshToken } from 'utils/CommonFunction';

export const login = async (id: string, password: string) => {
  const res = await axios
    .post('/members/login', {
      id,
      pwd: password,
    })
    .then(response => {
      setAccessToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);
    });
  return res;
};

export const logout = async (): Promise<AxiosResponse> => {
  const res = await axios.post('/members/logout');
  return res;
};

export const createUser = async (id: string, password: string): Promise<AxiosResponse> => {
  const res = await axios.post('/members/signUp/2', {
    id,
    pwd: password,
  });
  return res;
};

export const refreshAccessToken = async (refreshToken: string) => {
  const res = await axios
    .post('/jwt', {}, { headers: { Authorization: refreshToken } })
    .then(response => {
      setAccessToken(response.data);
    });
  return res;
};

export const checkSignUpId = async (memberId: number): Promise<AxiosResponse> => {
  const res = await axios.post('/members/signUp/2/Id', {
    memberId,
  });
  return res;
};

export const checkSignUpNickname = async (nickName: string): Promise<AxiosResponse> => {
  const res = await axios.post('/members/signUp/3/Nickname', {
    nickName,
  });
  return res;
};

export const authenticateEmail = async (email: string, domain: string): Promise<AxiosResponse> => {
  const res = await axios.post('/members/signUp/3/mail', {
    email: `${email}@${domain}`,
  });
  return res;
};
// 이메일 인증번호 전송

export const checkEmailAuthentication = async (
  email: string,
  authenticationNumber: number,
): Promise<AxiosResponse> => {
  const res = await axios.post('/members/signUp/3/checkMail', {
    email,
    authenticationNumber,
  });
  return res;
};
// 이메일 인증번호 확인

export const completeSignUp = async (userData: SignUpUserInfo): Promise<AxiosResponse> => {
  const res = await axios.post('/members/signUp/3', userData);
  return res;
};

export const findUserId = async (email: string) => {
  return await axios.post('/members/find/id', {
    email,
  });
};

export const findUserPassword = async (email: string, id: string) => {
  return await axios.post('/members/find/pwd', {
    email,
    id,
  });
};
