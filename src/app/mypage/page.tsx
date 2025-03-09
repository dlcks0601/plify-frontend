'use client';

import Image from 'next/image';
import {
  useMyPlaylist,
  useTopArtist,
  useTopTracks,
} from '@/hooks/queries/user.query';
import useAuthStore from '@/store/authStore';
import { usePlaylistMutation } from '@/hooks/queries/player.query';

export default function MyPage() {
  const { data: topTracks } = useTopTracks();
  const { data: topArtist } = useTopArtist();
  const { data: myPlaylist } = useMyPlaylist();
  const { userInfo } = useAuthStore();
  const { mutate: playPlaylist } = usePlaylistMutation();

  const handlePlayPlaylist = (playlistId: string) => {
    playPlaylist(playlistId);
  };

  return (
    <div className='flex flex-col p-4 gap-[20px]'>
      <div className='flex items-center gap-4'>
        <Image
          src={userInfo.profileUrl || '/default-profile.png'}
          alt='User Profile'
          width={200}
          height={200}
          className='rounded-full object-cover'
        />
        <div className='flex text-[120px] font-extrabold'>
          {userInfo.nickname}
        </div>
      </div>

      <div className='flex flex-col gap-[20px]'>
        <div className='text-[80px] font-bold'>Most Played Songs</div>
        <div className='grid grid-cols-4 gap-[20px]'>
          {topTracks?.map((track) => (
            <div key={track.rank} className='flex'>
              <div className='flex flex-col w-full gap-[10px]'>
                <Image
                  src={track.image}
                  alt={track.title}
                  width={300}
                  height={300}
                  className='object-cover rounded'
                />
                <div className='flex flex-col'>
                  <div className='flex font-bold text-[24px]'>
                    {track.title}
                  </div>
                  <div className='flex font-light text-[18px] text-[#9F9F9F]'>
                    {track.artist}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-col gap-[20px]'>
        <div className='text-[80px] font-bold'>Favorite Artists</div>
        <div className='grid grid-cols-4 gap-[20px]'>
          {topArtist?.map((artist) => (
            <div key={artist.rank} className='flex'>
              <div className='flex flex-col w-full gap-[10px]'>
                <Image
                  src={artist.image}
                  alt={artist.artist}
                  width={300}
                  height={300}
                  className='object-cover rounded-full aspect-square'
                />
                <div className='flex font-bold text-[24px] '>
                  {artist.artist}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-col gap-[20px]'>
        <div className='text-[80px] font-bold'>My Playlist</div>
        <div className='grid grid-cols-4 gap-[20px]'>
          {myPlaylist?.map((playlist) => (
            <div
              key={playlist.number}
              className='flex cursor-pointer'
              onClick={() => handlePlayPlaylist(playlist.id)}
            >
              <div className='flex flex-col w-full gap-[10px]'>
                <Image
                  src={playlist.image}
                  alt={playlist.name}
                  width={300}
                  height={300}
                  className='object-cover rounded'
                />
                <div className='flex flex-col'>
                  <div className='flex font-bold text-[24px]'>
                    {playlist.name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
