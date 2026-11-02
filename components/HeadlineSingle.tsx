import { vercelStegaClean } from '@vercel/stega';
import Image from 'next/image';
import React from 'react';

import { cn } from '@/lib/utils';
import { HeadlineSingle as HeadlineSingleType } from '@/sanity/types';

import Eight from '../public/neighborhood-icons/PERRIE_Neighborhood_Icons_Eight.svg';
import Five from '../public/neighborhood-icons/PERRIE_Neighborhood_Icons_Five.svg';
import Four from '../public/neighborhood-icons/PERRIE_Neighborhood_Icons_Four.svg';
import Nine from '../public/neighborhood-icons/PERRIE_Neighborhood_Icons_Nine.svg';
import One from '../public/neighborhood-icons/PERRIE_Neighborhood_Icons_One.svg';
import Seven from '../public/neighborhood-icons/PERRIE_Neighborhood_Icons_Seven.svg';
import Six from '../public/neighborhood-icons/PERRIE_Neighborhood_Icons_Six.svg';
import Three from '../public/neighborhood-icons/PERRIE_Neighborhood_Icons_Three.svg';
import Two from '../public/neighborhood-icons/PERRIE_Neighborhood_Icons_Two.svg';

const ICONS: StaticImageData[] = [
  One,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
];

import { StaticImageData } from 'next/image';

import type {
  HEADLINE_TAGS,
  HEADLINE_TYPES,
  HORIZONTAL_ALIGNMENTS,
  WIDTHS,
} from '@/types/component-props';

import { LayoutGrid } from './LayoutGrid';
import { Headline } from './mc-ui/headline';

type HeadlineSingleProps = {
  tag?: HEADLINE_TAGS;
  alignment?: HORIZONTAL_ALIGNMENTS;
  width?: Extract<WIDTHS, 'full' | '3/4' | '5/6'>;
  children: React.ReactNode;
  uppercase?: boolean;
  fontFamily?: 'Lora' | 'Atica';
  icon?: HeadlineSingleType['icon'];
  type?: HEADLINE_TYPES;
};

export const HeadlineSingle = ({
  tag,
  children,
  alignment = 'left',
  width = 'full',
  uppercase = true,
  fontFamily = 'Atica',
  icon,
  type,
}: HeadlineSingleProps) => {
  const cleanedTag = vercelStegaClean(tag);
  const cleanedWidth = vercelStegaClean(width);
  const cleanedAlignment = vercelStegaClean(alignment);
  const cleanedIcon = vercelStegaClean(icon);
  const cleanedFontFamily = vercelStegaClean(fontFamily);

  const headlineIcon = ICONS.find((icon) =>
    icon.src.includes(cleanedIcon ?? '')
  );

  return (
    <LayoutGrid className='z-text'>
      {cleanedIcon && headlineIcon && (
        <div className='relative col-span-2 size-9 md:col-span-1 md:size-16'>
          <Image
            alt='Background stencil'
            src={headlineIcon}
            quality={100}
            fill
            className='absolute'
          />
        </div>
      )}
      <div
        className={cn('col-span-full pb-8 sm:pb-12', {
          'md:col-span-10': cleanedWidth === '5/6',
          'md:col-start-1': cleanedAlignment === 'left',
          'md:col-end-13': cleanedAlignment === 'right',
          'col-start-3 md:col-start-2': cleanedIcon && headlineIcon,
          'md:col-start-3':
            cleanedAlignment === 'center' && cleanedWidth === '3/4',

          uppercase,
          'font-atica': cleanedFontFamily === 'Atica',
          'font-lora': cleanedFontFamily === 'Lora',
        })}
      >
        <Headline tag={cleanedTag} type={type}>
          {children}
        </Headline>
      </div>
    </LayoutGrid>
  );
};
