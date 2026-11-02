'use client';

import React, { useState } from 'react';

import type { ExtendedSanityImageType } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { processImage } from '@/lib/utils';
import type { ImageCarousel as ImageCarouselType } from '@/sanity/types';
import type {
  ASPECT_RATIOS,
  DISPLAY,
  HORIZONTAL_ALIGNMENTS,
  WIDTHS,
} from '@/types/component-props';

import { LayoutGrid } from './LayoutGrid';
import { MCImage } from './mc-ui/mcImage';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './shadcn-ui/carousel';

type BaseProps = {
  aspectRatio?: Extract<ASPECT_RATIOS, '16-9' | '4-3' | 'original'>;
  caption?: string;
  width?: Extract<WIDTHS, '3/4' | 'full'>;
  alignment?: HORIZONTAL_ALIGNMENTS;
};

type ImageData = {
  imageUrl: string;
  alt?: string;
  width: number;
  height: number;
};

type ImageCarouselInternalItemProps = BaseProps & {
  image: ImageData;
};

type ImageCarouselInternalProps = {
  numberOfVisibleImages: 1 | 2 | 3 | 4 | 5 | 6;
  images: ImageCarouselInternalItemProps[];
  display?: DISPLAY;
};

type ImageCarouselProps = BaseProps & {
  numberOfVisibleImages: number;
  images: ImageCarouselType['images'];
  display?: DISPLAY;
};

const isValidNumberOfVisibleImages = (
  value: number
): value is 2 | 3 | 4 | 5 | 6 => {
  return [2, 3, 4, 5, 6].includes(value);
};

export const ImageCarousel = ({
  numberOfVisibleImages,
  images,
  display,
}: ImageCarouselProps) => {
  const processedImages = images
    .map((image) => ({
      image: processImage(image.image as ExtendedSanityImageType),
    }))
    .filter((image) => image.image) as ImageCarouselInternalItemProps[];

  const validNumberOfVisibleImages = isValidNumberOfVisibleImages(
    numberOfVisibleImages
  )
    ? numberOfVisibleImages
    : 2;

  return (
    <ImageCarouselInternal
      numberOfVisibleImages={validNumberOfVisibleImages}
      images={processedImages}
      display={display}
    />
  );
};

export default ImageCarousel;

// Internal component to be used in storybook. For the production projects use ImageSelector component.
export const ImageCarouselInternal = ({
  numberOfVisibleImages,
  display = 'fullbleedMobileOnly',
  images,
}: ImageCarouselInternalProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);

  return (
    <LayoutGrid display={display}>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className='col-span-full grid grid-cols-12 [&_div]:col-span-full sm:[&_div]:col-span-8 sm:[&_div]:col-start-3'
      >
        <CarouselContent
          className={cn('mb-2', {
            'cursor-grabbing': isDragging,
            'cursor-grab:': !isDragging,
          })}
        >
          {images.map((item, index) => (
            <CarouselItem
              key={index}
              onMouseDown={handleDragStart}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              className={cn({
                'basis-1/2': numberOfVisibleImages === 2,
                'basis-1/3': numberOfVisibleImages === 3,
                'basis-1/4': numberOfVisibleImages === 4,
                'basis-1/5': numberOfVisibleImages === 5,
                'basis-1/6': numberOfVisibleImages === 6,
              })}
            >
              <div className='h-full'>
                <MCImage
                  image={item.image}
                  className='object-cover [&_img]:aspect-[3/4]'
                  sizes='(max-width: 768px) 250px, (max-width: 1200px) 50vw'
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='col-start-1 row-start-2 ml-3 sm:row-start-1 md:ml-0' />
        <CarouselNext className='col-start-12 row-start-2 mr-3 justify-self-end sm:row-start-1 md:mr-0' />
        <div className='row-start-2 flex w-full items-center justify-center text-center'>
          <span className='font-atica text-sm uppercase'>
            {images.length} images
          </span>
        </div>
      </Carousel>
    </LayoutGrid>
  );
};
