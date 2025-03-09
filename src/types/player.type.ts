export interface PlayerState {
  isPlaying: boolean;
  progress: number;
}

export interface PlayerAction {
  setIsPlaying: (isPlaying: boolean) => void;
  setProgress: (progress: number) => void;
}
