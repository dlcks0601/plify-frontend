export interface Playlist {
  userId: number;
  userName: string;
  userNickname: string;
  userProfileUrl: string;
  postId: number;
  playlistId: string;
  likeCount: number;
  viewCount: number;
  createdAt: string;
  name: string;
  images?: { url: string; height: number; width: number }[];
  tracks?: {
    href: string;
    total: number;
    items: {
      added_at: string;
      track: {
        id: string;
        name: string;
        duration_ms: number;
        popularity: number;
        preview_url: string | null;
        uri: string;
        external_urls: { spotify: string };
        artists: {
          id: string;
          name: string;
          external_urls: { spotify: string };
        }[];
        album: {
          id: string;
          name: string;
          images: { url: string; height: number; width: number }[];
          release_date: string;
          external_urls: { spotify: string };
        };
      };
    }[];
  };
}

export interface LikedResponse {
  message: {
    code: number;
    text: string;
  };
  isLiked: boolean;
}
