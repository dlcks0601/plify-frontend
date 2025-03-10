import { useState } from 'react';

const categories = ['ALL', 'POP', 'JPOP', 'INDIE', 'HIPHOP'];

export default function GenreFilter() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  return (
    <div className='flex gap-[20px]'>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-md 
            ${
              selectedCategory === category
                ? 'bg-white text-black'
                : 'bg-white/10 text-white'
            }
          `}
        >
          {category}
          {selectedCategory === category && (
            <div className='w-full h-[2px] bg-white mt-[2px]' />
          )}
        </button>
      ))}
    </div>
  );
}
