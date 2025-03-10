'use client';

import { usePathname } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import PlayerWrapper from '../../Player/PlayerWrapper';

export default function PlayerWrapperContainer() {
  const pathname = usePathname();
  const isHome = pathname === '/'; // Home 페이지 여부 확인
  const { accessToken } = useAuthStore();

  if (!accessToken) return null;

  return (
    <div
      className={`w-full z-50 backdrop-blur-md ${
        isHome ? 'absolute bottom-0' : 'sticky bottom-0'
      }`}
    >
      <PlayerWrapper />
    </div>
  );
}
