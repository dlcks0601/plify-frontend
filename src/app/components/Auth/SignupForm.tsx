'use client';

import { useState } from 'react';
import { signup } from '@/apis/auth.api';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signup({ email, password, nickname });
      alert('회원가입이 완료되었습니다!');
      router.push('/signin/email');
    } catch (error) {
      console.error('회원가입 실패:', error);
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-md p-6 bg-white rounded shadow-md'
      >
        <h2 className='text-2xl font-bold mb-4 text-center'>회원가입</h2>

        <input
          type='email'
          placeholder='이메일'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full p-3 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
          required
        />

        <input
          type='text'
          placeholder='닉네임'
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className='w-full p-3 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
          required
        />

        <input
          type='password'
          placeholder='비밀번호'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
          required
        />

        {error && (
          <p className='text-red-500 text-sm mb-3 text-center'>{error}</p>
        )}

        <button
          type='submit'
          className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200'
        >
          회원가입
        </button>
      </form>
    </div>
  );
}
