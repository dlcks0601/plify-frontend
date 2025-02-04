'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import useAuthStore from '../store/authStore';

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, logout, hasHydrated } = useAuthStore();

  if (!hasHydrated) return null;

  const handleLogin = () => {
    router.push('/signin/email');
  };

  const handleSignup = () => {
    router.push('/signup/email');
  };

  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
  };

  return (
    <main className='flex flex-col items-center justify-center min-h-screen space-y-4'>
      <h1 className='text-3xl font-bold mb-6'>Welcome to the Homepage!</h1>

      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition'
        >
          로그아웃
        </button>
      ) : (
        <>
          <button
            onClick={handleLogin}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition'
          >
            로그인
          </button>
          <button
            onClick={handleSignup}
            className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition'
          >
            회원가입
          </button>
        </>
      )}
    </main>
  );
}
