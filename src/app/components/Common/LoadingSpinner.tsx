'use client';

import React from 'react';
import '../../../ui/LoadingSpinner.css';

export default function LoadingSpinner() {
  return (
    <div className='loading-container'>
      <div className='spinner'></div>
    </div>
  );
}
