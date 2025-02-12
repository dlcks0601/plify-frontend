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
      router.push('/');
    });
  };

  // Spotify 로그인 버튼 클릭 시 백엔드의 OAuth2 로그인 URL로 이동
  const handleSpotifyLogin = () => {
    console.log('스포티파이 로그인 시도');
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/spotify/`;
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

      {/* Spotify 로그인 버튼 추가 */}
      <button
        type='button'
        onClick={handleSpotifyLogin}
        className='w-full mt-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white flex items-center justify-center'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-5 h-5 mr-2'
          viewBox='0 0 24 24'
          fill='currentColor'
        >
          <path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.633 17.27c-.248 0-.497-.07-.715-.215-1.963-1.21-4.447-1.485-7.382-.814-.597.135-1.177-.23-1.313-.82-.135-.597.23-1.177.82-1.313 3.382-.75 6.354-.422 8.733.986.546.338.714 1.067.377 1.614-.222.358-.603.552-.99.552zm1.028-3.435c-.306 0-.61-.094-.868-.285-2.26-1.664-5.66-2.13-9.295-1.168-.666.177-1.353-.213-1.525-.88-.177-.667.213-1.353.88-1.525 4.17-1.107 8.053-.547 10.688 1.394.55.407.67 1.184.263 1.735-.246.332-.624.51-1.043.51zm.19-3.722c-.37 0-.733-.116-1.04-.35-2.688-2.043-7.172-2.243-10.058-1.237-.757.248-1.56-.164-1.807-.92-.248-.758.164-1.56.92-1.807 3.423-1.122 8.586-.85 11.893 1.562.645.49.775 1.41.285 2.056-.287.376-.719.596-1.193.596z' />
        </svg>
        Spotify로 로그인
      </button>
    </form>
  );
}
