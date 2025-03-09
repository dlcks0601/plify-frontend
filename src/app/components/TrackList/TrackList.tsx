'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CiClock2 } from 'react-icons/ci';

interface Artist {
  name: string;
}

interface Album {
  name: string;
  images?: { url: string }[];
}

interface Track {
  id: string;
  name: string;
  duration_ms: number;
  artists: Artist[];
  album: Album;
}

interface TrackItem {
  track: Track;
}

interface TrackListProps {
  tracks: TrackItem[];
}

export default function TrackList({ tracks }: TrackListProps) {
  const [visibleCount, setVisibleCount] = useState(5);
  const totalTracks = tracks.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleCollapse = () => {
    setVisibleCount(5);
  };

  return (
    <div className='mt-6 px-2'>
      <div className='grid grid-cols-[40px_1fr_1fr_100px] gap-4 py-2 text-gray-400 border-b border-gray-700 px-2'>
        <span>#</span>
        <span>제목</span>
        <span>앨범</span>
        <div className='flex justify-end'>
          <CiClock2 />
        </div>
      </div>

      {tracks?.slice(0, visibleCount).map((item, index) => {
        const track = item.track;
        if (!track) return null;

        const trackMinutes = Math.floor(track.duration_ms / 60000);
        const trackSeconds = Math.floor((track.duration_ms % 60000) / 1000);

        return (
          <div
            key={track.id}
            className='grid grid-cols-[40px_1fr_1fr_100px] gap-4 py-2 items-center hover:bg-[#242424] cursor-pointer px-2'
          >
            <span className='text-gray-400'>{index + 1}</span>

            <div className='flex items-center gap-4'>
              <Image
                src={track.album.images?.[0]?.url || '/placeholder.jpg'}
                alt={track.name}
                width={40}
                height={40}
                className='rounded'
              />
              <div>
                <p className='text-white'>{track.name}</p>
                <p className='text-gray-400 text-sm'>
                  {track.artists.map((artist) => artist.name).join(', ')}
                </p>
              </div>
            </div>

            <span className='text-gray-400'>{track.album.name}</span>

            <span className='text-gray-400 text-right'>
              {trackMinutes}:{trackSeconds.toString().padStart(2, '0')}
            </span>
          </div>
        );
      })}

      {totalTracks > 5 && (
        <div className='flex justify-center gap-4 mt-4'>
          {visibleCount < totalTracks && (
            <button
              onClick={handleShowMore}
              className='bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700'
            >
              더 보기
            </button>
          )}
          {visibleCount > 5 && (
            <button
              onClick={handleCollapse}
              className='bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700'
            >
              접기
            </button>
          )}
        </div>
      )}
    </div>
  );
}
