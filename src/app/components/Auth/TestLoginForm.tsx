import useAuthStore from '@/store/authStore';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthMutation } from '@/hooks/queries/auth.query';
import { login } from '@/apis/auth.api';

const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요.'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function TestLoginForm() {
  const router = useRouter();
  const setLogin = useAuthStore((state) => state.login);
  const { isPending, isError, error } = useAuthMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const { user, accessToken } = await login(data);
      alert('로그인 완료');
      router.push('/');
    } catch (err) {
      alert('로그인 실패: ' + (err as Error).message);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center w-full'>
      <form className='flex flex-col items-center justify-center w-full'>
        <div className='flex items-center justify-center w-full'>Login</div>
      </form>
    </div>
  );
}
