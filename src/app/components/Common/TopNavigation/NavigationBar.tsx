import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

interface NavigationBarProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

const NavigationBar = ({ toggleMenu, isMenuOpen }: NavigationBarProps) => (
  <div className='flex w-full justify-between bg-white p-[10px]'>
    <Link href='/' className='text-black font-bold text-xl'>
      plify
    </Link>
    <button onClick={toggleMenu} className='focus:outline-none'>
      {isMenuOpen ? (
        <XMarkIcon className='w-6 h-6 text-black' />
      ) : (
        <Bars3Icon className='w-6 h-6 text-black' />
      )}
    </button>
  </div>
);

export default NavigationBar;
