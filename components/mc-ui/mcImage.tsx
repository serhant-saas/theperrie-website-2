import Image from 'next/image';
import React from 'react';

import { TEXT_COLORS } from '@/types/component-props';

import { LayoutGrid } from '../LayoutGrid';
import { MediaCaption } from './mediaCaption';

export type ImageData = {
  imageUrl: string;
  alt?: string;
  width: number;
  height: number;
};

export type SanityImageProps = React.HTMLAttributes<HTMLDivElement> & {
  image: ImageData;
  sizes?: string;
  caption?: string;
  fill?: boolean;
  textColor?: TEXT_COLORS;
};

export const MCImage = ({
  sizes,
  image,
  caption,
  fill,
  className,
  style,
  textColor,
}: SanityImageProps) => {
  const { imageUrl, width, height, alt } = image;

  return (
    <div className={className} style={style}>
      <Image
        src={imageUrl}
        alt={alt || ''}
        className={'h-auto w-full'}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw'}
        fill={fill}
      />
      {caption && (
        <LayoutGrid>
          <div className='col-span-full'>
            <MediaCaption text={caption} color={textColor} />
          </div>
        </LayoutGrid>
      )}
    </div>
  );
};
