'use client';

import { useThemeStore } from '@/store/theme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button className='flex' onClick={toggleTheme}>
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  );
}
