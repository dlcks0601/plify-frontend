'use client';

import Image from 'next/image';
import {
  useMyPlaylist,
  useTopArtist,
  useTopTracks,
} from '@/hooks/queries/user.query';
import useAuthStore from '@/store/authStore';

export default function MyPage() {
  const { data: topTracks } = useTopTracks();
  const { data: topArtist } = useTopArtist();
  const { data: myPlaylist } = useMyPlaylist();
  const { userInfo } = useAuthStore();

  return (
    <div className='flex flex-col p-[10px]'>
      <div className='flex items-center gap-4 p-4'>
        <Image
          src={userInfo.profileUrl || '/default-profile.png'} // 기본 이미지 추가
          alt='User Profile'
          width={60}
          height={60}
          className='rounded-full object-cover'
        />
        {userInfo.nickname}
      </div>
      <h2 className='text-lg font-bold'>가장 많이 들은 곡</h2>
      {topTracks?.map((track) => (
        <div
          key={track.rank}
          className='flex items-center py-2 border-b gap-[10px]'
        >
          <div className='w-12 text-center'>{track.rank}</div>
          <div className='w-24 flex justify-center'>
            <Image
              src={track.image}
              alt={track.title}
              width={50}
              height={50}
              className='object-cover rounded'
            />
          </div>
          <div className='flex-1'>{track.title}</div>
          <div className='w-40'>{track.artist}</div>
        </div>
      ))}
      <h2 className='text-lg font-bold'>가장 많이 들은 아티스트</h2>
      {topArtist?.map((artist) => (
        <div
          key={artist.rank}
          className='flex items-center py-2 border-b gap-[10px]'
        >
          <div className='w-12 text-center'>{artist.rank}</div>
          <div className='w-24 flex justify-center'>
            <Image
              src={artist.image}
              alt={artist.artist}
              width={50}
              height={50}
              className='object-cover rounded'
            />
          </div>
          <div className='w-40'>{artist.artist}</div>
        </div>
      ))}
      <h2 className='text-lg font-bold'>내 플레이리스트</h2>
      {myPlaylist?.map((playlist) => (
        <div
          key={playlist.number}
          className='flex items-center py-2 border-b gap-[10px]'
        >
          <div className='w-12 text-center'>{playlist.number}</div>
          <div className='w-24 flex justify-center'>
            <Image
              src={playlist.image}
              alt={playlist.name}
              width={50}
              height={50}
              className='object-cover rounded'
            />
          </div>
          <div className='w-40'>{playlist.name}</div>
        </div>
      ))}
    </div>
  );
}
