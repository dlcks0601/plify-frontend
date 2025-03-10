'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSpotifyLogin = () => {
    console.log('스포티파이 로그인 시도');
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/spotify/`;
  };

  const handleEmailLogin = () => {
    onClose();
    router.push('/auth/login');
  };

  return createPortal(
    <div
      className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]'
      onClick={onClose}
    >
      <div
        className='bg-white dark:bg-white flex flex-col px-[64px] py-[60px] gap-[40px] rounded-3xl w-[500px] h-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex flex-col gap-[20px]'>
          <div className='flex items-center justify-center text-4xl font-extrabold blur-[1px] text-black'>
            PLIFY
          </div>
          <div className='flex items-center justify-center text-[#9F9F9F] text-[14px]'>
            PLIFY는 Spotify를 사용하는 사람들을 위한 공간이에요.
          </div>
        </div>

        {/* 버튼들 */}
        <div className='flex flex-col items-start gap-[18px] font-light text-[12px] px-[30px]'>
          <div className='flex px-[14px] py-[6px] rounded-3xl bg-green-200 text-green-800 w-auto'>
            가장 많이 들은 곡을 알고싶어요.
          </div>
          <div className='flex px-[14px] py-[6px] rounded-3xl bg-yellow-100 text-yellow-600 w-auto'>
            가장 많이 들은 가수를 알고싶어요.
          </div>
          <div className='flex px-[14px] py-[6px] rounded-3xl bg-blue-200 text-blue-800'>
            플레이리스트를 공유하고 싶어요.
          </div>
          {/* <div className='flex px-[14px] py-[6px] rounded-3xl bg-red-200 text-red-800'>
            음악 매거진을 보고싶어요.
          </div>
          <div className='flex px-[14px] py-[6px] rounded-3xl bg-gray-300 text-gray-800'>
            음악 리뷰를 남기고싶어요.
          </div> */}
        </div>
        <div className='flex flex-col justify-center w-full gap-[20px] font-light text-[14px] px-[30px]'>
          <button
            onClick={handleSpotifyLogin}
            className='flex bg-black text-white rounded-2xl items-center justify-center py-[6px] px-[60px]'
          >
            <Image
              src='/icons/spotify.svg'
              alt='Spotify'
              width={24}
              height={24}
              className='mr-2'
            />
            Spotify 계정으로 로그인
          </button>
          {/* 
          <button
            onClick={handleEmailLogin}
            className='flex bg-[#EFEFEF] text-black rounded-2xl items-center justify-center py-[6px] px-[100px]'
          >
            <Image
              src='/icons/mail.svg'
              alt='mail'
              width={24}
              height={24}
              className='mr-2'
            />
            이메일 계정으로 로그인
          </button> */}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;
