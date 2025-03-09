import {
  addComment,
  addCommentResponse,
  addPlaylist,
  deleteComment,
  deletePlaylist,
  fetchAllPlaylistDetails,
  fetchLikedStatus,
  getComments,
  toggleCommentLike,
  toggledLiked,
  updateComment,
} from '@/apis/playlist.api';
import { queryClient } from '@/lib/queryClient';
import useAuthStore from '@/store/authStore';
import { Playlist } from '@/types/playlist.type';
import { useMutation, useQuery } from '@tanstack/react-query';

export const usePlaylistDetails = () => {
  const { accessToken } = useAuthStore();
  return useQuery<Playlist[], Error>({
    queryKey: ['playlistDetails'],
    queryFn: () => fetchAllPlaylistDetails(accessToken),
  });
};

export const useTogledPlaylistLike = () => {
  return useMutation({
    mutationFn: async ({ postId }: { postId: number }) => {
      return toggledLiked(postId);
    },
    onError: (error) => {
      console.error('좋아요 오류', error);
    },
  });
};

export const useFetchLikedStatus = (postId: number, enabled: boolean) => {
  return useQuery({
    queryKey: ['likedStatus', postId],
    queryFn: () => fetchLikedStatus(postId),
    enabled,
  });
};

export const useAddPlaylist = () => {
  const { userInfo } = useAuthStore();
  const userId = userInfo?.userId;

  return useMutation({
    mutationFn: async ({ playlistUrl }: { playlistUrl: string }) => {
      return addPlaylist(userId, playlistUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlistDetails'] });
    },
    onError: (error) => {
      console.error('플레이리스트 추가 오류:', error);
    },
  });
};

export const useDeletePlaylist = () => {
  const { userInfo } = useAuthStore();
  const userId = userInfo?.userId;

  return useMutation({
    mutationFn: async ({ postId }: { postId: number }) => {
      return deletePlaylist(userId, postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlistDetails'] });
    },
    onError: (error) => {
      console.error('플레이리스트 삭제 오류 :', error);
    },
  });
};

export const useAddComment = () => {
  const { userInfo } = useAuthStore();
  const userId = userInfo?.userId;

  return useMutation({
    mutationFn: async ({
      postId,
      content,
    }: {
      postId: number;
      content: string;
    }) => {
      return addComment(userId, postId, content);
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId, userId] });
      queryClient.refetchQueries({ queryKey: ['comments', postId, userId] });
    },
    onError: (error) => {
      console.error('댓글 추가 오류:', error);
    },
  });
};

export const useGetComments = (postId: number) => {
  const { userInfo } = useAuthStore();
  const userId = userInfo?.userId;

  return useQuery({
    queryKey: ['comments', postId, userId],
    queryFn: () => getComments(postId, userId),
  });
};

export const useUpdateComment = () => {
  const { userInfo } = useAuthStore();
  const userId = userInfo?.userId;

  return useMutation({
    mutationFn: async ({
      postId,
      commentId,
      content,
    }: {
      postId: number;
      commentId: number;
      content: string;
    }) => {
      return updateComment(userId, postId, commentId, content);
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId, userId] });
      queryClient.refetchQueries({ queryKey: ['comments', postId, userId] });
    },
    onError: (error) => {
      console.error('댓글 수정 오류:', error);
    },
  });
};

export const useDeleteComment = () => {
  const { userInfo } = useAuthStore();
  const userId = userInfo?.userId;

  return useMutation({
    mutationFn: async ({
      postId,
      commentId,
    }: {
      postId: number;
      commentId: number;
    }) => {
      return deleteComment(userId, postId, commentId);
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId, userId] });
      queryClient.refetchQueries({ queryKey: ['comments', postId, userId] });
    },
    onError: (error) => {
      console.error('댓글 삭제 오류:', error);
    },
  });
};

export const useToggleCommentLike = () => {
  const { userInfo } = useAuthStore();
  const userId = userInfo?.userId;

  return useMutation({
    mutationFn: async ({
      postId,
      commentId,
    }: {
      postId: number;
      commentId: number;
    }) => {
      return toggleCommentLike(userId, postId, commentId);
    },
    onSuccess: (_, { commentId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.refetchQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['comment', commentId] });
    },
    onError: (error) => {
      console.error('댓글 좋아요 오류:', error);
    },
  });
};
