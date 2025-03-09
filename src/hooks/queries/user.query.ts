import {
  Artist,
  fetchMyPlaylists,
  fetchTopArtist,
  fetchTopTracks,
  myPlaylist,
  Track,
} from '@/apis/user.api';
import useAuthStore from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';

export const useTopTracks = () => {
  const { accessToken, isLoggedIn } = useAuthStore();

  return useQuery<Track[], Error>({
    queryKey: ['topTracks', accessToken],
    queryFn: () => fetchTopTracks(accessToken),
    enabled: isLoggedIn && !!accessToken,
  });
};

export const useTopArtist = () => {
  const { accessToken, isLoggedIn } = useAuthStore();

  return useQuery<Artist[], Error>({
    queryKey: ['topArtist', accessToken],
    queryFn: () => fetchTopArtist(accessToken),
    enabled: isLoggedIn && !!accessToken,
  });
};

export const useMyPlaylist = () => {
  const { accessToken, isLoggedIn } = useAuthStore();

  return useQuery<myPlaylist[], Error>({
    queryKey: ['myPlaylists', accessToken],
    queryFn: () => fetchMyPlaylists(accessToken),
    enabled: isLoggedIn && !!accessToken,
  });
};
