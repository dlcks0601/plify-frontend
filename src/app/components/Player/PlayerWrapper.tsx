'use client';

import useAuthStore from '@/store/authStore';
import PlayerControls from './PlayerControls';

export default function PlayerWrapper() {
  const { accessToken } = useAuthStore();

  // accessToken이 있으면 로그인된 상태라고 가정
  if (!accessToken) return null;
  return <PlayerControls />;
}
