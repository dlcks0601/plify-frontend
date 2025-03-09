import { useState } from 'react';
import Image from 'next/image';
import { HiEllipsisHorizontalCircle } from 'react-icons/hi2';
import {
  useUpdateComment,
  useDeleteComment,
  useGetComments,
  useToggleCommentLike,
} from '@/hooks/queries/playlist.query';
import useAuthStore from '@/store/authStore';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';

interface Comment {
  commentId: number;
  userId: number;
  userNickname: string;
  userProfileUrl: string;
  content: string;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
}

interface CommentListProps {
  postId: number;
  comments: Comment[];
  formatDate: (dateString: string) => string;
}

export default function CommentList({
  postId,
  comments,
  formatDate,
}: CommentListProps) {
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const { userInfo } = useAuthStore();

  const { mutate: updateComment } = useUpdateComment();
  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: toggleLike } = useToggleCommentLike();
  const { refetch } = useGetComments(Number(postId));

  const handleOptionComment = (commentId: number) => {
    setActiveCommentId((prev) => (prev === commentId ? null : commentId));
  };

  const handleEditComment = (commentId: number, content: string) => {
    setEditCommentId(commentId);
    setEditContent(content);
  };

  const handleSaveEdit = (postId: number, commentId: number) => {
    if (!editContent.trim()) return;

    updateComment(
      { postId, commentId, content: editContent },
      {
        onSuccess: () => {
          setEditCommentId(null);
          setActiveCommentId(null);
          refetch();
        },
      }
    );
  };

  const handleDeleteComment = (postId: number, commentId: number) => {
    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) return;

    deleteComment(
      { postId, commentId },
      {
        onSuccess: () => {
          setActiveCommentId(null);
          refetch();
        },
      }
    );
  };

  const handleLikeToggle = (commentId: number) => {
    toggleLike(
      { postId, commentId },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  return (
    <div className='flex flex-col gap-[10px]'>
      {comments
        .slice()
        .reverse()
        .map((comment) => (
          <div
            key={comment.commentId}
            className='flex flex-col gap-[10px] p-2 border-b border-gray-200'
          >
            <div className='flex items-start gap-[10px]'>
              <div className='flex flex-col gap-[10px] w-full'>
                <div className='flex gap-[10px] items-center'>
                  <Image
                    src={comment.userProfileUrl || '/placeholder.jpg'}
                    alt={comment.userNickname}
                    width={30}
                    height={30}
                    className='rounded-full'
                  />
                  <div className='font-bold text-sm'>
                    {comment.userNickname}
                  </div>
                </div>
                {editCommentId === comment.commentId ? (
                  <div className='flex gap-[10px] items-center'>
                    <input
                      type='text'
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className='flex-1 rounded-full p-2 border border-gray-300 text-[12px]'
                    />
                    <button
                      onClick={() => handleSaveEdit(postId, comment.commentId)}
                      className='text-white hover:underline text-sm'
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setEditCommentId(null)}
                      className='text-red-600 hover:underline text-sm'
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <div className='text-sm text-white'>{comment.content}</div>
                )}
                <div>
                  <div className='flex items-center gap-[10px]'>
                    {userInfo && (
                      <>
                        <button
                          onClick={() => handleLikeToggle(comment.commentId)}
                        >
                          {comment.isLiked ? (
                            <IoMdHeart size={26} color='red' />
                          ) : (
                            <IoMdHeartEmpty size={26} />
                          )}
                        </button>
                        <span className='text-sm text-white'>
                          {comment.likeCount}
                        </span>
                      </>
                    )}

                    {userInfo?.userId === comment.userId && (
                      <>
                        <button
                          onClick={() => handleOptionComment(comment.commentId)}
                          className='text-gray-500'
                        >
                          <HiEllipsisHorizontalCircle color='white' size={26} />
                        </button>
                        {activeCommentId === comment.commentId && (
                          <div className='flex items-center gap-[10px] bg-gray-200 text-black px-2 py-1 rounded-full w-fit self-end'>
                            <button
                              onClick={() =>
                                handleEditComment(
                                  comment.commentId,
                                  comment.content
                                )
                              }
                              className='text-[12px] hover:underline'
                            >
                              수정
                            </button>
                            <span className='text-black text-[12px]'>·</span>
                            <button
                              onClick={() =>
                                handleDeleteComment(postId, comment.commentId)
                              }
                              className='text-[12px] hover:underline'
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </>
                    )}
                    <div className='text-xs text-white'>
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
