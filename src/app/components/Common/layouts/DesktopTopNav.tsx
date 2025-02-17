'use client';

import useAuthStore from '@/store/authStore';
import Link from 'next/link';

const TopNavigation = () => {
  const { isLoggedIn, logout } = useAuthStore();
  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
  };
  return (
    <nav className='flex items-center justify-between p-[10px] '>
      {/* 로고 */}
      <Link href='/' className='text-xl font-bold'>
        Plify
      </Link>

      {/* 내비게이션 메뉴 */}
      <ul className='flex space-x-6 text-sm font-medium'>
        {['Playlist', 'Magazine'].map((item) => (
          <li key={item}>
            <Link
              href={`/${item.toLowerCase().replace(/ /g, '-')}`}
              className='hover:text-gray-600'
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>

      {/* 로그인 버튼 (라우팅 추가) */}
      <div className='flex items-center space-x-4 text-sm'>
        {isLoggedIn ? (
          <>
            <Link href='/mypage' className='hover:text-gray-600'>
              My Page
            </Link>
            <button onClick={handleLogout} className='hover:text-gray-600'>
              Logout
            </button>
          </>
        ) : (
          <Link href='/auth/login' className='hover:text-gray-600'>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default TopNavigation;
