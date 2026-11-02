'use client';

import { vercelStegaClean } from '@vercel/stega';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';

import type { ExtendedSanityImageType } from '@/lib/utils';
import { cn, processImage } from '@/lib/utils';
import {
  getVimeoVideoDimensions,
  type VimeoVideoDimensions,
} from '@/lib/vimeo-utils';
import { urlForVideo } from '@/sanity/lib/assets';
import type { ScrollOverlay as ScrollOverlayType } from '@/sanity/types';

type ImageData = {
  imageUrl: string;
  alt?: string;
  width: number;
  height: number;
};

type ImageDataInternal = {
  image: ImageData;
};

type BaseProps = {
  mediaType?: ScrollOverlayType['mediaType'];
  videoSource?: ScrollOverlayType['videoSource'];
  videoUrl?: ScrollOverlayType['videoUrl'];
  videoMobileUrl?: ScrollOverlayType['videoMobileUrl'];
  vimeoVideoDimensionsDesktop?: VimeoVideoDimensions;
  vimeoVideoDimensionsMobile?: VimeoVideoDimensions;
};

type ScrollOverlayInternalProps = BaseProps & {
  image?: ImageDataInternal;
  overlayImage?: ImageDataInternal;
  videoFile?: string;
  videoMobileFile?: string;
};

type ScrollOverlayProps = BaseProps & {
  image?: ScrollOverlayType['image'];
  overlayImage?: ScrollOverlayType['overlayImage'];
  videoFile?: ScrollOverlayType['videoFile'];
  videoMobileFile?: ScrollOverlayType['videoMobileFile'];
};

export const ScrollOverlayInternal = ({
  mediaType,
  image,
  videoSource,
  videoFile,
  videoMobileFile,
  videoUrl,
  videoMobileUrl,
  overlayImage,
}: ScrollOverlayInternalProps) => {
  const [isClient, setIsClient] = useState(false);
  const [videoIsLoading, setVideoIsLoading] = useState(true);
  const [videoMobileIsLoading, setVideoMobileIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerIsInView = useInView(containerRef);

  const videoDesktop = videoSource === 'file' ? videoFile : videoUrl;
  const videoMobile = videoSource === 'file' ? videoMobileFile : videoMobileUrl;
  const [vimeoDesktopDimensions, setVimeoDesktopDimensions] =
    useState<VimeoVideoDimensions>({
      width: 1920,
      height: 1080,
    });
  const [vimeoMobileDimensions, setVimeoMobileDimensions] =
    useState<VimeoVideoDimensions>({
      width: 1920,
      height: 1080,
    });

  useEffect(() => {
    const fetchData = async () => {
      const { desktopDimensions, mobileDimensions } =
        await getVimeoVideoDimensions(videoUrl, videoMobileUrl);
      setVimeoDesktopDimensions(desktopDimensions);
      setVimeoMobileDimensions(mobileDimensions);
    };
    fetchData();
  }, [videoUrl, videoMobileUrl]);

  /**
   * Sets the `isClient` state to true after the component mounts.
   */
  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderImage = () => {
    if (!image) return null;

    return (
      <Image
        src={image.image.imageUrl || ''}
        alt={image.image.alt || ''}
        fill
        className='absolute z-30 object-cover'
        sizes='100vw'
        priority
      />
    );
  };
  const renderOverlay = () => {
    if (!overlayImage) return null;

    return (
      <Image
        src={overlayImage.image.imageUrl || ''}
        alt={overlayImage.image.alt || ''}
        fill
        className='absolute w-full object-cover'
        sizes='100vw'
        priority
      />
    );
  };

  /**
   * When the player signals that it is ready:
   * - If it is a mobile player, it configures the mobile iframe dimensions using the mobile video dimensions and sets the mobile loading flag to false.
   * - If it is a desktop player, it configures the desktop iframe dimensions using the desktop video dimensions and sets the desktop loading flag to false.
   */
  const handleIsReady = (isMobilePlayer: boolean) => {
    const iframeIndex = isMobilePlayer ? 0 : 1;
    const dimensions = isMobilePlayer
      ? vimeoMobileDimensions
      : vimeoDesktopDimensions;
    const setLoadingFlag = isMobilePlayer
      ? setVideoMobileIsLoading
      : setVideoIsLoading;

    if (videoSource === 'url') {
      const iframe = document.getElementsByTagName('iframe')[iframeIndex];
      if (iframe) {
        configureIframe(iframe, {
          width: dimensions.width,
          height: dimensions.height,
        });
      }
    }
    setLoadingFlag(false);
  };

  /**
   * Configure an iframe with the specified dimensions and styles it for proper display.
   *
   * This function calculates the aspect ratio based on the given dimensions, sets the iframe
   * size and position accordingly, and ensures it is centered within its parent element.
   *
   */
  function configureIframe(
    iframe: HTMLIFrameElement,
    dimensions: VimeoVideoDimensions
  ) {
    if (!iframe) {
      return;
    }

    const { aspectWidth, aspectHeight } = calculateAspectRatio(
      dimensions.width,
      dimensions.height
    );

    const iframeWrapperWidth = 100;
    const iframeWrapperHeight = 100;

    const videoWidth = iframeWrapperWidth;
    const videoHeight = (aspectHeight / aspectWidth) * iframeWrapperHeight;

    const videoMinWidth = (aspectWidth / aspectHeight) * iframeWrapperWidth;
    const videoMinHeight = iframeWrapperHeight;

    // Set iframe dimensions
    Object.assign(iframe.style, {
      width: `${videoWidth}vw`,
      height: `${videoHeight}vw`,
      minWidth: `${videoMinWidth}vh`,
      minHeight: `${videoMinHeight}vh`,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      objectPosition: 'center',
    });

    // Configure iframe wrapper
    const iframeWrapper = iframe.parentElement;
    if (iframeWrapper) {
      Object.assign(iframeWrapper.style, {
        padding: '0',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
      });
    }
  }

  /**
   * Computes the greatest common divisor (GCD) of two numbers using the Euclidean algorithm.
   */
  function gcd(a: number, b: number) {
    if (b === 0) {
      return a;
    }
    return gcd(b, a % b);
  }

  function calculateAspectRatio(width: number, height: number) {
    const commonDivisor = gcd(width, height);
    const aspectWidth = width / commonDivisor;
    const aspectHeight = height / commonDivisor;

    return { aspectWidth, aspectHeight };
  }

  const renderVideo = () => {
    if (!videoDesktop) return null;

    return (
      <div>
        {videoIsLoading && (
          <div className='absolute inset-0 z-10 flex items-center justify-center'>
            <p className='uppercase text-foreground'>loading...</p>
          </div>
        )}
        {isClient && (
          <>
            {videoMobile && (
              <ReactPlayer
                url={videoMobile ?? ''}
                playing={!videoMobileIsLoading}
                playsinline
                muted={true}
                controls={false}
                autoPlay={true}
                onReady={() => handleIsReady(true)}
                loop={false}
                width='100%'
                height='100%'
                config={{
                  vimeo: {
                    playerOptions: {
                      responsive: 'true',
                    },
                  },
                }}
                className={cn(
                  'z-10 max-h-none w-auto min-w-full max-w-none items-center overflow-hidden object-cover md:hidden [&>video]:object-cover [&>video]:object-center'
                )}
              />
            )}
            <ReactPlayer
              url={videoDesktop ?? ''}
              playing={!videoIsLoading && containerIsInView}
              playsinline
              muted={true}
              controls={false}
              autoPlay={true}
              onReady={() => handleIsReady(false)}
              loop={false}
              width='100%'
              height='100%'
              className={cn(
                'absolute z-30 max-h-none min-h-full w-auto min-w-full max-w-none object-cover [&>video]:object-cover',

                {
                  'max-md:hidden': videoMobile,
                }
              )}
              config={{
                vimeo: {
                  playerOptions: {
                    responsive: true,
                  },
                },
              }}
            />
          </>
        )}
      </div>
    );
  };

  const overlayFadeKeyFrameStart = 0.0;
  const overlayFadeKeyFrameEnd = 1.0;

  const overlayRangeStart = 0.0;
  const overlayRangeEnd = 1.0;

  const overlayOpacityStart = 1.0;
  const overlayOpacityEnd = 0.0;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: [overlayFadeKeyFrameStart, overlayFadeKeyFrameEnd],
  });

  const overlayOpacity = useTransform(
    scrollYProgress,
    [overlayRangeStart, overlayRangeEnd],
    [overlayOpacityStart, overlayOpacityEnd]
  );

  const playerScale = useTransform(
    scrollYProgress,
    [overlayRangeStart, overlayRangeEnd],
    [1.0, 0.75]
  );

  return (
    <motion.div
      ref={containerRef}
      className={cn(`flex-co bg-background-blueGray relative flex h-[250lvh]`)}
    >
      {/*
       * Overlay Container
       */}
      <motion.div className='sticky top-0 z-40 size-full'>
        {/**
         * Media
         */}
        <motion.div
          className='sticky top-0 h-lvh overflow-hidden'
          style={{
            scale: playerScale,
          }}
        >
          {mediaType === 'video' && renderVideo()}
          {mediaType === 'images' && renderImage()}
        </motion.div>
        {/*
         * Image
         */}
        <motion.div
          className='sticky bottom-0 z-50 h-[150lvh] w-lvw'
          style={{
            opacity: overlayOpacity,
          }}
        >
          {renderOverlay()}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export const ScrollOverlay: FC<ScrollOverlayProps> = ({
  mediaType,
  image,
  videoSource,
  videoFile,
  videoMobileFile,
  videoUrl,
  videoMobileUrl,
  overlayImage,
}) => {
  const processedImage = {
    image: processImage(image?.image as ExtendedSanityImageType) as ImageData,
    aspectRatio: image?.aspectRatio,
  } as ImageDataInternal;

  const processedOverlayImage = {
    image: processImage(
      overlayImage?.image as ExtendedSanityImageType
    ) as ImageData,
    aspectRatio: image?.aspectRatio,
  } as ImageDataInternal;

  const video = urlForVideo(videoFile?.asset);
  const videoMobile = urlForVideo(videoMobileFile?.asset);

  const cleanedMediaType = vercelStegaClean(mediaType);
  const cleanedVideoSource = vercelStegaClean(videoSource);

  return (
    <ScrollOverlayInternal
      mediaType={cleanedMediaType}
      image={processedImage}
      videoSource={cleanedVideoSource}
      videoUrl={videoUrl}
      videoMobileUrl={videoMobileUrl}
      videoFile={video ?? ''}
      videoMobileFile={videoMobile ?? ''}
      overlayImage={processedOverlayImage}
    />
  );
};
