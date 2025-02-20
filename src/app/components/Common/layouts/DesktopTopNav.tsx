'use client';

import { useState } from 'react';
import useAuthStore from '@/store/authStore';
import Link from 'next/link';
import ThemeToggle from '../Theme';
import LoginModal from '../../Modals/LoginModal';

const DesktopTopNav = () => {
  const { isLoggedIn, logout } = useAuthStore();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
  };

  return (
    <>
      <nav className='flex items-center justify-between p-4'>
        {/* 로고 */}
        <Link href='/' className='text-3xl font-extrabold blur-[1.5px]'>
          PLIFY
        </Link>

        {/* 내비게이션 메뉴 */}
        <ul className='flex gap-10 text-xl font-regular '>
          {['Home', 'Playlist', 'Magazine', 'Reviews'].map((item) => (
            <li key={item}>
              <Link
                href={
                  item === 'Home'
                    ? '/'
                    : `/${item.toLowerCase().replace(/ /g, '-')}`
                }
                className='hover:text-[#ffffff]'
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        {/* 로그인 버튼 (모달로 변경) */}
        <div className='flex items-center gap-5 text-xl font-regular'>
          {isLoggedIn ? (
            <div className='flex gap-5'>
              <ThemeToggle />
              <Link href='/mypage' className='hover:text-gray-600'>
                My Page
              </Link>
              <button onClick={handleLogout} className='hover:text-gray-600'>
                Logout
              </button>
            </div>
          ) : (
            <div className='flex gap-5'>
              <ThemeToggle />
              <button
                className='hover:text-gray-600'
                onClick={() => setLoginModalOpen(true)}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
};

export default DesktopTopNav;
