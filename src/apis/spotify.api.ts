import { spotifyRequest } from '@/lib/spotifyRequest';

// 재생 함수 (특정 디바이스 지정)
export const play = async (deviceId: string, accessToken: string) => {
  return await spotifyRequest('me/player/play', 'PUT', accessToken, {
    query: { device_id: deviceId },
  });
};
// 일시정지 함수
export const pause = async (accessToken: string) => {
  return await spotifyRequest('me/player/pause', 'PUT', accessToken);
};

// 다음 트랙으로 넘기기
export const nextTrack = async (accessToken: string) => {
  return await spotifyRequest('me/player/next', 'POST', accessToken);
};

// 이전 트랙으로 넘기기
export const prevTrack = async (accessToken: string) => {
  return await spotifyRequest('me/player/previous', 'POST', accessToken);
};

// 현재 재생중인 트랙 가져오기
export async function getCurrentTrack(accessToken: string) {
  const response = await spotifyRequest(
    'me/player/currently-playing',
    'GET',
    accessToken
  );
  const data = await response.json();

  // 필요한 데이터만 추출해서 반환합니다.
  return {
    item: data.item,
    timestamp: data.timestamp,
    progress_ms: data.progress_ms,
    currently_playing_type: data.currently_playing_type,
  };
}

// 특정 위치로 탐색 (Seek)
export const seekTrack = async (positionMs: number, accessToken: string) => {
  return await spotifyRequest('me/player/seek', 'PUT', accessToken, {
    query: { position_ms: positionMs.toString() },
  });
};

// 볼륨 조절 함수
export const setSpotifyVolume = async (volume: number, accessToken: string) => {
  return await spotifyRequest('me/player/volume', 'PUT', accessToken, {
    query: { volume_percent: volume.toString() },
  });
};

// 플레이리스트 재생 함수
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

// 디바이스 변경
export const transferPlayback = async (
  deviceId: string,
  accessToken: string,
  play: boolean = false
) => {
  return await spotifyRequest('me/player', 'PUT', accessToken, {
    body: { device_ids: [deviceId], play },
  });
};
