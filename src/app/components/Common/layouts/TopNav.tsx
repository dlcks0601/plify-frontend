'use client';

import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';

const TopNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const router = useRouter();
  const { isLoggedIn, logout } = useAuthStore();

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const handleNavigation = (path: string) => {
    router.push(path); // 페이지 이동 먼저 실행
    setTimeout(() => setIsMenuOpen(false), 40); // 메뉴 닫기를 약간 늦춰서 실행
  };

  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
  };

  return (
    <>
      {/* 네비게이션 바 */}
      <div className='flex w-full justify-between bg-white p-[10px]'>
        <button
          onClick={() => handleNavigation('/')}
          className='text-black font-bold text-xl'
        >
          plify
        </button>
        <button onClick={toggleMenu} className='focus:outline-none'>
          {isMenuOpen ? (
            <XMarkIcon className='w-6 h-6 text-black' />
          ) : (
            <Bars3Icon className='w-6 h-6 text-black' />
          )}
        </button>
      </div>

      {/* 메뉴 */}
      {isMenuOpen && (
        <div className='fixed inset-0 bg-white flex flex-col p-[10px]'>
          <div className='flex w-full justify-between bg-white'>
            <button
              onClick={() => handleNavigation('/')}
              className='text-black font-bold text-xl'
            >
              plify
            </button>
            <button onClick={toggleMenu} className='focus:outline-none'>
              {isMenuOpen ? (
                <XMarkIcon className='w-6 h-6 text-black' />
              ) : (
                <Bars3Icon className='w-6 h-6 text-black' />
              )}
            </button>
          </div>
          <ul className='flex flex-col gap-[20px] text-xl font-semibold mt-6'>
            <li>
              <button
                onClick={() => handleNavigation('/Playlist')}
                className='text-black text-left'
              >
                Playlist
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/Magazine')}
                className='text-black text-left'
              >
                Magazine
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/Comment')}
                className='text-black text-left'
              >
                Comment
              </button>
            </li>
          </ul>
          <div className='flex flex-col mt-12 text-xl font-semibold'>
            {isLoggedIn ? (
              <div className='flex flex-col'>
                <button onClick={handleLogout}>Logout</button>
                <button
                  onClick={() => handleNavigation('/mypage')}
                  className='text-black text-left'
                >
                  My Page
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavigation('/auth/login')}
                className='text-black text-left'
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TopNav;
