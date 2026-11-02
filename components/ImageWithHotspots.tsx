'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

import type { ExtendedSanityImageType } from '@/lib/utils';
import { cn, processImage } from '@/lib/utils';
import type { ImageWithHotspots as ImageWithHotspotsType } from '@/sanity/types';

import { LayoutGrid } from './LayoutGrid';
import type { ImageData } from './mc-ui/mcImage';

// import { MediaCaption } from './mc-ui/mediaCaption';

type Hotspot = {
  details: string;
  x: number;
  y: number;
};

type HotspotButtonProps = {
  hotspot: Hotspot;
  activeHotspot: Hotspot | null;
  handleHotspotClick: (hotspot: Hotspot) => void;
};

type ImageWithHotspotsProps = {
  image: ImageData;
  hotspots: Hotspot[];
};

const HotspotButton: React.FC<HotspotButtonProps> = ({
  hotspot,
  handleHotspotClick,
  activeHotspot,
}) => {
  const isActive = hotspot === activeHotspot;
  const ringClass =
    'animate-image-with-hotspots-ping absolute inset-0 rounded-full border border-hotspot';

  return (
    <button
      key={`${hotspot.x}-${hotspot.y}`}
      aria-label={`Hotspot for ${hotspot.details}`}
      type='button'
      name='Hotspot'
      onClick={() => handleHotspotClick(hotspot)}
      className={cn(
        'absolute m-0 size-4 rounded-full border border-solid border-hotspot p-0 transition-all duration-300',
        // 'hidden md:block',
        { 'size-6 cursor-default bg-hotspot': isActive }
      )}
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className={ringClass}
        style={{
          content: '',
          position: 'absolute',
          inset: '-6px',
          zIndex: 0,
        }}
      ></div>
      <div
        className={ringClass}
        style={{
          content: '""',
          position: 'absolute',
          inset: '-12px',
          zIndex: -1,
        }}
      ></div>
    </button>
  );
};

export const ImageWithHotspotsInternal: React.FC<ImageWithHotspotsProps> = ({
  hotspots,
  image,
}) => {
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const isInView = useInView(detailsRef, { amount: 'all' });
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(
    hotspots[0]
  );
  const [activeTextHeight, setActiveTextHeight] = useState(0);

  const sortedHotspots = [...hotspots].sort((a, b) => {
    if (a.y === b.y) {
      return a.x - b.x;
    }
    return a.y - b.y;
  });

  const handleHotspotClick = (hotspot: Hotspot) => {
    setActiveHotspot(hotspot);

    // Scroll to details when is not in view and hotspot is clicked
    // if (!isInView) {
    //   const current = detailsRef.current;
    //   if (!current) return;
    //   current.scrollIntoView({ behavior: 'smooth' });
    // }
  };

  useEffect(() => {
    textRefs.current = textRefs.current.slice(0, hotspots.length);

    const calculateActiveHeight = () => {
      if (!activeHotspot) return;

      const activeIndex = hotspots.indexOf(activeHotspot);
      const activeRef = textRefs.current[activeIndex];
      if (activeRef) {
        setActiveTextHeight(activeRef?.clientHeight);
      }
    };

    calculateActiveHeight();
  }, [hotspots, activeHotspot]);

  return (
    <LayoutGrid>
      <div className='sticky top-4 col-span-12 overflow-hidden pt-4 max-md:order-2 md:col-span-4 md:pt-0 xl:col-span-3'>
        <div
          ref={detailsRef}
          className='items-center transition-all md:flex md:h-full'
          // className='hidden h-full items-center transition-all md:flex'
          style={{
            minHeight: activeTextHeight,
          }}
        >
          {/* <AnimatePresence> */}
          {hotspots.map((hotspot, i) => (
            <motion.p
              key={i}
              ref={(el) => {
                textRefs.current[i] = el;
              }}
              className={cn(
                'absolute opacity-0 2xl:mr-10',
                'font-default text-lg leading-[120%]'
              )}
              animate={{
                opacity: hotspot === activeHotspot ? 1 : 0,
                x: hotspot === activeHotspot ? 0 : 20,
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              {hotspot.details}
            </motion.p>
          ))}
          {/* </AnimatePresence> */}
        </div>
      </div>

      <div className='col-span-12 md:col-span-5 md:col-start-8 xl:col-start-5'>
        <div className='relative'>
          {/** Can't use MCImage here because Hotspots need to be wrapped with a relative container  */}
          <Image
            src={image.imageUrl}
            alt='Hotspot Image'
            className='h-auto w-full'
            width={630}
            height={694}
          />
          {sortedHotspots.map((hotspot, index) => (
            <HotspotButton
              key={index}
              handleHotspotClick={handleHotspotClick}
              activeHotspot={activeHotspot}
              hotspot={hotspot}
            />
          ))}
        </div>
      </div>
    </LayoutGrid>
  );
};

export const ImageWithHotspots: React.FC<ImageSelectorProps> = ({
  hotspots,
  hotspotImage,
}) => {
  const processedImage = processImage(
    hotspotImage as ExtendedSanityImageType
  ) as ImageData;

  return (
    <ImageWithHotspotsInternal
      hotspots={hotspots?.map((e) => e as Hotspot) ?? []}
      image={processedImage}
    />
  );
};

type ImageSelectorProps = {
  hotspotImage: ImageWithHotspotsType['hotspotImage'];
  hotspots: ImageWithHotspotsType['hotspots'];
};
