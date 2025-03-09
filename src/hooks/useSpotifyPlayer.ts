'use client';

import { transferPlayback } from '@/apis/spotify.api';
import useAuthStore from '@/store/authStore';
import { useDeviceStore } from '@/store/playerStore';
import { userInfo } from 'os';
import { useEffect, useState } from 'react';

export const useSpotifyPlayer = () => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const { deviceId, setDeviceId } = useDeviceStore();
  const { accessToken, userInfo } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;

    if (!window.Spotify) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Plify',
        getOAuthToken: (cb) => cb(accessToken),
        volume: 0.5,
      });

      player.addListener('ready', ({ device_id }) => {
        console.log('💻 spotify device Id: ', device_id);
        setDeviceId(device_id);
        transferPlayback(device_id, accessToken);
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
          console.log(`🎵 Hello ${userInfo.name}`);
        }
      });

      setPlayer(player);
    };
  }, [accessToken]);

  return { player, deviceId };
};
