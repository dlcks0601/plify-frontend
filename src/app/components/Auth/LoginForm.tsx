'use client';

import { useAuthMutation } from '@/hooks/queries/auth.query';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import { login } from '@/apis/auth.api';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isPending, isError, error } = useAuthMutation();
  const setLogin = useAuthStore((state) => state.login);

  // 자체 로그인 버튼
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password }).then(({ user, accessToken }) => {
      setLogin(user, accessToken);
      alert('로그인 완료');
      console.log('일반 로그인 완료');
      router.push('/');
    });
  };
  const handleSignup = () => {
    router.push('/auth/email');
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
          placeholder='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='flex flex-col border rounded-2xl focus:outline-none focus:ring-1 focus:ring-black p-[10px] dark:bg-black dark:placeholder-white'
          required
        />

        <input
          type='password'
          placeholder='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='flex flex-col border rounded-2xl focus:outline-none focus:ring-1 focus:ring-black p-[10px] dark:bg-black dark:placeholder-white'
          required
        />
      </div>
      <div className='flex flex-col w-full gap-[20px]'>
        <button
          type='submit'
          className='flex w-full rounded-2xl bg-[#EFEFEF] p-[10px] justify-center text-[#555555] dark:text-white dark:bg-black dark:border'
        >
          Login
        </button>
        <div onClick={handleSignup} className='flex justify-end cursor-pointer'>
          Signup
        </div>
      </div>
    </form>
  );
}
