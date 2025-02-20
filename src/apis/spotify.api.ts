export const play = async (deviceId: string, accessToken: string) => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  if (!response.ok) {
    throw new Error('Failed to play track');
  }
  return response;
};

export const pause = async (accessToken: string) => {
  const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to pause track');
  }
  return response;
};

export const nextTrack = async (accessToken: string) => {
  const response = await fetch('https://api.spotify.com/v1/me/player/next', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to skip to next track');
  }
  return response;
};

export const prevTrack = async (accessToken: string) => {
  const response = await fetch(
    'https://api.spotify.com/v1/me/player/previous',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error('Failed to skip to previous track');
  }
  return response;
};

export async function getCurrentTrack(accessToken: string) {
  const response = await fetch(
    'https://api.spotify.com/v1/me/player/currently-playing',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch current track: ${response.status}`);
  }

  const data = await response.json();
  return data.item;
}

export const seekTrack = async (positionMs: number, accessToken: string) => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/player/seek?position_ms=${positionMs}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to seek track');
  }
};

export const setSpotifyVolume = async (volume: number, accessToken: string) => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  if (!response.ok) {
    throw new Error('Failed to set volume');
  }
};

export const playPlaylist = async (
  deviceId: string,
  accessToken: string,
  playlistId: string
) => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context_uri: `spotify:playlist:${playlistId}`,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to play playlist');
  }

  return response;
};
