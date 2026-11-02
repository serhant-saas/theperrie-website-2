import type {
  SanityImageAsset,
  SanityImageCrop,
  SanityImageHotspot,
} from '@sanity/asset-utils';
import { getImageDimensions } from '@sanity/asset-utils';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { urlForImage } from '@/sanity/lib/assets';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ExtendedSanityImageType = {
  asset?: SanityImageAsset;
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
  alt?: string;
  caption?: string;
  _type: 'image';
};

export const processImage = (image: ExtendedSanityImageType) => {
  if (!image?.asset) return null;

  const { asset, alt } = image;

  const imageUrl = urlForImage(asset);

  const { width: imageWidth, height: imageHeight } = getImageDimensions(asset);

  return {
    imageUrl,

    width: imageWidth,
    height: imageHeight,
    alt,
  };
};

export function formatDate(dateString: string): string | null {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(dateString)) {
    console.error('Invalid date string:', dateString);
    return null;
  }

  const [year, month, day] = dateString.split('-');
  const shortYear = year.slice(-2);
  return `${month}/${day}/${shortYear}`;
}
