'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { MdOutlinePlayCircleFilled } from 'react-icons/md';
import { IoEllipsisHorizontalCircle } from 'react-icons/io5';

import {
  useAddComment,
  useDeletePlaylist,
  useGetComments,
  usePlaylistDetails,
} from '@/hooks/queries/playlist.query';
import { usePlaylistMutation } from '@/hooks/queries/player.query';

import useAuthStore from '@/store/authStore';
import TrackList from '@/app/components/TrackList/TrackList';
import CommentList from '@/app/components/Comment/CommentList';
import CommentInput from '@/app/components/Comment/CommentIntput';

export default function PlaylistDetailPage() {
  const { userInfo } = useAuthStore();
  const { data: playlistData } = usePlaylistDetails();
  const { postId } = useParams();
  const router = useRouter();
  const { mutate: playPlaylist } = usePlaylistMutation();
  const { mutate: deletePlaylist } = useDeletePlaylist();
  const { data: commentData, refetch } = useGetComments(Number(postId));
  const { mutate: addComment } = useAddComment();

  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [commentText, setCommentText] = useState('');

  const numericPostId = Number(postId);
  const playlist = playlistData?.find((p) => p.postId === numericPostId);
  const isOwner = userInfo?.userId === playlist?.userId;
  const totalTracks = playlist?.tracks?.total || 0;

  const totalDurationMs =
    playlist?.tracks?.items?.reduce(
      (acc, item) => acc + (item.track?.duration_ms || 0),
      0
    ) || 0;

  const totalMinutes = Math.floor(totalDurationMs / 60000);
  const totalSeconds = Math.floor((totalDurationMs % 60000) / 1000);

  const formatDate = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}초 전`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    }

    return `${past.getFullYear()}.${past.getMonth() + 1}.${past.getDate()}`;
  };

  const handleDeletePlaylist = () => {
    if (!window.confirm('정말로 이 플레이리스트를 삭제하시겠습니까?')) return;

    deletePlaylist(
      { postId: numericPostId },
      {
        onSuccess: () => {
          alert('플레이리스트가 삭제되었습니다.');
          router.push('/playlist');
        },
      }
    );
  };

  const handlePlayPlaylist = () => {
    if (playlist?.playlistId) {
      playPlaylist(playlist.playlistId);
    }
  };

  // 댓글 작성 함수
  const handleAddComment = () => {
    if (!commentText.trim()) return;

    addComment(
      { postId: numericPostId, content: commentText },
      {
        onSuccess: () => {
          setCommentText('');
          refetch();
        },
      }
    );
  };

  return (
    <div className='flex flex-col p-4 gap-[20px]'>
      <div className='flex'>
        <div className='flex w-full justify-between items-center'>
          <div className='flex gap-[20px]'>
            <Image
              src={playlist?.images?.[0]?.url || '/placeholder.jpg'}
              alt={playlist?.name || 'Unknown Playlist'}
              width={200}
              height={200}
              className='rounded'
            />
            <div className='flex flex-col justify-between'>
              <div className='text-[100px] font-black'>
                {playlist?.name || '플레이리스트를 찾을 수 없음'}
              </div>
              <div className='flex items-center gap-[10px]'>
                <Image
                  src={playlist?.userProfileUrl || '/placeholder.jpg'}
                  alt={playlist?.userName || 'Unknown Playlist'}
                  width={30}
                  height={30}
                  className='rounded-full'
                />
                <div className='flex gap-[5px] items-center'>
                  <div className='text-[16px] font-bold'>
                    {playlist?.userNickname}
                  </div>
                  <div>•</div>
                  <div className='flex gap-[5px] text-[#cecece]'>
                    <div>{totalTracks}곡,</div>
                    <div>
                      {totalMinutes}분 {totalSeconds}초
                    </div>
                    {isOwner && (
                      <div className='flex gap-[10px]'>
                        <button
                          onClick={() => setShowDeleteButton((prev) => !prev)}
                        >
                          <IoEllipsisHorizontalCircle />
                        </button>
                        {showDeleteButton && (
                          <button
                            onClick={handleDeletePlaylist}
                            className='bg-white text-black px-2 py-1 rounded-full text-[11px]'
                          >
                            삭제하기
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button onClick={handlePlayPlaylist}>
            <MdOutlinePlayCircleFilled size={80} color='#1ED760' />
          </button>
        </div>
      </div>
      {playlist?.tracks?.items && <TrackList tracks={playlist.tracks.items} />}

      <div className='flex flex-col gap-[20px]'>
        <div className='flex font-bold text-[40px]'>Comment</div>

        <CommentInput
          userProfileUrl={userInfo.profileUrl}
          userNickname={userInfo.nickname}
          commentText={commentText}
          setCommentText={setCommentText}
          handleAddComment={handleAddComment}
        />

        {commentData?.comments && (
          <CommentList
            comments={commentData.comments}
            formatDate={formatDate}
            postId={numericPostId}
          />
        )}
      </div>
    </div>
  );
}
