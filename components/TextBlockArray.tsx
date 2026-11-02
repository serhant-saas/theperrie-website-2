import type { PortableTextComponents } from '@portabletext/react';
import { PortableText } from '@portabletext/react';
import React from 'react';

import { cn } from '@/lib/utils';
import type { TextBlock as TextBlockType } from '@/sanity/types';

import { HeadlineSingle } from './HeadlineSingle';
import { LayoutGrid } from './LayoutGrid';

// Define custom components for Portable Text rendering
const components: PortableTextComponents = {
  marks: {
    em: ({ children }) => (
      <em className='font-semibold text-gray-600'>{children}</em>
    ),
    strong: ({ children }) => <strong className='font-bold'>{children}</strong>,
    underline: ({ children }) => <span className='underline'>{children}</span>,
  },
};

type TextBlockArrayProps = {
  blocks: TextBlockType[];
};

export const TextBlockArray: React.FC<TextBlockArrayProps> = ({ blocks }) => {
  return (
    <LayoutGrid>
      {blocks.map((blockItem, index) => (
        <div
          key={index}
          className={cn('col-span-full space-y-6 pb-16 font-default text-xl', {
            'lg:col-span-12': blocks.length === 1,
            'lg:col-span-6': blocks.length === 2,
            'sm:col-span-6 lg:col-span-4': blocks.length >= 3,
          })}
        >
          <span className='font-default text-mobile uppercase md:text-desktop'>
            {blockItem.title}
          </span>
          <PortableText
            value={blockItem.content}
            // You can pass serializers here if you need custom rendering for specific types
            components={components}
          />
        </div>
      ))}
    </LayoutGrid>
  );
};

export default TextBlockArray;
