import { usePlaylistDetails } from '@/hooks/queries/playlist.query';
import Image from 'next/image';

import Link from 'next/link';
import PlaylistLike from './PlaylistLike';

export default function PlaylistCard() {
  const { data: playlistData } = usePlaylistDetails();

  return (
    <div className='grid grid-cols-4 justify-between gap-[40px]'>
      {playlistData?.map((playlist) => (
        <div key={playlist.postId} className='grid'>
          <div className='flex flex-col gap-[10px]'>
            <Link
              href={`/playlist/${playlist.postId}`}
              className='flex-col cursor-pointer'
            >
              <Image
                src={playlist.images?.[0]?.url || '/placeholder.jpg'}
                alt={playlist.name || 'Unknown Playlist'}
                width={300}
                height={300}
                className='flex w-full object-cover rounded'
              />
            </Link>
            <div className='flex justify-between'>
              <div className='flex flex-col'>
                <div className='flex font-bold text-[24px]'>
                  {playlist.name || 'Unknown Playlist'}
                </div>
                <div className='flex items-center'>
                  <div className='text-[#9F9F9F]'>
                    만든사람 : {playlist.userName || 'Unknown Playlist'}
                  </div>
                </div>
              </div>
              <div className='flex'>
                <PlaylistLike
                  postId={playlist.postId}
                  likeCount={playlist.likeCount}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
