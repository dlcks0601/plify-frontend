import { PlayerAction, PlayerState } from '@/types/player.type';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';

export const usePlayerStore = create(
  combine<PlayerState, PlayerAction>(
    {
      isPlaying: false,
      progress: 0,
    },
    (set) => ({
      setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
      setProgress: (progress: number) => set({ progress }),
    })
  )
);

interface DeviceState {
  deviceId: string | null;
  setDeviceId: (deviceId: string | null) => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  deviceId: null,
  setDeviceId: (deviceId: string | null) => set({ deviceId }),
}));
