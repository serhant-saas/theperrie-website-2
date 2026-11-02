import React from 'react';

import { cn } from '@/lib/utils';
import { TEXT_COLORS } from '@/types/component-props';

export type MediaCaptionProps = {
  text: string;
  color?: TEXT_COLORS;
};

export const MediaCaption: React.FC<MediaCaptionProps> = ({
  text,
  color = 'default',
}) => {
  const textColorClass = {
    default: 'text-text-default',
    appleGreen: 'text-text-appleGreen',
    babyBlue: 'text-text-babyBlue',
    orange: 'text-text-orange',
    peach: 'text-text-peach',
    pink: 'text-text-pink',
    seafoamBlue: 'text-text-seafoamBlue',
    teal: 'text-text-teal',
  };

  return (
    <p
      // aria hidden due to low color contrast
      aria-hidden='true'
      className={cn(`mt-2 text-right`, `${textColorClass[color]}`)}
    >
      {text}
    </p>
  );
};
