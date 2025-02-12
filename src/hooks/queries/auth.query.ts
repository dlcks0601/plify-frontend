import { useMutation, UseMutationResult } from '@tanstack/react-query';
import useAuthStore from '@/store/authStore';
import { AuthResponse } from '@/types/auth.type';
import { useShallow } from 'zustand/shallow';
import { postAuthorizationCode, logout as fetchLogout } from '@/apis/auth.api';
import { useRouter } from 'next/navigation';

export const useAuthMutation = (): UseMutationResult<
  AuthResponse,
  unknown,
  {
    authorizationCode: string;
    provider: string;
  }
> => {
  const router = useRouter();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: ({ authorizationCode, provider }) =>
      postAuthorizationCode({ authorizationCode, provider }),
    onSuccess: async (data) => {
      const { accessToken, user, isExistingUser } = data;
      await login(user, accessToken);

      router.prefetch('/');
      router.push('/');
    },
    onError: (error) => {
      console.error('Authorization Code 전송 중 오류:', error);
    },
  });
};

export const useLogout = () => {
  const [logout] = useAuthStore(useShallow((state) => [state.logout]));
  const router = useRouter();
  return useMutation({
    mutationFn: () => fetchLogout(),
    onSuccess: () => {
      alert('로그아웃');
      logout();
      router.push('/');
    },
  });
};
