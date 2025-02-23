'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  play,
  pause,
  nextTrack,
  prevTrack,
  getCurrentTrack,
  seekTrack,
  setSpotifyVolume,
  playPlaylist,
} from '@/apis/spotify.api';
import { usePlayerStore } from '@/store/playerStore';
import useAuthStore from '@/store/authStore';
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer';

export const usePlayMutation = () => {
  const queryClient = useQueryClient();
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const { accessToken } = useAuthStore();
  const { deviceId } = useSpotifyPlayer();

  return useMutation({
    mutationFn: () => {
      if (!deviceId || !accessToken) {
        throw new Error('Missing deviceId or accessToken');
      }
      return play(deviceId, accessToken);
    },
    onSuccess: () => {
      setIsPlaying(true);
      queryClient.invalidateQueries({ queryKey: ['playerState'] });
    },
  });
};

export const usePauseMutation = () => {
  const queryClient = useQueryClient();
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const { accessToken } = useAuthStore();

  return useMutation({
    mutationFn: () => {
      if (!accessToken) {
        throw new Error('Missing accessToken');
      }
      return pause(accessToken);
    },
    onSuccess: () => {
      setIsPlaying(false);
      queryClient.invalidateQueries({ queryKey: ['playerState'] });
    },
  });
};

export const useNextTrackMutation = () => {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);

  return useMutation({
    mutationFn: () => {
      if (!accessToken) {
        throw new Error('Missing accessToken');
      }
      return nextTrack(accessToken);
    },
    onSuccess: () => {
      setIsPlaying(true);
      queryClient.invalidateQueries({ queryKey: ['playerState'] });
    },
  });
};

export const usePrevTrackMutation = () => {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);

  return useMutation({
    mutationFn: () => {
      if (!accessToken) {
        throw new Error('Missing accessToken');
      }
      return prevTrack(accessToken);
    },
    onSuccess: () => {
      setIsPlaying(true);
      queryClient.invalidateQueries({ queryKey: ['playerState'] });
    },
  });
};

export function useCurrentTrackQuery() {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: ['currentTrack', accessToken],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('No access token');
      }
      return await getCurrentTrack(accessToken);
    },
    refetchInterval: 1000,
    enabled: Boolean(accessToken),
  });
}

export const useSeekMutation = () => {
  const { accessToken } = useAuthStore();
  const { setProgress } = usePlayerStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (positionMs: number) => {
      if (!accessToken) return Promise.reject('No access token');
      return seekTrack(positionMs, accessToken);
    },
    onSuccess: (_, positionMs) => {
      setProgress(positionMs);
      queryClient.invalidateQueries({ queryKey: ['currentTrack'] });
    },
    onError: (error) => {
      console.error('Seek failed:', error);
    },
  });
};

export const useSetVolumeMutation = () => {
  const { accessToken } = useAuthStore();
  return useMutation({
    mutationFn: (volume: number) => {
      if (!accessToken) throw new Error('No access token');
      return setSpotifyVolume(volume, accessToken);
    },
  });
};

export const usePlaylistMutation = () => {
  const { accessToken } = useAuthStore();
  const { deviceId } = useSpotifyPlayer();
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);

  return useMutation({
    mutationFn: async (playlistId: string) => {
      if (!accessToken) throw new Error('No access token available.');
      if (!deviceId) throw new Error('No device ID available.');
      return playPlaylist(deviceId, accessToken, playlistId);
    },
    onSuccess: ({ playlistId }) => {
      setIsPlaying(true);
      console.log(`✅ Playlist ${playlistId} is now playing!`);
    },
    onError: (error) => {
      console.error('❌ Failed to play playlist:', error);
    },
  });
};
