import useAuthStore from '@/store/authStore';
import Link from 'next/link';

interface MenuProps {
  closeMenu: () => void;
}

const Menu = ({ closeMenu }: MenuProps) => {
  const { isLoggedIn, logout, hasHydrated } = useAuthStore();
  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
  };
  return (
    <div className='flex flex-col top-0 left-0 w-full h-screen bg-white p-[10px] z-50 overflow-hidden gap-[40px]'>
      <ul className='flex flex-col mt-[20px] text-xl font-semibold gap-[20px]'>
        <li>
          <Link
            href='/Playlist'
            className='block text-black'
            onClick={closeMenu}
          >
            Playlist
          </Link>
        </li>
        <li>
          <Link
            href='/Magazine'
            className='block text-black'
            onClick={closeMenu}
          >
            Magazine
          </Link>
        </li>
        <li>
          <Link
            href='/Comment'
            className='block text-black'
            onClick={closeMenu}
          >
            Comment
          </Link>
        </li>
      </ul>
      <div className='flex text-xl font-semibold gap-[20px]'>
        {isLoggedIn ? (
          <div className='flex flex-col items-start gap-[10px]'>
            <button onClick={handleLogout}>Logout</button>
            <Link href='/mypage'>My Page</Link>
          </div>
        ) : (
          <Link href='/auth/login'>Login</Link>
        )}
      </div>
    </div>
  );
};

export default Menu;
