import {
  SPOTIFY_MY_PLAYLISTS,
  SPOTIFY_TOP_ARTIST_ENDPOINT,
  SPOTIFY_TOP_TRACKS_ENDPOINT,
} from './spotify-path';

export interface Track {
  rank: number;
  image: string;
  title: string;
  artist: string;
}

export const fetchTopTracks = async (accessToken: string): Promise<Track[]> => {
  const response = await fetch(SPOTIFY_TOP_TRACKS_ENDPOINT, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify API 요청 실패 (Status: ${response.status})`);
  }

  const data = await response.json();

  // data.items를 Track[]로 매핑
  const tracks: Track[] = data.items.map((track: any, index: number) => ({
    rank: index + 1,
    image: track.album.images[0]?.url || '/default-image.jpg',
    title: track.name,
    artist: track.artists.map((artist: any) => artist.name).join(', '),
  }));
  return tracks;
};

export interface Artist {
  rank: number;
  image: string;
  artist: string;
}

export const fetchTopArtist = async (
  accessToken: string
): Promise<Artist[]> => {
  const response = await fetch(SPOTIFY_TOP_ARTIST_ENDPOINT, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify API 요청 실패 (Status: ${response.status})`);
  }

  const data = await response.json();

  const topArtists: Artist[] = data.items.map((artist: any, index: number) => ({
    rank: index + 1,
    image: artist.images?.[0]?.url || '/default-image.jpg', // 아티스트 이미지
    artist: artist.name, // 아티스트 이름
  }));

  return topArtists;
};

export interface Playlist {
  number: number;
  id: string; // 플레이리스트 ID
  name: string; // 플레이리스트 이름
  image: string; // 플레이리스트 썸네일 이미지
}

export const fetchMyPlaylists = async (accessToken: string) => {
  const response = await fetch(SPOTIFY_MY_PLAYLISTS, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify API 요청 실패 (Status: ${response.status})`);
  }

  const data = await response.json();

  const myPlaylists: Playlist[] = data.items.map(
    (playlist: any, index: number) => ({
      number: index + 1,
      id: playlist.id,
      name: playlist.name,
      image: playlist.images?.[0]?.url || '/default-image.jpg',
      trackCount: playlist.tracks.total,
    })
  );

  return myPlaylists;
};
