import Image from 'next/image';
import { IoArrowUpCircle } from 'react-icons/io5';

interface CommentInputProps {
  userProfileUrl: string;
  userNickname: string;
  commentText: string;
  setCommentText: (text: string) => void;
  handleAddComment: () => void;
}

export default function CommentInput({
  userProfileUrl,
  userNickname,
  commentText,
  setCommentText,
  handleAddComment,
}: CommentInputProps) {
  return (
    <div className='flex justify-between items-center gap-[20px]'>
      <Image
        src={userProfileUrl || '/placeholder.jpg'}
        alt={userNickname || 'User'}
        width={36}
        height={36}
        className='rounded-full'
      />
      <input
        type='text'
        className='flex items-center font-light text-[12px] w-full h-[42px] bg-white rounded-full focus:outline-none px-4 py-1 text-black placeholder:text-[12px] placeholder:text-left border border-black'
        placeholder='댓글을 입력해주세요.'
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <button onClick={handleAddComment} className='flex items-center'>
        <IoArrowUpCircle size={36} color='#ffffff' />
      </button>
    </div>
  );
}
