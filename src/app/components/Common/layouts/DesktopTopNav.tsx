'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import Link from 'next/link';
import ThemeToggle from '../Theme';
import LoginModal from '../../Modals/LoginModal';

const DesktopTopNav = () => {
  const { isLoggedIn, logout } = useAuthStore();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
  };

  return (
    <>
      <nav className='flex items-center justify-between px-[16px] py-[10px]'>
        {/* 로고 */}
        <Link href='/' className='text-3xl font-extrabold blur-[1.5px]'>
          PLIFY
        </Link>

        <ul className='flex gap-10 text-l font-regular '>
          {['Home', 'Playlist'].map((item) => {
            const href =
              item === 'Home'
                ? '/'
                : `/${item.toLowerCase().replace(/ /g, '-')}`;
            const isActive = pathname === href;

            return (
              <li key={item}>
                <Link
                  href={href}
                  className={isActive ? 'text-white' : 'hover:blur-[1px] '}
                >
                  {item}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* 로그인 버튼 (모달로 변경) */}
        <div className='flex items-center gap-5 text-l font-regular'>
          {isLoggedIn ? (
            <div className='flex gap-5'>
              <ThemeToggle />
              <Link
                href='/mypage'
                className={pathname === '/mypage' ? '' : 'hover:blur-[1px]'}
              >
                My Page
              </Link>
              <button onClick={handleLogout} className='hover:blur-[1px]'>
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
