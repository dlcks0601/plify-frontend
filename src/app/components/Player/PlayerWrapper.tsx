'use client';

import useAuthStore from '@/store/authStore';
import PlayerControls from './PlayerControls';

export default function PlayerWrapper() {
  const { accessToken } = useAuthStore();

  if (!accessToken) return null;
  return <PlayerControls />;
}
