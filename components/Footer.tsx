'use client';

import { vercelStegaClean } from '@vercel/stega';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import type {
  FooterMenuType,
  FooterNavigationColumnType,
  FooterNavigationType,
} from '@/lib/footer-utils';
import {
  MultiLinkType,
  NavigationItemType,
  OffCanvasNavigationColumnType,
  SingleLinkType,
} from '@/lib/off-canvas-navigation-utils';
import { cn } from '@/lib/utils';

import InstagramIcon from '../public/Instagram_Icon.svg';
import { LayoutGrid } from './LayoutGrid';
import { Text } from './mc-ui/text';
import { Section } from './Section';
import {
  AccordionBuilder,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './shadcn-ui/accordion';

export type NavigationColumnProps = {
  key: string;
  column: FooterNavigationColumnType;
  handleRouteChange: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  params: any;
};

export type NavItemProps = {
  item: NavigationItemType;
  index: number;
  handleRouteChange: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  params: any;
};

type FooterNavigationProps = FooterNavigationType & {
  allpages: OffCanvasNavigationColumnType[];
};

const NavigationItem = ({
  index,
  item,
  handleRouteChange,
  params,
}: NavItemProps) => {
  switch (item.type) {
    case 'singleLinkNavigationItem': {
      const singleLinkItem = item.item as SingleLinkType;
      return (
        <li key={index}>
          <Link
            href={singleLinkItem.link}
            key={index}
            onClick={!singleLinkItem.newTab ? handleRouteChange : undefined}
            target={singleLinkItem.newTab ? '_blank' : undefined}
            rel={singleLinkItem.newTab ? 'noopener noreferrer' : undefined}
          >
            <span
              className={cn(
                params.slug?.at(0) === singleLinkItem.link && 'underline'
              )}
            >
              {singleLinkItem.label}
            </span>
          </Link>
        </li>
      );
    }
    case 'multiLinkNavigationItem': {
      const multiLinkItem = item.item as MultiLinkType;
      return (
        <AccordionBuilder
          type='single'
          collapsible
          className='w-fit'
          key={index}
          // Set Accordion to default open when it matches the current URL
          defaultValue={
            params.slug?.at(0) === multiLinkItem.label ? 'item-1' : ''
          }
        >
          <AccordionItem value='item-1' className='border-none'>
            <div className='flex space-x-4'>
              <AccordionTrigger className='flex-row-reverse gap-3 py-0 font-normal hover:no-underline'>
                <span>{multiLinkItem.label}</span>
              </AccordionTrigger>
            </div>
            <AccordionContent className='ml-8 flex flex-col space-y-2 p-2'>
              {multiLinkItem.items?.map((nestedItem, index) => {
                return (
                  <Link
                    href={nestedItem.link}
                    key={index}
                    className='hover:cursor-pointer'
                    onClick={!nestedItem.newTab ? handleRouteChange : undefined}
                    target={nestedItem.newTab ? '_blank' : undefined}
                    rel={nestedItem.newTab ? 'noopener noreferrer' : undefined}
                  >
                    <span
                      className={cn(
                        'hover:cursor-pointer',
                        params.slug?.at(0) === nestedItem.link && 'underline'
                      )}
                    >
                      {nestedItem.label}
                    </span>
                  </Link>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        </AccordionBuilder>
      );
    }
  }
};

const NavigationColumn = ({
  column,
  handleRouteChange,
  params,
}: NavigationColumnProps) => (
  <ul
    key={column.key}
    className='font-atica text-xs uppercase leading-[20.5px] md:text-base md:leading-[26px]'
  >
    {column.items?.map((item, i) => (
      <NavigationItem
        key={item.item.label}
        index={i}
        item={item}
        handleRouteChange={handleRouteChange}
        params={params}
      />
    ))}
  </ul>
);

export const FooterMenu = ({ columns }: FooterMenuType) => {
  const router = useRouter();
  const params = useParams();

  const handleRouteChange = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const route = e.currentTarget.href;
    router.push(route);
  };

  return (
    <div>
      {columns?.map((column) => {
        return (
          <div key={column.key}>
            <NavigationColumn
              key={column.key}
              column={column}
              handleRouteChange={handleRouteChange}
              params={params}
            />
          </div>
        );
      })}
    </div>
  );
};

export const FooterNavigation = ({
  address,
  columns,
  furtherLinks,
  miscellaneousText,
  instagramUrl,
  legalText,
  allpages,
}: FooterNavigationProps) => {
  const { slug } = useParams();

  // const [nextPage, setNextPage] = useState(allpages.at(0)?.items.at(1)?.item.label.toLowerCase());
  const [nextPage, setNextPage] = useState('residences');

  useEffect(() => {
    /**
     * Find next slug in navigation list
     */
    const allSlugsCleaned = allpages
      .at(0)
      ?.items.map((e) => vercelStegaClean(e?.item.label.toLowerCase()));

    const currentSlug = slug ? slug.at(0) : allSlugsCleaned?.at(0);

    const currentSlugIndex = allSlugsCleaned?.indexOf(currentSlug ?? '');
    const nextSlug = allSlugsCleaned?.at((currentSlugIndex ?? 0) + 1);

    if (nextSlug === 'building & amenities') {
      setNextPage('home');
    } else {
      setNextPage(nextSlug ?? 'home');
    }
  }, [allpages, slug]);

  const isEmail = (text: string) =>
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text);
  const containsNumbers = (text: string) => /\d/.test(text);

  const renderText = (
    addressLine: { text?: string; uppercase?: boolean },
    i: number
  ) => {
    const { text } = addressLine;
    const commonClasses = cn(
      'font-atica text-xs leading-[20.5px] md:text-base md:leading-[26px] block max-w-max',
      {
        uppercase: addressLine.uppercase,
      }
    );

    let href;
    if (isEmail(text ?? '')) {
      href = `mailto:${text}`;
    } else if (containsNumbers(text ?? '')) {
      href = `tel:${text}`;
    }

    return href ? (
      <a key={i} href={href} className={commonClasses}>
        {text}
      </a>
    ) : (
      <span key={i} className={commonClasses}>
        {text}
      </span>
    );
  };

  return (
    <footer>
      <Section spaceBottom='small' spaceTop='small'>
        <LayoutGrid className='space-y-0 md:gap-0'>
          <div className='col-span-12 flex justify-between'>
            <div>
              {address.map((addressLine, i) => renderText(addressLine, i))}
            </div>
            <div className='text-right'>
              <Link href={nextPage}>
                <Text
                  className={cn(
                    'font-atica text-xs uppercase leading-[20.5px] md:text-base md:leading-[26px]',
                    'relative',
                    'after:absolute after:bottom-[23px] after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-foreground after:transition-transform after:duration-700 after:ease-out after:content-[""] md:after:bottom-[4px]',
                    'hover/next:after:scale-x-100'
                  )}
                >
                  View {nextPage} <br className='md:hidden' />
                  <span
                    className={cn(
                      'relative font-atica text-xs uppercase leading-[20.5px] md:text-base md:leading-[26px]',
                      'inline-block',
                      'after:absolute after:bottom-[3px] after:left-0 after:h-[1px] after:w-full after:bg-foreground after:content-[""] md:after:bottom-[4px]'
                    )}
                  >
                    next
                  </span>
                </Text>
              </Link>
            </div>
          </div>

          <div className='col-span-12'>
            <FooterMenu columns={columns} />
          </div>

          <div className='col-span-12 flex w-full flex-col justify-between gap-mobile md:flex-row'>
            <Text className='font-atica text-xs uppercase leading-[20.5px] md:text-base md:leading-[26px]'>
              {furtherLinks.map((item, i) => {
                return (
                  <Link key={i} href={item.link}>
                    <span
                      className={cn({
                        uppercase: item.uppercase,
                      })}
                    >
                      {item.link}
                      {i !== furtherLinks.length - 1 && <span>, </span>}
                    </span>
                  </Link>
                );
              })}
              <br />
              <span>{miscellaneousText}</span>
            </Text>

            <a href={instagramUrl} target='_blank' rel='noopener noreferrer'>
              <div className='relative size-9'>
                <Image
                  alt='Background stencil'
                  src={InstagramIcon}
                  quality={100}
                  fill
                  className='absolute'
                />
              </div>
            </a>
          </div>

          <div className='col-span-12 lg:col-span-6'>
            <Text className='mt-8 font-atica text-[10px] uppercase md:mt-16 md:text-xs'>
              {legalText}
            </Text>
          </div>
        </LayoutGrid>
      </Section>
    </footer>
  );
};
