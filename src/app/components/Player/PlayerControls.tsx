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
import { formatTime } from '@/hooks/useSpotifyPlayer';
import { useTheme } from 'next-themes';

export default function SpotifyPlayer() {
  const { theme } = useTheme();
  // 현재 재생 곡 정보
  const { data: playbackData, isLoading, error } = useCurrentTrackQuery();
  const track = playbackData?.item;

  // 재생 상태 (Zustand)
  const { isPlaying } = usePlayerStore();

  const playColor = theme === 'dark' ? 'white' : 'black';

  // 로컬 볼륨 상태 (0 ~ 100)
  const [volume, setVolume] = useState<number>(50);
  // 볼륨 조절 API mutation
  const setVolumeMutation = useSetVolumeMutation();

  // 플레이어 제어 (React Query Mutation)
  const playMutation = usePlayMutation();
  const pauseMutation = usePauseMutation();
  const nextMutation = useNextTrackMutation();
  const prevMutation = usePrevTrackMutation();
  const seekMutation = useSeekMutation();

  // 재생 시간(진행도) 상태 (밀리초 단위)
  const [progress, setProgress] = useState<number>(0);

  // track이 변경되었을 때 초기 progress를 API의 progress_ms 값으로 설정
  useEffect(() => {
    if (playbackData) {
      setProgress(playbackData.progress_ms);
    }
  }, [playbackData?.item?.id, playbackData?.progress_ms]);

  // 재생 상태(isPlaying)가 true일 때만 1초마다 progress를 1000ms씩 증가시킴
  useEffect(() => {
    if (!playbackData || !track || !isPlaying) return;

    // 초기 progress 값을 로컬 변수에 저장
    let currentProgress = playbackData.progress_ms;
    setProgress(currentProgress);

    const interval = setInterval(() => {
      currentProgress += 1000; // 1초마다 1000ms씩 증가
      setProgress(
        currentProgress > track.duration_ms
          ? track.duration_ms
          : currentProgress
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [playbackData, track?.id, track?.duration_ms, isPlaying]);

  // 진행도 슬라이더 변경 시 로컬 progress 업데이트
  const handleProgressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value));
  };

  // 드래그 완료 후 Seek API 호출
  const handleSeek = (positionMs: number) => {
    seekMutation.mutate(positionMs);
  };

  // 볼륨 슬라이더 변경 시, 로컬 상태 업데이트 후 API 호출
  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    setVolumeMutation.mutate(newVolume);
  };

  // 볼륨 음소거/해제 토글 핸들러
  const toggleMute = () => {
    if (volume > 0) {
      setVolume(0);
      setVolumeMutation.mutate(0);
    } else {
      setVolume(50);
      setVolumeMutation.mutate(50);
    }
  };

  // 로딩/에러 처리
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
