'use client';

import PlaylistCard from '@/app/components/Playlist/PlaylistCard';
import { useState } from 'react';
import { CiCirclePlus } from 'react-icons/ci';
import AddPlaylistModal from '../components/Modals/AddPlaylistModal';

export default function Playlist() {
  const [isAddPalylistModalOpen, setAddPlaylistModalOpen] = useState(false);
  return (
    <>
      <div className='flex flex-col p-4'>
        <div className='flex flex-col gap-[20px]'>
          <div className='flex items-center justify-between'>
            <div className='text-[80px] font-bold'>Playlist</div>
            <button onClick={() => setAddPlaylistModalOpen(true)}>
              <CiCirclePlus size={40} />
            </button>
          </div>
          <PlaylistCard />
        </div>
      </div>
      <AddPlaylistModal
        isOpen={isAddPalylistModalOpen}
        onClose={() => setAddPlaylistModalOpen(false)}
      />
    </>
  );
}
