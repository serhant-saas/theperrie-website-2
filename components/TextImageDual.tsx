import { PortableText } from '@portabletext/react';
import { vercelStegaClean } from '@vercel/stega';
import React from 'react';

import type { ExtendedSanityImageType } from '@/lib/utils';
import { cn, processImage } from '@/lib/utils';
import type {
  ImageObject as ImageObjectType,
  RichText as RichTextType,
} from '@/sanity/types';
import type {
  ASPECT_RATIOS,
  DISPLAY,
  VERTICAL_ALIGNMENTS,
} from '@/types/component-props';

import { LayoutGrid } from './LayoutGrid';
import { MCImage } from './mc-ui/mcImage';
import { RichText } from './mc-ui/richText';

type TextImageDualProps = {
  text: RichTextType;
  firstImage: ImageObjectType;
  secondImage: ImageObjectType;
  layout?: 'left' | 'right';
  verticalAlignment: VERTICAL_ALIGNMENTS;
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

type TextImageDualInternalProps = {
  text: RichTextType;
  firstImage: ImageDataInternal;
  secondImage: ImageDataInternal;
  layout?: 'left' | 'right';
  verticalAlignment: VERTICAL_ALIGNMENTS;
  display?: DISPLAY;
};

export const TextImageDualInternal: React.FC<TextImageDualInternalProps> = ({
  text,
  firstImage,
  secondImage,
  layout,
  verticalAlignment,
  display = 'fullbleedMobileOnly',
}) => {
  const cleanedFirstImageAspectRatio = vercelStegaClean(firstImage.aspectRatio);
  const cleanedSecondImageAspectRatio = vercelStegaClean(
    secondImage.aspectRatio
  );
  const cleanedLayout = vercelStegaClean(layout);
  const cleanedVerticalAlignment = vercelStegaClean(verticalAlignment);
  const cleanedDisplay = vercelStegaClean(display);

  const isLeftAligned = cleanedLayout === 'left';
  const isAspectRatio1 = cleanedFirstImageAspectRatio !== 'original';
  const isAspectRatio2 = cleanedSecondImageAspectRatio !== 'original';

  return (
    <LayoutGrid display={cleanedDisplay}>
      <div
        className={cn(
          'z-text col-span-full row-start-2 lg:col-span-4 lg:row-start-1 lg:ml-4 lg:max-w-[523px]',
          // 'font-default md:text-base md:leading-[132.5%] lg:text-lg lg:leading-[132.5%] 2xl:text-xl',
          'font-default text-mobile md:text-desktop',
          'pb-8 md:pb-0',
          {
            'lg:order-last': !isLeftAligned,
            'px-3 md:px-0': cleanedDisplay === 'fullbleedMobileOnly',
          }
        )}
      >
        <RichText text={text} />
      </div>
      <MCImage
        className={cn('z-image col-span-6 row-start-1 lg:col-span-4', {
          'aspect-[16/9]': cleanedFirstImageAspectRatio === '16-9',
          'aspect-[4/3]': cleanedFirstImageAspectRatio === '4-3',
          'aspect-[9/16]': cleanedFirstImageAspectRatio === '9-16',
          'aspect-[3/4]': cleanedFirstImageAspectRatio === '3-4',
          'self-start': cleanedVerticalAlignment === 'top',
          'self-center': cleanedVerticalAlignment === 'center',
          'self-end': cleanedVerticalAlignment === 'bottom',
          'relative overflow-hidden [&_img]:object-cover': isAspectRatio1,
        })}
        fill={isAspectRatio1}
        image={firstImage.image}
      />
      <MCImage
        className={cn('z-image col-span-6 row-start-1 lg:col-span-4', {
          'aspect-[16/9]': cleanedSecondImageAspectRatio === '16-9',
          'aspect-[4/3]': cleanedSecondImageAspectRatio === '4-3',
          'aspect-[9/16]': cleanedSecondImageAspectRatio === '9-16',
          'aspect-[3/4]': cleanedSecondImageAspectRatio === '3-4',
          'self-start': cleanedVerticalAlignment === 'top',
          'self-center': cleanedVerticalAlignment === 'center',
          'self-end': cleanedVerticalAlignment === 'bottom',
          'relative overflow-hidden [&_img]:object-cover': isAspectRatio2,
        })}
        fill={isAspectRatio2}
        image={secondImage.image}
      />
    </LayoutGrid>
  );
};
export const TextImageDual: React.FC<TextImageDualProps> = ({
  text,
  firstImage,
  secondImage,
  layout,
  verticalAlignment,
}) => {
  const processedFirstImage = {
    image: processImage(
      firstImage.image as ExtendedSanityImageType
    ) as ImageData,
    aspectRatio: firstImage.aspectRatio,
  } as ImageDataInternal;

  const processedSecondImage = {
    image: processImage(
      secondImage.image as ExtendedSanityImageType
    ) as ImageData,
    aspectRatio: secondImage.aspectRatio,
  } as ImageDataInternal;

  return (
    <TextImageDualInternal
      text={text}
      firstImage={processedFirstImage}
      secondImage={processedSecondImage}
      layout={layout}
      verticalAlignment={verticalAlignment}
    />
  );
};
