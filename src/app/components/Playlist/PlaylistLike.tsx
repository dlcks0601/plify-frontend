'use client';

import { useEffect, useState } from 'react';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import {
  useFetchLikedStatus,
  usePlaylistDetails,
  useTogledPlaylistLike,
} from '@/hooks/queries/playlist.query';
import useAuthStore from '@/store/authStore';

interface PlaylistLikeProps {
  postId: number;
  likeCount: number;
  isLiked?: boolean;
}

export default function PlaylistLike({
  postId,
  likeCount: initialLikeCount,
  isLiked: initialIsLiked = false,
}: PlaylistLikeProps) {
  const { isLoggedIn } = useAuthStore();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  // 좋아요 상태 가져오기 (isLiked만 가져옴)
  const { data: fetchedLikeStatus, refetch: refetchLikedStatus } =
    useFetchLikedStatus(postId, isLoggedIn);

  // 전체 플레이리스트 정보 가져오기 (likeCount가 포함됨)
  const { data: playlistDetails, refetch: refetchPlaylistDetails } =
    usePlaylistDetails();

  // 서버에서 가져온 좋아요 상태 반영 (undefined 방지)
  useEffect(() => {
    if (fetchedLikeStatus?.isLiked !== undefined) {
      setIsLiked(fetchedLikeStatus.isLiked);
    }
  }, [fetchedLikeStatus]);

  // 최신 likeCount 반영
  useEffect(() => {
    const playlist = playlistDetails?.find((p) => p.postId === postId);
    if (playlist?.likeCount !== undefined) {
      setLikeCount(playlist.likeCount);
    }
  }, [playlistDetails, postId]);

  const { mutate: toggleLike } = useTogledPlaylistLike();

  const handleLikeClick = (e: React.MouseEvent) => {
    if (isLoading) return;
    setIsLoading(true);

    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;
    const newIsLiked = !previousIsLiked;
    const newLikeCount = newIsLiked
      ? previousLikeCount + 1
      : previousLikeCount - 1;

    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);

    toggleLike(
      { postId },
      {
        onSuccess: () => {
          setIsLoading(false);
          refetchLikedStatus();
          refetchPlaylistDetails();
        },
        onError: (error) => {
          console.error('좋아요 토글 오류:', error);
          setIsLiked(previousIsLiked);
          setLikeCount(previousLikeCount);
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className='flex items-center gap-[10px]'>
      <button
        className='cursor-pointer'
        onClick={handleLikeClick}
        disabled={isLoading}
      >
        {isLiked ? (
          <IoMdHeart size={28} color='red' />
        ) : (
          <IoMdHeartEmpty size={28} />
        )}
      </button>
      <span className='text-[16px]'>{likeCount}</span>
    </div>
  );
}
