import { format } from 'date-fns';
import Image from 'next/image';
import React from 'react';

import { cn } from '@/lib/utils';
import { urlForImage } from '@/sanity/lib/assets';
import type { PressArticle as PressArticleType } from '@/sanity/types';

import Arrow from '../public/dir_arrow.svg';
import ArrowInverted from '../public/dir_arrow_inverted.svg';

type ArticleProps = {
  featuredImage?: PressArticleType['featuredImage'] | null;
  url: PressArticleType['url'];
  file: string;
  title: PressArticleType['title'];
  publisher: PressArticleType['publisher'];
  publishedAt: PressArticleType['publishedAt'];
} & React.HTMLAttributes<HTMLDivElement>;

export const Article = ({
  featuredImage,
  url,
  file,
  title,
  publisher,
  publishedAt,
  className,
}: ArticleProps) => {
  if (!featuredImage) return null;

  const { asset, alt } = featuredImage;

  if (!asset) return null;

  const teaserImageUrl = urlForImage(asset);
  const formattedDate = format(new Date(publishedAt!), 'PPP');

  return (
    <div
      className={cn(
        'flex h-fit flex-col gap-mobile md:gap-desktop',
        `${className}`
      )}
    >
      <div className='relative h-3/5 w-full'>
        <a href={url} target='_blank' rel='noopener noreferrer'>
          <div className='group/url relative h-[444px] w-full overflow-hidden'>
            <Image
              src={teaserImageUrl || ''}
              alt={title}
              fill
              className={cn(
                'absolute object-cover',
                'transition-transform duration-500 group-hover/url:scale-105'
              )}
            />
          </div>
        </a>
      </div>
      <div className='flex min-h-[250px] flex-col gap-mobile sm:justify-between sm:gap-desktop'>
        <div className='flex flex-col gap-mobile md:gap-desktop'>
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='group/url'
          >
            <p
              className={cn(
                'relative group-hover/url:underline',
                'line-clamp-3 font-atica text-mobile uppercase md:text-desktop'
              )}
            >
              {title}
            </p>
          </a>
          <div className='relative'>
            <span>
              {publisher}, {formattedDate}
            </span>
          </div>
        </div>

        {/** DOWNLOAD */}
        <div className='z-text flex w-fit flex-col gap-mobile md:gap-desktop'>
          <a
            href={file}
            target='_blank'
            rel='noopener noreferrer'
            className='group/download w-fit'
          >
            <div className='relative size-16'>
              <Image
                alt={alt ?? ''}
                src={Arrow}
                quality={100}
                fill
                className={cn(
                  'absolute -rotate-90',
                  'opacit-100 transition-opacity duration-300 group-hover/download:opacity-0'
                )}
              />
              <Image
                alt={alt ?? ''}
                src={ArrowInverted}
                quality={100}
                fill
                className={cn(
                  'absolute -rotate-90',
                  'opacity-0 transition-opacity duration-300 group-hover/download:opacity-100'
                )}
              />
            </div>
          </a>

          <a
            href={file}
            target='_blank'
            rel='noopener noreferrer'
            className='group/download w-fit'
          >
            <span
              className={cn(
                'group-hover/download:underline',
                'font-atica text-mobile uppercase md:text-desktop'
              )}
            >
              Download PDF
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};
