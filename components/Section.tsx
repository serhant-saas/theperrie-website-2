'use client';
import { vercelStegaClean } from '@vercel/stega';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import React, { useRef } from 'react';

import { cn, ExtendedSanityImageType, processImage } from '@/lib/utils';
import { ImageObject as ImageObjectType } from '@/sanity/types';
import { BACKGROUND_COLORS, backgroundClass } from '@/types/component-props';

import { MediaCaption } from './mc-ui/mediaCaption';

type SectionSpace = 'none' | 'small' | 'medium' | 'large';

type SectionProps = {
  id?: string;
  spaceTop?: SectionSpace;
  spaceBottom?: SectionSpace;
  background?: BACKGROUND_COLORS;
  children: React.ReactNode;
  overlayImage?: ImageObjectType;
  overlayImageStartingPosition?: number;
  overlayImageEndingPosition?: number;
};

type SectionOverlayProps = {
  overlayImage: ImageObjectType;
  overlayImageStartingPosition: number;
  overlayImageEndingPosition: number;
  sectionRef: React.RefObject<HTMLDivElement>;
};

const SectionOverlay: React.FC<SectionOverlayProps> = ({
  overlayImage,
  overlayImageStartingPosition,
  overlayImageEndingPosition,
  sectionRef,
}) => {
  const processedOverlayImage = overlayImage.image
    ? processImage(overlayImage.image as ExtendedSanityImageType)
    : undefined;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const overlayYStart = `${overlayImageStartingPosition}%`;
  const overlayYEnd = `${overlayImageEndingPosition}%`;

  const overlayY = useTransform(
    scrollYProgress,
    [0.0, 1.0],
    [overlayYStart, overlayYEnd]
  );
  const overlayOpacity = useTransform(scrollYProgress, [0.0, 1.0], [1.0, 0.0]);

  if (!processedOverlayImage) return null;

  return (
    <motion.div
      className={cn('absolute top-0 z-overlay h-lvh w-lvw')}
      style={{
        y: overlayY,
        opacity: overlayOpacity,
      }}
    >
      <Image
        src={processedOverlayImage.imageUrl || ''}
        alt={processedOverlayImage.alt || ''}
        fill
        className='absolute object-cover'
        sizes='100vw'
        aria-disabled
      />
      {overlayImage.image?.caption && (
        <div className='absolute bottom-0 right-0 -translate-x-full translate-y-full font-atica text-base uppercase sm:text-2xl'>
          <MediaCaption
            text={overlayImage.image.caption}
            color={overlayImage.image.textColor}
          />
        </div>
      )}
    </motion.div>
  );
};

export const Section: React.FC<SectionProps> = ({
  id,
  spaceTop = 'large',
  spaceBottom = 'large',
  background,
  children,
  overlayImage,
  overlayImageStartingPosition = 50,
  overlayImageEndingPosition = -50,
}) => {
  const cleanedSpaceTop = vercelStegaClean(spaceTop);
  const cleanedSpaceBottom = vercelStegaClean(spaceBottom);
  const cleanedBackground = vercelStegaClean(background);

  const spaceTopClass = {
    none: 'pt-0',
    small: 'pt-3 md:pt-6',
    medium: 'pt-4 md:pt-10',
    large: 'pt-8 md:pt-20',
  }[cleanedSpaceTop];

  const spaceBottomClass = {
    none: 'pb-0',
    small: 'pb-3 md:pb-6',
    medium: 'pb-4 md:pb-10',
    large: 'pb-8 md:pb-20',
  }[cleanedSpaceBottom];

  const sectionClass = cleanedBackground
    ? backgroundClass[cleanedBackground]
    : '';

  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative flex flex-col gap-mobile space-y-0 md:gap-desktop ${sectionClass} ${spaceTopClass} ${spaceBottomClass}`}
    >
      {children}
      {overlayImage?.image && (
        <SectionOverlay
          overlayImage={overlayImage}
          overlayImageStartingPosition={overlayImageStartingPosition}
          overlayImageEndingPosition={overlayImageEndingPosition}
          sectionRef={sectionRef}
        />
      )}
    </section>
  );
};
