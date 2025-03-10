'use client';

import { usePathname } from 'next/navigation';
import DesktopTopNav from './DesktopTopNav';

export default function NavWrapper() {
  const pathname = usePathname();
  const isHome = pathname === '/'; // Home 페이지 여부 확인

  return (
    <div
      className={`w-full z-50 backdrop-blur-md ${
        isHome ? 'absolute top-0 left-0' : 'sticky top-0'
      }`}
    >
      <DesktopTopNav />
    </div>
  );
}
