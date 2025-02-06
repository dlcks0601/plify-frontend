import fetcher from '@/utils/fetcher';
import { AxiosResponse } from 'axios';
import { API_PATH } from './api-path';

interface SignupBody {
  email: string;
  nickname: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    userId: number;
    email: string;
    nickname: string;
  };
  accessToken: string;
}

export interface SignupResponse {
  user: {
    userId: number;
    email: string;
    nickname: string;
  };
}

export interface User {
  userId: number;
  nickname: string;
  email: string;
}

export const signup = async (signupBody: SignupBody) => {
  const apiPath = API_PATH.signup;
  const response = await fetcher({
    method: 'POST',
    url: apiPath,
    data: signupBody,
  });
  return response.data;
};

export const login = async (loginBody: LoginBody): Promise<LoginResponse> => {
  const apiPath = API_PATH.login;
  const response = await fetcher<{ user: User; accessToken: string }>({
    method: 'POST',
    url: apiPath,
    data: loginBody,
  });
  return response.data;
};
