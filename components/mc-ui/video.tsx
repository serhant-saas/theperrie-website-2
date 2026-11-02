'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';

// import ReactPlayer from 'react-player';
import { cn } from '@/lib/utils';
import type { ASPECT_RATIOS } from '@/types/component-props';

import { MediaCaption } from './mediaCaption';

// Dynamic import to avoid hydration issues
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

export type Settings = {
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
};

export type VideoProps = {
  src: string | string[];
  settings?: Settings;
  aspectRatio?: Extract<ASPECT_RATIOS, '16-9' | '4-3' | 'original'>;
  caption?: string;
  className?: string;
  loop?: boolean;
};

export const Video = ({
  src,
  settings,
  caption,
  aspectRatio,
  className,
}: VideoProps) => {
  const [play, setPlay] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setPlay(entry.isIntersecting);
      },
      {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    const player = playerRef?.current;

    if (player) {
      observer.observe(player);
    }

    return () => {
      if (player) {
        observer.unobserve(player);
      }
    };
  }, []);

  return (
    <div className={className}>
      <div
        ref={playerRef}
        className={cn({
          'aspect-[4/3]': aspectRatio === '4-3',
          'aspect-video': aspectRatio === '16-9',
        })}
      >
        <ReactPlayer
          url={src}
          playsinline
          playing={play}
          width='100%'
          height='100%'
          {...settings}
        />
      </div>
      {caption && <MediaCaption text={caption} />}
    </div>
  );
};
