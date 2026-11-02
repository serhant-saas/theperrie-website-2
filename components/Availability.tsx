'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { urlForFile, urlForImage } from '@/sanity/lib/assets';
import {
  Availability as AvailabilityType,
  AvailabilityItem as AvailabilityItemType,
} from '@/sanity/types';

import { LayoutGrid } from './LayoutGrid';
import { Accordion } from './shadcn-ui/accordion';
import { Button, buttonVariants } from './shadcn-ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './shadcn-ui/collapsible';

type AvailabilityProps = {
  factSheet?: AvailabilityType['factSheetPDF'];
  items?: AvailabilityType['items'];
};

const AvailabilityItem = (item: AvailabilityItemType) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!item.floorPlanImage?.asset) return null;

  const { asset, alt } = item.floorPlanImage;
  const imageUrl = urlForImage(asset);

  const pdfUrl = urlForFile(item.floorplanPDF?.asset);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn(
        'grid grid-cols-10 grid-rows-[1fr_0fr_0fr_0fr] gap-mobile border-t p-2 pl-6 transition-all duration-1000 md:gap-desktop md:pb-6',
        {
          'grid-rows-[1fr_1fr_1fr_1fr] bg-white': isOpen,
        }
      )}
    >
      <div className='col-span-10 col-start-1 row-start-1 flex flex-col space-y-2 md:col-span-5 md:flex-row md:space-y-0'>
        {/**
         * Name
         * */}
        <div
          className={cn(
            'basis-2/5',
            'font-atica uppercase',
            'text-headline-availability-mobile md:text-headline-availability-desktop'
          )}
        >
          {item.name}
        </div>
        {/**
         * Specs
         */}
        <ul className='basis-3/5 space-y-1 font-default text-sm'>
          <li className='flex'>
            <span className='basis-1/3'>Beds</span>
            <span className='basis-2/3'>{item.beds}</span>
          </li>
          <li className='flex'>
            <span className='basis-1/3'>Baths</span>
            <span className='basis-2/3'>{item.baths}</span>
          </li>
          <li className='flex'>
            <span className='basis-1/3'>Exposure</span>
            <span className='basis-2/3'>{item.exposure}</span>
          </li>
          <li className='flex'>
            <span className='basis-1/3'>Interior SF-SM</span>
            <span className='basis-2/3'>{item.interiorSF}</span>
          </li>
          {item.exteriorSF && (
            <li className='flex'>
              <span className='basis-1/3'>Exterior SF-SM</span>
              <span className='basis-2/3'>{item.exteriorSF}</span>
            </li>
          )}
          <li className='flex'>
            <span className='basis-1/3'>Price</span>
            <span className='basis-2/3'>{item.price}</span>
          </li>
          {item.commonCharges && (
            <li className='flex'>
              <span className='basis-1/3'>Common Charges</span>
              <span className='basis-2/3'>{item.commonCharges}</span>
            </li>
          )}
          {item.taxes && (
            <li className='flex'>
              <span className='basis-1/3'>Taxes</span>
              <span className='basis-2/3'>{item.taxes}</span>
            </li>
          )}
          <li className='flex'>
            <span className='basis-1/3 font-bold'>Availability</span>
            <span className='basis-2/3 font-bold'>{item.availability}</span>
          </li>
        </ul>
      </div>

      {/**
       * Collapsible Content
       */}
      <CollapsibleContent
        className={cn(
          'relative col-span-full row-span-2 row-start-2 transition-all duration-1000 md:col-span-4 md:col-start-6 md:row-span-4 md:row-start-1'
        )}
      >
        <Image
          src={imageUrl}
          alt={alt ?? ''}
          fill
          className='block h-auto w-full object-contain'
        />
      </CollapsibleContent>

      {/**
       * Trigger
       */}
      <div className='col-span-2 col-start-9 row-start-1 flex items-start md:col-start-10 md:items-end'>
        <CollapsibleTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='group relative flex size-10 items-end justify-end p-0 hover:bg-transparent md:size-14'
          >
            {/* <div> */}
            <Image
              src={'/dir_arrow.svg'}
              alt='Arrow'
              fill
              className={cn(
                '-rotate-90 transition-all duration-700 ease-in-out group-hover:hidden',
                {
                  'rotate-90': isOpen,
                }
              )}
            />
            <Image
              src={'/dir_arrow_inverted.svg'}
              alt='Arrow'
              fill
              className={cn(
                'hidden -rotate-90 transition-all duration-700 ease-in-out group-hover:block',
                {
                  'rotate-90': isOpen,
                }
              )}
            />
            {/* </div> */}
            <span className='sr-only'>Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className='col-span-full row-start-4 flex items-end md:col-span-4'>
        <div className='flex w-full flex-col gap-mobile md:flex-row md:gap-desktop'>
          <Link
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'w-full rounded-3xl border-foreground bg-white font-atica font-normal uppercase text-foreground hover:border-white hover:bg-foreground hover:text-white'
            )}
            href={'/contact'}
          >
            Contact
          </Link>
          {pdfUrl && (
            <Button
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'mb-6 rounded-3xl border-foreground bg-white font-atica font-normal uppercase text-foreground hover:border-white hover:bg-foreground hover:text-white'
              )}
              asChild
            >
              <a
                href={pdfUrl}
                target='_blank'
                rel='noopener noreferrer'
                className={cn('w-full')}
              >
                Download
              </a>
            </Button>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const Availability = ({ factSheet, items }: AvailabilityProps) => {
  const factSheetUrl = urlForFile(factSheet?.asset);

  return (
    <>
      <LayoutGrid>
        {factSheetUrl && (
          <div className={cn('col-span-full mb-6 md:mb-2')}>
            <Button
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'rounded-3xl border-foreground bg-white font-atica font-normal uppercase text-foreground hover:border-white hover:bg-foreground hover:text-white'
              )}
              asChild
            >
              <a
                href={factSheetUrl}
                target='_blank'
                rel='noopener noreferrer'
                className={cn('w-full md:w-auto')}
              >
                Download Fact Sheet
              </a>
            </Button>
          </div>
        )}
      </LayoutGrid>
      <LayoutGrid display='fullbleed' className='relative'>
        <Accordion
          type='single'
          collapsible
          className='col-span-12 col-start-1'
        >
          {items?.map((item) => {
            return <AvailabilityItem key={item._key} {...item} />;
          })}
        </Accordion>
      </LayoutGrid>
    </>
  );
};
