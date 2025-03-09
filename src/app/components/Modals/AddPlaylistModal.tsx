'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { HiCheckCircle } from 'react-icons/hi';
import {
  useAddPlaylist,
  usePlaylistDetails,
} from '@/hooks/queries/playlist.query';

interface AddPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPlaylistModal = ({ isOpen, onClose }: AddPlaylistModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const { refetch } = usePlaylistDetails();
  const { mutate: addPlaylist } = useAddPlaylist();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleAddPlaylist = () => {
    if (!playlistUrl.trim()) {
      alert('플레이리스트 URL을 입력해주세요!');
      return;
    }

    const isConfirmed = window.confirm('플레이리스트를 등록하겠습니까?');
    if (!isConfirmed) {
      onClose();
      return;
    }

    addPlaylist(
      { playlistUrl },
      {
        onSuccess: () => {
          refetch();
          onClose();
        },
        onError: (error) => {
          console.error('플레이리스트 추가 실패:', error);
          alert('플레이리스트 추가에 실패했습니다.');
        },
      }
    );
  };

  return createPortal(
    <div
      className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]'
      onClick={onClose}
    >
      <div
        className='bg-white dark:bg-white flex flex-col px-[40px] py-[60px] gap-[30px] rounded-3xl w-[500px] h-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex flex-col gap-[20px]'>
          <div className='flex items-center justify-center text-4xl font-extrabold blur-[1px] text-black'>
            + Playlist
          </div>
          <div className='flex items-center justify-center text-[#9F9F9F] text-[14px]'>
            스포티파이 플레이리스트 링크를 넣어주세요.
          </div>
          <div className='flex w-full items-center gap-[10px] justify-between'>
            <input
              type='text'
              className='w-full bg-white border border-black rounded-lg px-4 py-2 focus:outline-none text-black border-1'
              placeholder='https://open.spotify.com/playlist/...'
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
            />
            <button onClick={handleAddPlaylist} className='flex'>
              <HiCheckCircle size={24} color={'#1ED760'} />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddPlaylistModal;
