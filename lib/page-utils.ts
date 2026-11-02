'use client';

// import { backgroundClass, BackgroundColor } from './color-utils';
import { vercelStegaClean } from '@vercel/stega';
import { useEffect } from 'react';

import { BACKGROUND_COLORS } from '@/types/component-props';

type ChangeBackgroundColorProps = {
  backgroundColor: BACKGROUND_COLORS;
};

const ChangeBackgroundColor = ({
  backgroundColor,
}: ChangeBackgroundColorProps) => {
  const cleanedBackgroundColor = vercelStegaClean(backgroundColor);

  const backgroundClass = {
    transparent: 'bg-background-transparent',
    beige: 'bg-background-beige',
    blue: 'bg-background-blue',
    lightBeige: 'bg-background-lightBeige',
    lightGreen: 'bg-background-lightGreen',
    peach: 'bg-background-peach',
    pink: 'bg-background-pink',
    slate: 'bg-background-slate',
  };

  const backgroundColorClass = backgroundClass[cleanedBackgroundColor];

  useEffect(() => {
    // Function to change the background color
    const changeBackgroundColor = () => {
      const body = document.body;
      body && document.body.classList.add(backgroundColorClass);
    };

    // Call the function to change the background color
    changeBackgroundColor();

    // Cleanup function to reset the background color when the component unmounts
    return () => {
      document.body.classList.remove(backgroundColorClass);
    };
  }, [backgroundColorClass]);

  return null;
};

export default ChangeBackgroundColor;
