'use client';

import useAuthStore from '@/store/authStore';
import { useDeviceStore } from '@/store/playerStore';
import { useEffect, useState } from 'react';

export const useSpotifyPlayer = () => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const { deviceId, setDeviceId } = useDeviceStore();
  const { accessToken } = useAuthStore(); // 액세스 토큰 상태 가져오기

  // Transfer Playback API 호출 함수
  const transferPlayback = (deviceId: string) => {
    fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        device_ids: [deviceId],
        play: false, // 바로 재생하지 않으려면 false, 재생을 원하면 true로 설정
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('웹 플레이어로 Playback 전환 성공!');
        } else {
          console.error('Playback 전환 실패:', response.statusText);
        }
      })
      .catch((err) => {
        console.error('Playback 전환 중 오류 발생:', err);
      });
  };

  useEffect(() => {
    if (!accessToken) return;

    // SDK가 이미 로드되었는지 확인
    if (!window.Spotify) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Plify Web Player',
        getOAuthToken: (cb) => cb(accessToken),
        volume: 0.5,
      });

      player.addListener('ready', ({ device_id }) => {
        console.log('Spotify Player Ready with Device ID', device_id);
        setDeviceId(device_id);
        transferPlayback(device_id);
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
          console.log('✅ Spotify Web Player connected!');
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
