import { create } from 'zustand';

interface PlayerState {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  progress: number;
  setProgress: (progress: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  progress: 0,
  setProgress: (progress) => set({ progress }),
}));

interface DeviceState {
  deviceId: string | null;
  setDeviceId: (deviceId: string | null) => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  deviceId: null,
  setDeviceId: (deviceId: string | null) => set({ deviceId }),
}));
