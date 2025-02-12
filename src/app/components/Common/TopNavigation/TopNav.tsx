'use client';

import { useState, useLayoutEffect } from 'react';
import NavigationBar from './NavigationBar';
import Menu from './Menu';

const TopNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  useLayoutEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <div>
      <NavigationBar toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
      {isMenuOpen && <Menu closeMenu={closeMenu} />}
    </div>
  );
};

export default TopNav;
