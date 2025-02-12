import fetcher from '@/lib/fetcher';
import axios from 'axios';
import { API_PATH } from './api-path';
import {
  AuthRequest,
  AuthResponse,
  LoginBody,
  SignupBody,
} from '@/types/auth.type';
import { baseURL } from './@core';
import { User } from '@/types/user.type';

export interface SpotifyLoginResponse {
  user: {
    userId: number;
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

export const signup = async (signupBody: SignupBody) => {
  const response = await fetcher({
    method: 'POST',
    url: '/auth/signup',
    data: signupBody,
  });
  return response.data;
};

export const login = async (loginBody: LoginBody) => {
  const response = await fetcher<{ user: User; accessToken: string }>({
    method: 'POST',
    url: '/auth/login',
    data: loginBody,
  });
  return response.data;
};

export const postAuthorizationCode = async ({
  authorizationCode,
  provider,
}: AuthRequest): Promise<AuthResponse> => {
  try {
    console.log('Sending to Backend - Provider:', provider);
    console.log('Sending to Backend - Code:', authorizationCode);
    const apiPath = API_PATH.login.replace(':provider', provider);
    const response = await axios.post<AuthResponse>(
      `${baseURL}${apiPath}`,
      { code: authorizationCode },
      { withCredentials: true } // 여기서 옵션 객체를 전달
    );
    return response.data;
  } catch (error) {
    console.error('postAuthorizationCode Error:', error);
    throw error;
  }
};

export const logout = async () => {
  const response = await fetcher({
    method: 'POST',
    url: '/auth/logout',
  });
  return response.data;
};
