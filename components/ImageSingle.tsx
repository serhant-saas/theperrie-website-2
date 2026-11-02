import { getImageDimensions } from '@sanity/asset-utils';
import { vercelStegaClean } from '@vercel/stega';
import React from 'react';

import { cn } from '@/lib/utils';
import { urlForImage } from '@/sanity/lib/assets';
import type { ImageSingle as ImageSingleType } from '@/sanity/types';
import type {
  ASPECT_RATIOS,
  DISPLAY,
  HORIZONTAL_ALIGNMENTS,
  TEXT_COLORS,
  WIDTHS,
} from '@/types/component-props';

import { LayoutGrid } from './LayoutGrid';
import { MCImage } from './mc-ui/mcImage';

type BaseProps = {
  aspectRatio?: Extract<ASPECT_RATIOS, '16-9' | '4-3' | 'original'>;
  caption?: string;
  width?: Extract<WIDTHS, '2/3' | '3/4' | 'full' | '5/6'>;
  alignment?: HORIZONTAL_ALIGNMENTS;
  display?: DISPLAY;
  textColor?: TEXT_COLORS;
};

type ImageData = {
  imageUrl: string;
  alt?: string;
  width: number;
  height: number;
};

type ImageSingleInternalProps = BaseProps & {
  image: ImageData;
};

// Internal component to be used in storybook. For the production projects use ImageSingle component.
export const ImageSingleInternal = ({
  image,
  aspectRatio = 'original',
  caption,
  width = '3/4',
  alignment = 'left',
  display = 'fullbleedMobileOnly',
  textColor = 'default',
}: ImageSingleInternalProps) => {
  const isAspectRatio = aspectRatio !== 'original';

  return (
    <LayoutGrid display={display}>
      <MCImage
        image={image}
        caption={caption}
        textColor={textColor}
        fill={isAspectRatio}
        className={cn(
          'col-span-full font-atica text-base uppercase sm:text-2xl',
          {
            'lg:col-span-8': width === '2/3',
            'lg:col-span-9': width === '3/4',
            'lg:col-start-1': alignment === 'left',
            'lg:col-start-2': alignment === 'center' && width === '3/4',
            'lg:col-start-3': alignment === 'center' && width === '2/3',
            'lg:col-end-13': alignment === 'right',
            'aspect-[16/9]': aspectRatio === '16-9',
            'aspect-[4/3]': aspectRatio === '4-3',
            'relative overflow-hidden': isAspectRatio,
          }
        )}
        style={isAspectRatio ? { objectFit: 'cover' } : undefined}
      />
    </LayoutGrid>
  );
};

type ImageSingleProps = BaseProps & {
  image: ImageSingleType['image'];
};

export const ImageSingle = ({
  image,
  aspectRatio,
  caption,
  width,
  alignment,
  display,
  textColor = 'default',
}: ImageSingleProps) => {
  if (!image?.asset) return null;

  const { asset, alt } = image;

  const imageUrl = urlForImage(asset);
  const { width: imageWidth, height: imageHeight } = getImageDimensions(asset);

  const cleanedAspectRatio = vercelStegaClean(aspectRatio);
  const cleanedAlignment = vercelStegaClean(alignment);
  const cleanedWidth = vercelStegaClean(width);
  const cleanedDisplay = vercelStegaClean(display);
  const cleanedTextColor = vercelStegaClean(textColor);

  return (
    <ImageSingleInternal
      image={{
        imageUrl,
        width: imageWidth,
        height: imageHeight,
        alt,
      }}
      aspectRatio={cleanedAspectRatio}
      caption={caption}
      width={cleanedWidth}
      alignment={cleanedAlignment}
      display={cleanedDisplay}
      textColor={cleanedTextColor}
    />
  );
};

export default ImageSingle;
