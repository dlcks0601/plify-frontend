import { useAuthMutation } from '@/hooks/queries/auth.query';
import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate, isPending, isError, error } = useAuthMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-sm mx-auto p-4 border rounded shadow bg-white'
    >
      <h2 className='text-2xl font-bold mb-4 text-center'>로그인</h2>

      <input
        type='email'
        placeholder='이메일'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
        required
      />

      <input
        type='password'
        placeholder='비밀번호'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className='w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
        required
      />

      <button
        type='submit'
        disabled={isPending}
        className={`w-full py-2 rounded ${
          isPending
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {isPending ? '로그인 중...' : '로그인'}
      </button>

      {isError && (
        <p className='text-red-500 text-center mt-3'>
          로그인 실패: {(error as Error).message}
        </p>
      )}
    </form>
  );
}
