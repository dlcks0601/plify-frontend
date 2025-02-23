'use client';

import { transferPlayback } from '@/apis/spotify.api';
import useAuthStore from '@/store/authStore';
import { useDeviceStore } from '@/store/playerStore';
import { useEffect, useState } from 'react';

export const useSpotifyPlayer = () => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const { deviceId, setDeviceId } = useDeviceStore();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;

    // 플레이어 생성 되었는지 확인
    if (!window.Spotify) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
    }

    // 플레이어 생성
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Plify',
        getOAuthToken: (cb) => cb(accessToken),
        volume: 0.5,
      });

      player.addListener('ready', ({ device_id }) => {
        console.log('Spotify Player Ready with Device ID', device_id);
        setDeviceId(device_id); //디바이스 id 전역상태관리
        transferPlayback(device_id, accessToken); // 디바이스 변경
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device has gone offline', device_id);
      });

      player.addListener('initialization_error', ({ message }) => {
        console.error('Failed to initialize', message);
      });

      player.addListener('authentication_error', ({ message }) => {
        console.error('Auth error', message);
      });

      player.addListener('account_error', ({ message }) => {
        console.error('Account error', message);
      });

      player.connect().then((success) => {
        if (success) {
          console.log('🎵 Plify connected!!');
        }
      });

      setPlayer(player);
    };
  }, [accessToken]);

  return { player, deviceId };
};

export const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
