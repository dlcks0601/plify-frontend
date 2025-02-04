import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import useAuthStore from '@/store/authStore';
import { login, LoginBody } from '@/apis/auth.api';

export const useAuthMutation = () => {
  const router = useRouter();
  const { login: setLogin } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async (loginBody: LoginBody) => {
      const response = await login(loginBody);
      return response;
    },
    onSuccess: (data, variables) => {
      setLogin(
        {
          email: variables.email,
          nickname: '',
          id: 0,
        },
        data.access_token
      );

      router.push('/');
    },
    onError: (error) => {
      console.error('로그인 실패:', error);
    },
  });

  return mutation;
};
