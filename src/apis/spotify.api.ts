import { spotifyRequest } from '@/lib/spotifyRequest';

// 재생
export const play = async (deviceId: string, accessToken: string) => {
  return await spotifyRequest('me/player/play', 'PUT', accessToken, {
    query: { device_id: deviceId },
  });
};
// 일시정지
export const pause = async (accessToken: string) => {
  return await spotifyRequest('me/player/pause', 'PUT', accessToken);
};

// 다음 트랙
export const nextTrack = async (accessToken: string) => {
  return await spotifyRequest('me/player/next', 'POST', accessToken);
};

// 이전 트랙
export const prevTrack = async (accessToken: string) => {
  return await spotifyRequest('me/player/previous', 'POST', accessToken);
};

// 현재 재생중인 트랙
export async function getCurrentTrack(accessToken: string) {
  const response = await spotifyRequest(
    'me/player/currently-playing',
    'GET',
    accessToken
  );
  const data = await response.json();

  return {
    item: data.item,
    timestamp: data.timestamp,
    progress_ms: data.progress_ms,
    currently_playing_type: data.currently_playing_type,
  };
}

export const seekTrack = async (positionMs: number, accessToken: string) => {
  return await spotifyRequest('me/player/seek', 'PUT', accessToken, {
    query: { position_ms: positionMs.toString() },
  });
};

export const setSpotifyVolume = async (volume: number, accessToken: string) => {
  return await spotifyRequest('me/player/volume', 'PUT', accessToken, {
    query: { volume_percent: volume.toString() },
  });
};

export const playPlaylist = async (
  deviceId: string,
  accessToken: string,
  playlistId: string
) => {
  await spotifyRequest('me/player/play', 'PUT', accessToken, {
    query: { device_id: deviceId },
    body: { context_uri: `spotify:playlist:${playlistId}` },
  });
  return { playlistId };
};

export const transferPlayback = async (
  deviceId: string,
  accessToken: string,
  play: boolean = false
) => {
  return await spotifyRequest('me/player', 'PUT', accessToken, {
    body: { device_ids: [deviceId], play },
  });
};
