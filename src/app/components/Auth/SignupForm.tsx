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
    <form
      onSubmit={handleSubmit}
      className='flex flex-col items-center gap-[40px] w-[384px]'
    >
      <div className='flex text-7xl font-extrabold blur-[2px]'>PLIFY</div>
      <div className='flex flex-col gap-[30px] w-full'>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='flex flex-col border rounded-2xl focus:outline-none focus:ring-1 focus:ring-black p-[10px]'
          required
        />

        <input
          type='text'
          placeholder='Nickname'
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className='flex flex-col border rounded-2xl focus:outline-none focus:ring-1 focus:ring-black p-[10px]'
          required
        />

        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='flex flex-col border rounded-2xl focus:outline-none focus:ring-1 focus:ring-black p-[10px]'
          required
        />
      </div>
      <div className='flex flex-col w-full gap-[20px]'>
        <button
          type='submit'
          className='flex w-full rounded-2xl bg-[#EFEFEF] p-[10px] justify-center text-[#555555]'
        >
          Signup
        </button>
      </div>
    </form>
  );
}
