export interface SpotifyArtist {
  name: string;
}

export interface SpotifyAlbum {
  images: { url: string }[];
}

export interface SpotifyTrack {
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
}

export interface SpotifyCurrentlyPlayingResponse {
  item: SpotifyTrack;
}
