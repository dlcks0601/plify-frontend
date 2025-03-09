'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import {
  MdOutlinePlayCircleFilled,
  MdOutlinePauseCircleFilled,
} from 'react-icons/md';

import {
  IoPlaySkipForwardSharp,
  IoPlaySkipBackSharp,
  IoVolumeHigh,
  IoVolumeMute,
} from 'react-icons/io5';

import {
  useCurrentTrackQuery,
  useNextTrackMutation,
  usePauseMutation,
  usePlayMutation,
  usePrevTrackMutation,
  useSeekMutation,
  useSetVolumeMutation,
} from '@/hooks/queries/player.query';
import { usePlayerStore } from '@/store/playerStore';

import { useTheme } from 'next-themes';
import { formatTime } from '@/constants/playerFormatTime';

export default function SpotifyPlayer() {
  const { theme } = useTheme();
  const { data: playbackData, isLoading, error } = useCurrentTrackQuery();
  const track = playbackData?.item;
  const { isPlaying } = usePlayerStore();
  const playColor = theme === 'dark' ? 'white' : 'black';
  const [volume, setVolume] = useState<number>(50);
  const setVolumeMutation = useSetVolumeMutation();

  const playMutation = usePlayMutation();
  const pauseMutation = usePauseMutation();
  const nextMutation = useNextTrackMutation();
  const prevMutation = usePrevTrackMutation();
  const seekMutation = useSeekMutation();

  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (playbackData) {
      setProgress(playbackData.progress_ms);
    }
  }, [playbackData?.item?.id, playbackData?.progress_ms]);

  useEffect(() => {
    if (!playbackData || !track || !isPlaying) return;

    let currentProgress = playbackData.progress_ms;
    setProgress(currentProgress);

    const interval = setInterval(() => {
      currentProgress += 1000;
      setProgress(
        currentProgress > track.duration_ms
          ? track.duration_ms
          : currentProgress
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [playbackData, track?.id, track?.duration_ms, isPlaying]);

  const handleProgressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value));
  };

  const handleSeek = (positionMs: number) => {
    seekMutation.mutate(positionMs);
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    setVolumeMutation.mutate(newVolume);
  };

  const toggleMute = () => {
    if (volume > 0) {
      setVolume(0);
      setVolumeMutation.mutate(0);
    } else {
      setVolume(50);
      setVolumeMutation.mutate(50);
    }
  };

  if (isLoading) return <p className='p-4'>Loading current track...</p>;
  if (error) return <p className='p-4'>Failed to load current track.</p>;
  if (!track) return <p className='p-4'>🎵 No song playing...</p>;

  return (
    <div className='flex px-[8px] py-[8px] text-black dark:text-white'>
      <div className='flex gap-[20px] w-full justify-between'>
        <div className='flex items-center w-[300px] gap-[12px]'>
          <img
            src={track.album.images[0]?.url}
            alt={track.name}
            className='w-12 h-12 rounded-lg object-cover'
          />
          <div className='flex flex-col'>
            <div className='flex'>
              <p className='flex text-s font-light'>{track.name}</p>
            </div>

            <div className='flex'>
              <p className='flex text-xs font-light text-[#9F9F9F]'>
                {track.artists.map((artist: any) => artist.name).join(', ')}
              </p>
            </div>
          </div>
        </div>
        <div className='flex flex-col w-[600px] items-center'>
          <div className='flex gap-[10px]'>
            <button
              onClick={() => prevMutation.mutate()}
              className='text-2xl text-gray-300 hover:text-white'
            >
              <IoPlaySkipBackSharp />
            </button>

            {isPlaying ? (
              <button
                onClick={() => pauseMutation.mutate()}
                className='text-4xl'
              >
                <MdOutlinePauseCircleFilled />
              </button>
            ) : (
              <button
                onClick={() => playMutation.mutate()}
                className='text-4xl'
              >
                <MdOutlinePlayCircleFilled />
              </button>
            )}

            <button
              onClick={() => nextMutation.mutate()}
              className='text-2xl text-gray-300 hover:text-white'
            >
              <IoPlaySkipForwardSharp />
            </button>
          </div>
          <div className='flex items-center gap-[10px] w-full'>
            <span className='text-xs w-12 text-right'>
              {formatTime(progress)}
            </span>
            <input
              type='range'
              className='w-full h-1.5 rounded-full appearance-none cursor-pointer
                bg-gray-700 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gray-700 
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:h-0 
                [&::-moz-range-thumb]:appearance-none'
              min={0}
              max={track.duration_ms}
              step={1000}
              value={progress}
              onChange={handleProgressChange}
              onMouseUp={(e) => handleSeek(Number(e.currentTarget.value))}
              onTouchEnd={(e) => handleSeek(Number(e.currentTarget.value))}
              style={{
                background: `linear-gradient(to right, ${playColor} ${
                  (progress / track.duration_ms) * 100
                }%, gray 0%)`,
              }}
            />
            <span className='text-xs w-12 text-left'>
              {formatTime(track.duration_ms)}
            </span>
          </div>
        </div>
        {/* 사운드 컨트롤 */}
        <div className='flex items-center gap-[10px]'>
          <div onClick={toggleMute} className='cursor-pointer'>
            {volume > 0 ? (
              <IoVolumeHigh className='text-l' />
            ) : (
              <IoVolumeMute className='text-l' />
            )}
          </div>
          <input
            type='range'
            className='w-full h-1.5 rounded-full appearance-none cursor-pointer
              bg-gray-700 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gray-700 
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:h-0 
              [&::-moz-range-thumb]:appearance-none'
            min={0}
            max={100}
            step={1}
            value={volume}
            onChange={handleVolumeChange}
            style={{
              background: `linear-gradient(to right, ${playColor} 0%, ${playColor} ${volume}%, gray ${volume}%, gray 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
