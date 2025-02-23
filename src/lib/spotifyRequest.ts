export const spotifyRequest = async (
  endpoint: string,
  method: 'GET' | 'PUT' | 'POST',
  accessToken: string,
  options?: { body?: any; query?: Record<string, string> }
) => {
  const { body, query } = options || {};
  const queryString = query ? '?' + new URLSearchParams(query) : '';
  const url = `https://api.spotify.com/v1/${endpoint}${queryString}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
  };
  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(
      `Request to ${endpoint} failed with status ${response.status}`
    );
  }
  return response;
};
