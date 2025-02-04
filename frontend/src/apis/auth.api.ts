import fetcher from '@/utils/fetcher';
import { AxiosResponse } from 'axios';

interface SignupBody {
  email: string;
  nickname: string;
  password: string;
  profileUrl?: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export const signup = async (signupBody: SignupBody): Promise<AuthResponse> => {
  const response: AxiosResponse<AuthResponse> = await fetcher({
    method: 'POST',
    url: '/auth/signup',
    data: signupBody,
  });
  return response.data;
};

export const login = async (loginBody: LoginBody): Promise<AuthResponse> => {
  try {
    const data: AuthResponse = await fetcher({
      method: 'POST',
      url: '/auth/login',
      data: loginBody,
    });

    console.log('로그인 응답 데이터:', data);

    if (data && data.access_token) {
      return data;
    } else {
      throw new Error('로그인 실패: access_token이 반환되지 않았습니다.');
    }
  } catch (error: any) {
    console.error('로그인 오류:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || '로그인 요청 중 오류가 발생했습니다.'
    );
  }
};
