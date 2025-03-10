'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAlbumMutation } from '@/hooks/queries/player.query';

const slides = [
  {
    image: '/Jennie.jpeg',
    title: 'Jennie',
    subtitle: 'Ruby',
    description:
      '셀프 프로듀싱, 막강한 라인업, 대체 불가한 정체성으로 완성한 제니의 첫 정규 앨범.',
    albumId: '1W7dufIS79lk01w3tBAGe5',
  },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const { mutate: playAlbum } = useAlbumMutation();

  const handlePlayAlbum = () => {
    const albumId = slides[currentIndex].albumId;
    console.log(`🎵 Trying to play album: ${albumId}`);
    if (albumId) {
      playAlbum(albumId);
    }
  };

  return (
    <main className='flex flex-col min-h-screen'>
      <div className='relative w-full h-screen'>
        <Image
          src={slides[currentIndex].image}
          alt={slides[currentIndex].title}
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 flex items-center pl-20'>
          <div className='flex flex-col gap-[20px]'>
            <div className='text-white text-md font-bold'>
              {slides[currentIndex].title}
            </div>
            <div className='text-white text-4xl font-bold'>
              {slides[currentIndex].subtitle}
            </div>
            <div className='text-white text-lg font-light'>
              {slides[currentIndex].description}
            </div>
            <button
              onClick={handlePlayAlbum}
              className="text-white text-md font-light z-50 relative self-start after:content-[''] after:block after:w-full after:h-[1px] after:bg-red-500 after:mt-1 after:transition-all after:duration-300 hover:after:w-0 hover:text-red-500 hover:after-bg-red-500"
            >
              PLAY
            </button>
          </div>
        </div>
        <div className='absolute inset-0 flex justify-between items-center'>
          <div
            className='w-1/4 h-full cursor-pointer'
            onClick={handlePrev}
          ></div>
          <div
            className='w-1/4 h-full cursor-pointer'
            onClick={handleNext}
          ></div>
        </div>
      </div>
    </main>
  );
}
