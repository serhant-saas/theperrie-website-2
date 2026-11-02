'use client';

import { vercelStegaClean } from '@vercel/stega';
import React from 'react';

import type { ExtendedSanityImageType } from '@/lib/utils';
import { cn, processImage } from '@/lib/utils';
import type {
  ImageObject as ImageObjectType,
  RichText as RichTextType,
} from '@/sanity/types';
import type { ASPECT_RATIOS, DISPLAY } from '@/types/component-props';

import { LayoutGrid } from './LayoutGrid';
import { MCImage } from './mc-ui/mcImage';
import { RichText } from './mc-ui/richText';

type TextImageSingleProps = {
  text: RichTextType;
  image: ImageObjectType;
  layout?: 'left' | 'right';
  imageLayout?: 'vertical' | 'horizontal';
  display?: DISPLAY;
};

type ImageData = {
  imageUrl: string;
  alt?: string;
  width: number;
  height: number;
};

type ImageDataInternal = {
  image: ImageData;
  aspectRatio: ASPECT_RATIOS | '9-16' | '3-4';
};

type TextImageSingleInternalProps = {
  text: RichTextType;
  image: ImageDataInternal;
  layout?: 'left' | 'right';
  imageLayout?: 'vertical' | 'horizontal';
  display?: DISPLAY;
};

export const TextImageSingleInternal: React.FC<
  TextImageSingleInternalProps
> = ({
  text,
  image,
  layout,
  imageLayout = 'vertical',
  display = 'fullbleedMobileOnly',
}) => {
  const cleanedLayout = vercelStegaClean(layout);
  const cleanedImageLayout = vercelStegaClean(imageLayout);
  const cleanedAspectRatio = vercelStegaClean(image.aspectRatio);
  const cleanedDisplay = vercelStegaClean(display);

  const isLeftAligned = cleanedLayout === 'left';
  const isAspectRatio = cleanedAspectRatio !== 'original';

  return (
    <div className='relative'>
      <LayoutGrid
        display='fullbleedMobileOnly'
        className='relative justify-between'
      >
        <div
          className={cn(
            'z-text lg:max-w-[523px] lg:py-4',
            'col-span-full row-start-2 lg:col-span-4 lg:row-start-1',
            // 'font-default md:text-base md:leading-[132.5%] lg:text-lg lg:leading-[132.5%] 2xl:text-xl',
            'font-default text-mobile md:text-desktop',
            'pb-8 md:pb-0',
            {
              'lg:col-start-9': !isLeftAligned,
              'px-3 md:px-0': cleanedDisplay === 'fullbleedMobileOnly',
            }
          )}
        >
          <RichText text={text} />
        </div>
        <MCImage
          className={cn('z-image col-span-full lg:col-span-5', {
            'aspect-[16/9]': cleanedAspectRatio === '16-9',
            'aspect-[4/3]': cleanedAspectRatio === '4-3',
            'aspect-[9/16]': cleanedAspectRatio === '9-16',
            'aspect-[3/4]': cleanedAspectRatio === '3-4',
            'relative overflow-hidden [&_img]:object-cover': isAspectRatio,
            'lg:col-start-8':
              isLeftAligned && cleanedImageLayout === 'vertical',
            'lg:col-span-8': cleanedImageLayout === 'horizontal',
          })}
          fill={isAspectRatio}
          image={image.image}
        />
      </LayoutGrid>
    </div>
  );
};
export const TextImageSingle: React.FC<TextImageSingleProps> = ({
  text,
  image,
  layout,
  imageLayout,
  display,
}) => {
  const processedImage = {
    image: processImage(image.image as ExtendedSanityImageType) as ImageData,
    aspectRatio: image.aspectRatio,
  } as ImageDataInternal;

  return (
    <TextImageSingleInternal
      text={text}
      image={processedImage}
      layout={layout}
      imageLayout={imageLayout}
      display={display}
    />
  );
};
