import { vercelStegaClean } from '@vercel/stega';
import React from 'react';

import { cn } from '@/lib/utils';

type LayoutGridProps = {
  display?: 'regular' | 'fullbleed' | 'fullbleedMobileOnly';
  fullbleed?: boolean;
  fullbleedMobileOnly?: boolean;
  children: React.ReactNode;
  className?: string;
};

export const LayoutGrid: React.FC<LayoutGridProps> = ({
  children,
  display = 'regular',
  className,
}) => {
  const cleanedDisplay = vercelStegaClean(display);

  return (
    <div
      className={cn(
        'grid w-full grid-cols-12 gap-mobile md:gap-desktop',
        {
          'mx-auto max-w-screen-3xl px-3 md:px-6': cleanedDisplay === 'regular',
          'md:mx-auto md:max-w-screen-3xl md:px-6':
            cleanedDisplay === 'fullbleedMobileOnly',
          'px-0 md:px-0': cleanedDisplay === 'fullbleed',
        },
        className
      )}
    >
      {children}
    </div>
  );
};
