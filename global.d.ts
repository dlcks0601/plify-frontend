interface Window {
  onSpotifyWebPlaybackSDKReady: () => void;
  Spotify: {
    Player: new (options: {
      name: string;
      getOAuthToken: (cb: (token: string) => void) => void;
      volume?: number;
    }) => Spotify.Player;
  };
}

declare namespace Spotify {
  interface Player {
    connect(): Promise<boolean>;
    addListener(event: string, callback: (data: any) => void): void;
  }
}
