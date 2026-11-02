'use client';

import { vercelStegaClean } from '@vercel/stega';
import Image from 'next/image';
import React, { useState } from 'react';

import { cn } from '@/lib/utils';

import FactsIcon from '../public/neighborhood-icons/PERRIE_Neighborhood_Icons_Four.svg';
import { LayoutGrid } from './LayoutGrid';
import { Headline } from './mc-ui/headline';

type FactsProps = {
  headline?: string;
  columnLeft?: string[];
  columnRight?: string[];
  previewLimit?: number;
  uppercase?: boolean;
  fontFamily?: 'Lora' | 'Atica';
};

export const Facts = ({
  headline,
  columnLeft,
  columnRight,
  previewLimit = 3,
  uppercase = true,
  fontFamily = 'Atica',
}: FactsProps) => {
  const [showAll, setShowAll] = useState(false);
  const mobileList = columnLeft?.concat(columnRight ?? []);

  const cleanedFontFamily = vercelStegaClean(fontFamily);

  return (
    <LayoutGrid
      className={cn({
        'font-atica': cleanedFontFamily === 'Atica',
        'font-lora': cleanedFontFamily === 'Lora',
        uppercase: uppercase,
      })}
    >
      <div
        className={cn(
          'col-span-full grid grid-cols-12 items-center pb-12 md:block'
        )}
      >
        {/** Logo showing next to headline for mobile screens */}
        <div
          className={cn(
            'relative col-span-2 flex items-start md:col-span-1',
            'size-9 md:size-16',
            'mt-1.5 self-start md:hidden'
          )}
        >
          <Image
            alt='An icon showing an illustrated pencil tip.'
            src={FactsIcon}
            quality={100}
            fill
            className='absolute'
          />
        </div>
        <div className='col-span-4 col-start-4 md:col-span-8 md:text-center'>
          <Headline tag={'h3'} type={'facts'}>
            {headline}
          </Headline>
        </div>
      </div>

      {/** Logo showing next to list columns for desktop screens */}
      <div
        className={cn(
          'relative col-span-2 md:col-span-1',
          'size-9 md:size-16',
          'hidden md:block'
        )}
      >
        <Image
          alt='An icon showing an illustrated pencil tip.'
          src={FactsIcon}
          quality={100}
          fill
          className='absolute'
        />
      </div>

      {/* Multi-column list for desktop screens */}
      <div
        className={cn(
          'hidden md:flex md:space-x-8 md:px-12',
          // 'col-span-9 col-start-4 md:col-span-6 md:col-start-4',
          'col-span-9 col-start-4 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4',
          'z-text text-xs md:text-sm md:leading-[120%] 2xl:text-lg 2xl:leading-[120%]'
        )}
      >
        <ul className='w-full space-y-3'>
          {columnLeft?.map((item, i) => {
            return (
              <li key={i} className='list-disc'>
                {item}
              </li>
            );
          })}
        </ul>
        <ul className='w-full space-y-3'>
          {columnRight?.map((item, i) => {
            return (
              <li key={i} className='list-disc'>
                {item}
              </li>
            );
          })}
        </ul>
      </div>

      {/** Single column, collapsible list for mobile screens */}
      <div
        className={cn(
          'col-span-9 col-start-4 flex h-fit flex-col transition-all duration-300 md:col-span-6 md:col-start-4 md:hidden md:flex-row md:space-x-12 md:px-12',
          'text-facts-mobile md:text-facts-desktop'
        )}
      >
        <ul className='space-y-3'>
          {mobileList?.map((item, i) => {
            if (previewLimit === 0 || i < previewLimit || showAll)
              return (
                <li key={i} className='list-disc text-balance'>
                  {item}
                </li>
              );
          })}
        </ul>
      </div>

      <div
        className={cn(
          'col-span-full mt-12 flex flex-col justify-center text-center md:hidden',
          {
            hidden: previewLimit === 0,
          }
        )}
      >
        <button
          onClick={() => setShowAll(!showAll)}
          className='m-auto flex w-fit flex-col justify-center space-y-1'
        >
          <span className='text-buttons-mobile uppercase'>
            Read {showAll ? 'Less' : 'More'}
          </span>

          {/* Rotate on open/close and swap colors on hover*/}
          <div className='relative m-auto size-9'>
            <Image
              src='/arrow-inverted.svg'
              alt='Dropdown arrow'
              width={40}
              height={40}
              className={cn(
                'absolute transition-all duration-300',
                showAll ? 'rotate-180' : 'rotate-0'
              )}
            />
            <Image
              src='/arrow.svg'
              alt='Dropdown arrow'
              width={40}
              height={40}
              className={cn(
                'absolute opacity-100 transition-all duration-300 hover:opacity-0',
                showAll ? 'rotate-180' : 'rotate-0'
              )}
            />
          </div>
        </button>
      </div>
    </LayoutGrid>
  );
};
