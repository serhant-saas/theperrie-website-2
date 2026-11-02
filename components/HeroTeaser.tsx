'use client';

import { vercelStegaClean } from '@vercel/stega';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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
import type { HeroTeaser as HeroTeaserType } from '@/sanity/types';
import { Button, buttonVariants } from '@/shadcnui/button';

import AudioIcon from '../public/neighborhood-icons/PERRIE_Neighborhood_Icons_Nine.svg';
import { LayoutGrid } from './LayoutGrid';

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
  mediaType?: HeroTeaserType['mediaType'];
  arrows?: HeroTeaserType['arrows'];
  slideshowInterval?: HeroTeaserType['slideshowInterval'];
  videoSource?: HeroTeaserType['videoSource'];
  videoUrl?: HeroTeaserType['videoUrl'];
  videoMobileUrl?: HeroTeaserType['videoMobileUrl'];
  vimeoVideoDimensionsDesktop?: VimeoVideoDimensions;
  vimeoVideoDimensionsMobile?: VimeoVideoDimensions;
  loop: HeroTeaserType['loop'];
  showVolumeToggle: HeroTeaserType['showVolumeToggle'];
  callToAction?: {
    href: string;
    label: string;
  };
};

type HeroTeaserInternalProps = BaseProps & {
  images?: ImageDataInternal[];
  videoFile?: string;
  videoMobileFile?: string;
};

type HeroTeaserProps = BaseProps & {
  images?: HeroTeaserType['images'];
  videoFile?: HeroTeaserType['videoFile'];
  videoMobileFile?: HeroTeaserType['videoMobileFile'];
};

const HeroTeaserButton = ({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className='flex size-12 items-center justify-center rounded-full border border-foreground bg-white transition-colors duration-200 hover:bg-foreground hover:text-white'
      {...props}
    >
      {children}
    </button>
  );
};

export const HeroTeaserInternal = ({
  mediaType,
  images = [],
  arrows = false,
  slideshowInterval = 3000,
  videoSource,
  videoFile,
  videoMobileFile,
  videoUrl,
  videoMobileUrl,
  loop,
  showVolumeToggle,
  callToAction,
}: HeroTeaserInternalProps) => {
  const [isClient, setIsClient] = useState(false);
  const [videoIsLoading, setVideoIsLoading] = useState(true);
  const [videoMobileIsLoading, setVideoMobileIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const imageIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const desktopPlayer = useRef<ReactPlayer>(null);
  const mobilePlayer = useRef<ReactPlayer>(null);

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

  /**
   * Sets up and manages an image slideshow if media type is 'images'.
   *
   * Starts a slideshow if there are multiple images and the slideshowInterval is non-zero.
   * The current image index is updated at the specified interval. Cleans up the
   * interval on component unmount or dependency change.
   */
  useEffect(() => {
    if (mediaType !== 'images') return;

    if (images && images.length > 1 && slideshowInterval !== 0) {
      imageIntervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, slideshowInterval);
    }

    return () => {
      if (imageIntervalRef.current) {
        clearInterval(imageIntervalRef.current);
      }
    };
  }, [images, slideshowInterval, arrows, mediaType]);

  const renderImages = () => {
    if (!images || images.length === 0) return null;

    if (images.length === 1) {
      return (
        <Image
          src={images[0].image.imageUrl || ''}
          alt={images[0].image.alt || ''}
          fill
          className='absolute z-30 object-cover'
          sizes='100vw'
          priority
        />
      );
    }

    return (
      <div className='absolute inset-0 z-30 max-h-none min-h-full w-auto min-w-full max-w-none object-cover'>
        {images.map((image, index) => (
          <Image
            key={index}
            src={image.image.imageUrl || ''}
            alt={image.image.imageUrl || ''}
            fill
            className={cn(
              'absolute inset-0 object-cover transition-opacity duration-1000',
              {
                'opacity-0': index !== currentImageIndex,
                'opacity-1': index === currentImageIndex,
              }
            )}
            sizes='100vw'
          />
        ))}
        {arrows && (
          <div className='absolute bottom-7 right-7 flex gap-2'>
            <HeroTeaserButton
              onClick={() => {
                setCurrentImageIndex(
                  (prevIndex) =>
                    (prevIndex - 1 + images!.length) % images!.length
                );
              }}
            >
              <ChevronLeft />
            </HeroTeaserButton>
            <HeroTeaserButton
              onClick={() => {
                setCurrentImageIndex(
                  (prevIndex) => (prevIndex + 1) % images!.length
                );
              }}
            >
              <ChevronRight />
            </HeroTeaserButton>
          </div>
        )}
      </div>
    );
  };

  /**
   * When the player signals that it is ready:
   * - If it is a mobile player, it configures the mobile iframe dimensions using the mobile video dimensions and sets the mobile loading flag to false.
   * - If it is a desktop player, it configures the desktop iframe dimensions using the desktop video dimensions and sets the desktop loading flag to false.
   */
  const handleIsReady = (isMobilePlayer: boolean) => {
    const dimensions = isMobilePlayer
      ? vimeoMobileDimensions
      : vimeoDesktopDimensions;
    const setLoadingFlag = isMobilePlayer
      ? setVideoMobileIsLoading
      : setVideoIsLoading;

    if (videoSource === 'url') {
      let iframe;
      if (!isMobilePlayer && desktopPlayer.current) {
        iframe = desktopPlayer.current.getInternalPlayer().element;
      } else if (isMobilePlayer && mobilePlayer.current) {
        iframe = mobilePlayer.current.getInternalPlayer().element;
      }

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
      <>
        {videoIsLoading && (
          <div className='absolute inset-0 z-10 flex items-center justify-center'>
            <p className='uppercase text-foreground'>loading...</p>
          </div>
        )}
        {isClient && (
          <>
            {videoMobile && (
              <ReactPlayer
                ref={mobilePlayer}
                url={videoMobile ?? ''}
                playing={!videoMobileIsLoading}
                playsinline
                muted={muted}
                controls={false}
                autoPlay={true}
                onReady={() => handleIsReady(true)}
                loop={loop}
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
                  'absolute z-image max-h-none w-auto min-w-full max-w-none overflow-hidden object-cover md:hidden [&>video]:object-cover [&>video]:object-center'
                )}
              />
            )}
            <ReactPlayer
              ref={desktopPlayer}
              url={videoDesktop ?? ''}
              playing={!videoIsLoading}
              playsinline
              muted={muted}
              controls={false}
              autoPlay={true}
              onReady={() => handleIsReady(false)}
              loop={loop}
              width='100%'
              height='100%'
              className={cn(
                'absolute z-image max-h-none min-h-full w-auto min-w-full max-w-none object-cover [&>video]:object-cover',

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
            <LayoutGrid fullbleed className='absolute bottom-0'>
              {/** Mute toggle */}
              {showVolumeToggle && (
                <Button
                  className={cn(
                    'relative bottom-6 z-text col-span-2 flex items-end rounded-full bg-transparent hover:bg-transparent md:col-span-1',
                    'size-9 md:size-16',
                    {
                      'animate-pulse': muted,
                    }
                  )}
                  onClick={() => setMuted(!muted)}
                >
                  <Image
                    alt='An icon showing illustrated sound waves.'
                    src={AudioIcon}
                    quality={100}
                    fill
                    className='absolute'
                  />
                  <span className='sr-only'>Toggle audio</span>
                </Button>
              )}
            </LayoutGrid>
          </>
        )}
      </>
    );
  };

  return (
    <div
      className={cn(
        `relative flex h-[calc(100svh-40px)] w-full flex-col overflow-hidden sm:h-[calc(100svh-88px)] md:h-[calc(100svh-96px)]`
      )}
    >
      <div
        className={cn('relative h-full overflow-hidden', {
          'h-[calc(100svh-40px)] sm:h-[calc(100svh-88px)]':
            callToAction?.href === '',
          'h-[calc(100svh-40px-76px)] md:h-[calc(100svh-88px-92px)]':
            callToAction?.href !== '',
        })}
      >
        {mediaType === 'video' && renderVideo()}
        {mediaType === 'images' && renderImages()}
      </div>
      {callToAction && callToAction?.label !== '' && (
        <div className='flex w-full justify-center py-4 md:py-6'>
          <Link
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'rounded-3xl border-foreground bg-white font-atica font-normal uppercase text-foreground hover:border-white hover:bg-foreground hover:text-white'
            )}
            href={callToAction.href}
          >
            {callToAction.label}
          </Link>
        </div>
      )}
    </div>
  );
};

export const HeroTeaser: FC<HeroTeaserProps> = ({
  mediaType,
  images = [],
  arrows = false,
  slideshowInterval = 4000,
  videoSource,
  videoFile,
  videoMobileFile,
  videoUrl,
  videoMobileUrl,
  loop,
  showVolumeToggle,
  callToAction,
}) => {
  const processedImages: ImageDataInternal[] = images.map((image) => ({
    image: processImage(image as ExtendedSanityImageType) as ImageData,
  }));

  const video = urlForVideo(videoFile?.asset);
  const videoMobile = urlForVideo(videoMobileFile?.asset);

  const cleanedMediaType = vercelStegaClean(mediaType);
  const cleanedVideoSource = vercelStegaClean(videoSource);

  return (
    <HeroTeaserInternal
      mediaType={cleanedMediaType}
      images={processedImages}
      arrows={arrows}
      callToAction={callToAction}
      slideshowInterval={slideshowInterval}
      videoSource={cleanedVideoSource}
      videoUrl={videoUrl}
      videoMobileUrl={videoMobileUrl}
      videoFile={video ?? ''}
      videoMobileFile={videoMobile ?? ''}
      loop={loop}
      showVolumeToggle={showVolumeToggle}
    />
  );
};
