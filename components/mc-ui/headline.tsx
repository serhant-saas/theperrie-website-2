import React from 'react';

import { cn } from '@/lib/utils';
import type {
  HEADLINE_TAGS,
  HEADLINE_TYPES,
  SIZES,
} from '@/types/component-props';

export type HeadlineProps = React.HTMLAttributes<HTMLHeadingElement> & {
  children: React.ReactNode;
  tag?: HEADLINE_TAGS;
  // size?: Extract<SIZES, 's' | 'm' | 'l'>;
  type?: HEADLINE_TYPES;
};

export const Headline: React.FC<HeadlineProps> = ({
  children,
  tag: Component = 'h2',
  // size,
  type = 'default',
  ...rest
}) => {
  return (
    <Component
      {...rest}
      className={cn(
        'leading-tight',
        // size === 's' && 'text-md lg:text-lg',
        // size === 'm' && 'text-lg md:text-2xl',
        // size === 'l' && 'text-headline-mobile md:text-headline-desktop',
        type === 'default' && 'text-headline-mobile md:text-headline-desktop',
        type === 'facts' &&
          'text-headline-facts-mobile md:text-headline-facts-desktop',
        type === 'availability' &&
          'text-headline-availability-mobile md:text-headline-availability-desktop'
        // 'text-2xl leading-[110%] lg:text-5xl lg:leading-[110%] 2xl:text-6xl 2xl:leading-[110%]'
      )}
    >
      {children}
    </Component>
  );
};
