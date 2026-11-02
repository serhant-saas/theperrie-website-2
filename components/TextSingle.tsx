import { vercelStegaClean } from '@vercel/stega';
import React from 'react';

import { LayoutGrid } from '@/components/LayoutGrid';
import { cn } from '@/lib/utils';
import { RichText as RichTextType } from '@/sanity/types';
import type { HORIZONTAL_ALIGNMENTS, WIDTHS } from '@/types/component-props';

import { RichText } from './mc-ui/richText';

type TextSingleProps = {
  text: RichTextType;
  alignment?: Extract<HORIZONTAL_ALIGNMENTS, 'left' | 'right'>;
  width?: Extract<WIDTHS, '1/3' | '1/2'>;
};

export const TextSingle = ({ text, alignment, width }: TextSingleProps) => {
  const cleanedAlignment = vercelStegaClean(alignment);
  const cleanedWith = vercelStegaClean(width);

  return (
    <LayoutGrid>
      <div
        className={cn(
          'col-span-full md:col-span-6 lg:col-span-4',
          'font-default text-mobile md:text-desktop',
          'pb-8 md:pb-0',
          {
            'lg:col-start-1': cleanedAlignment === 'left',
            'lg:col-start-9': cleanedAlignment === 'right',
            'sm:col-span-6': cleanedWith === '1/2',
          }
        )}
      >
        <RichText text={text} />
      </div>
    </LayoutGrid>
  );
};
