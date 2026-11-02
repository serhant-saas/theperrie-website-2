'use client';

import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import { FocusScope } from '@radix-ui/react-focus-scope';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import type {
  MultiLinkType,
  NavigationItemType,
  OffCanvasNavigationColumnType,
  OffCanvasNavigationType,
  SingleLinkType,
} from '@/lib/off-canvas-navigation-utils';
import { cn } from '@/lib/utils';

import green from '../public/header-backgrounds/Green_EEDDEE.png';
import lightBlue from '../public/header-backgrounds/Light_Blue_E7E0D8.png';
import orange from '../public/header-backgrounds/Orange_E2E0B2.png';
import paleHazelnut from '../public/header-backgrounds/PaleHazelnut_E7E0D8.png';
import peach from '../public/header-backgrounds/Peach_C4D9DF.png';
import Monogram from '../public/monogram-perrie.svg';
import { LayoutGrid } from './LayoutGrid';
import {
  AccordionBuilder,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './shadcn-ui/accordion';
import { Button } from './shadcn-ui/button';

type NavItemProps = {
  item: NavigationItemType;
  index: number;
  handleRouteChange: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  params: any;
};

type NavigationColumnProps = {
  key: string;
  column: OffCanvasNavigationColumnType;
  handleRouteChange: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  params: any;
};

type MenuToggleButtonProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const NavigationItem = ({ item, handleRouteChange, params }: NavItemProps) => {
  switch (item.type) {
    case 'singleLinkNavigationItem': {
      const singleLinkItem = item.item as SingleLinkType;

      return (
        <li
          key={singleLinkItem.key}
          className='decoration-2 underline-offset-4 transition-colors hover:underline hover:duration-300 sm:underline-offset-8'
        >
          <Link
            href={singleLinkItem.link || ''}
            onClick={!singleLinkItem.newTab ? handleRouteChange : undefined}
            target={singleLinkItem.newTab ? '_blank' : undefined}
            rel={singleLinkItem.newTab ? 'noopener noreferrer' : undefined}
          >
            <span
              className={cn(
                params.slug?.at(0) === singleLinkItem.link &&
                  'underline decoration-1',
                // 'font-atica text-2xl font-medium uppercase tracking-normal sm:text-6xl',
                'font-atica text-navigation-mobile uppercase md:text-navigation-desktop',
                {
                  uppercase: singleLinkItem.uppercase,
                }
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
          key={multiLinkItem.label}
          defaultValue={
            params.slug?.at(0) === multiLinkItem.label ? 'item-1' : ''
          }
        >
          <AccordionItem value='item-1' className='border-none'>
            <div className='flex space-x-4'>
              <AccordionTrigger className='flex-row-reverse gap-3 py-0 font-medium tracking-normal hover:no-underline'>
                <span>{multiLinkItem.label}</span>
              </AccordionTrigger>
            </div>
            <AccordionContent className='ml-8 flex flex-col space-y-2 p-2'>
              {multiLinkItem.items?.map((nestedItem, index) => {
                return (
                  <Link
                    href={nestedItem.link || ''}
                    key={index}
                    className='hover:cursor-pointer'
                    onClick={!nestedItem.newTab ? handleRouteChange : undefined}
                    target={nestedItem.newTab ? '_blank' : undefined}
                    rel={nestedItem.newTab ? 'noopener noreferrer' : undefined}
                  >
                    <span
                      className={cn(
                        'font-medium tracking-normal hover:cursor-pointer',
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

const NavigationButton = ({ newTab, label, link }: SingleLinkType) => (
  <Button
    variant={'outline'}
    asChild
    className='relative z-50 rounded-full border-foreground bg-transparent py-5'
  >
    <Link
      className='font-default text-[11px]'
      href={link || ''}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
    >
      {label.toUpperCase()}
    </Link>
  </Button>
);

const MenuToggleButton = ({ isOpen, setIsOpen }: MenuToggleButtonProps) => (
  <Button
    variant={'outline'}
    onClick={() => setIsOpen(!isOpen)}
    className='relative inset-0 z-50 flex h-7 w-11 flex-col items-center justify-center overflow-y-clip border-none bg-transparent px-4 py-2 hover:bg-transparent md:px-8 md:py-4'
  >
    <span
      className={cn(
        'absolute block translate-y-0 transition-transform duration-500 ease-in-out',
        'font-atica text-buttons-mobile uppercase md:text-buttons-desktop',
        {
          '-translate-y-full': isOpen,
        }
      )}
    >
      Menu
    </span>
    <span
      className={cn(
        'absolute block translate-y-0 transition-transform duration-500 ease-in-out',
        'font-atica text-buttons-mobile uppercase md:text-buttons-desktop',
        {
          'translate-y-full': !isOpen,
        }
      )}
    >
      Close
    </span>
  </Button>
);

const NavigationColumn = ({
  column,
  handleRouteChange,
  params,
}: NavigationColumnProps) => (
  <ul key={column.key} className='flex flex-col space-y-2'>
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

type OffCanvasMenuProps = {
  columns: OffCanvasNavigationColumnType[];
  handleRouteChange: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  params: any;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const OffCanvasMenu = ({
  columns,
  handleRouteChange,
  params,
  setIsOpen,
}: OffCanvasMenuProps) => (
  <LayoutGrid className='h-full'>
    {columns?.map((column) => {
      return (
        <div
          key={column.key}
          className='col-span-full flex h-full items-center justify-center text-center'
        >
          <button
            onClick={() => setIsOpen(false)}
            className='absolute right-3 top-4 font-atica text-base uppercase md:right-8 md:top-10'
          >
            close
          </button>
          <NavigationColumn
            key={column.key}
            column={column}
            handleRouteChange={handleRouteChange}
            params={params}
          />
        </div>
      );
    })}
  </LayoutGrid>
);

const BACKGROUNDS: StaticImageData[] = [
  green,
  lightBlue,
  orange,
  peach,
  paleHazelnut,
];

export const OffCanvasNavigation = ({
  columns,
  highlightedLink,
  announcements,
}: OffCanvasNavigationType) => {
  const router = useRouter();
  const params = useParams();

  const [hasScrolled, setHasScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const offCanvasRef = useRef<HTMLDivElement>(null);

  const [currentBackground, setCurrentBackground] = useState<StaticImageData>(
    BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]
  );

  const handleRouteChange = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const route = e.currentTarget.href;
    setIsOpen(false);
    router.push(route);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      setCurrentBackground(
        BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]
      );
    }

    return () => {
      document.body.style.overflow = 'scroll';
    };
  }, [isOpen]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 70) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function Background() {
    return (
      <>
        <Image
          alt='Background stencil'
          src={green}
          quality={100}
          fill
          sizes='100vw'
          style={{
            objectFit: 'cover',
            opacity: currentBackground === green ? 1 : 0,
          }}
        />
        <Image
          alt='Background stencil'
          src={orange}
          quality={100}
          fill
          sizes='100vw'
          style={{
            objectFit: 'cover',
            opacity: currentBackground === orange ? 1 : 0,
          }}
        />
        <Image
          alt='Background stencil'
          src={lightBlue}
          quality={100}
          fill
          sizes='100vw'
          style={{
            objectFit: 'cover',
            opacity: currentBackground === lightBlue ? 1 : 0,
          }}
        />
        <Image
          alt='Background stencil'
          src={peach}
          quality={100}
          fill
          sizes='100vw'
          style={{
            objectFit: 'cover',
            opacity: currentBackground === peach ? 1 : 0,
          }}
        />
        <Image
          alt='Background stencil'
          src={paleHazelnut}
          quality={100}
          fill
          sizes='100vw'
          style={{
            objectFit: 'cover',
            opacity: currentBackground === paleHazelnut ? 1 : 0,
          }}
        />
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          'sticky top-0 z-[120] transition-transform duration-300',
          {
            '-translate-y-[70px]': hasScrolled,
          }
        )}
      >
        <div
          className={cn('w-full bg-white transition-colors duration-700', {
            'bg-background-green': isOpen && currentBackground === green,
            'bg-background-lightBlue':
              isOpen && currentBackground === lightBlue,
            'bg-background-orange': isOpen && currentBackground === orange,
            'bg-background-peach': isOpen && currentBackground === peach,
            'bg-background-teal': isOpen && currentBackground === paleHazelnut,
          })}
        >
          {announcements?.announcementAboveHeader && (
            <div
              className={cn(
                'flex h-[70px] w-full items-center justify-center overflow-hidden truncate text-ellipsis border-y border-foreground bg-background-beige p-4 text-center font-atica text-2xl uppercase text-foreground transition-all md:text-3xl'
              )}
            >
              {announcements?.announcementAboveHeader}
            </div>
          )}
          <nav>
            <LayoutGrid>
              <div className='col-span-12 flex items-center justify-between py-1 md:py-3'>
                <div className='relative z-50 w-1/3'>
                  <Link
                    href='/'
                    className={cn(
                      'relative col-span-2 block md:col-span-1',
                      'size-9 md:size-16'
                    )}
                  >
                    <Image
                      alt='Monogram of The Perrie'
                      src={Monogram}
                      quality={100}
                      fill
                      className='absolute'
                    />
                  </Link>
                </div>
                <div className='col-span-4 flex w-1/3 justify-center'>
                  {/* <div className='hidden sm:block'>
                <Logo
                  src='/PERRIE_Logo_web.svg'
                  alt='Logo of The Perrie'
                  width={70}
                  height={50}
                />
              </div>
              <div className='block sm:hidden'>
                <Logo
                  src='/PERRIE_Logo_web.svg'
                  alt='Logo of The Perrie'
                  width={49}
                  height={35}
                />
              </div> */}
                  <Link
                    href='/'
                    className={cn(
                      'relative col-span-2 block md:col-span-1',
                      'size-12 md:size-[72px]'
                    )}
                  >
                    <Image
                      alt='Logo of The Perrie'
                      src='/PERRIE_Logo_web.svg'
                      quality={100}
                      fill
                      className='absolute'
                    />
                  </Link>
                </div>
                <div className='flex w-1/3 justify-end gap-4'>
                  {highlightedLink && (
                    <NavigationButton
                      link={highlightedLink.link}
                      newTab={highlightedLink.newTab}
                      label={highlightedLink.label}
                      key={highlightedLink.key}
                      uppercase={highlightedLink.uppercase}
                    />
                  )}
                  <div tabIndex={-1}>
                    <MenuToggleButton isOpen={isOpen} setIsOpen={setIsOpen} />
                  </div>
                </div>
              </div>
            </LayoutGrid>
          </nav>
          {announcements?.announcementBelowHeader && (
            <div className='relative overflow-hidden whitespace-pre border-y border-foreground py-4 text-center font-atica'>
              <span
                className='inline-block'
                style={{
                  animation: 'marquee 15s linear infinite',
                }}
              >
                {announcements?.announcementBelowHeader}
              </span>
              <style jsx>{`
                @keyframes marquee {
                  0% {
                    transform: translateX(100%);
                  }
                  100% {
                    transform: translateX(-100%);
                  }
                }
              `}</style>
            </div>
          )}
        </div>
      </div>
      <FocusScope
        trapped={isOpen}
        loop={isOpen}
        onMountAutoFocus={(e) => e.preventDefault()}
      >
        <DismissableLayer
          role='dialog'
          aria-label='Off Canvas Navigation'
          onEscapeKeyDown={() => setIsOpen(false)}
          className='relative z-[200] w-fit'
        >
          {isClient && (
            <div
              ref={offCanvasRef}
              className={cn(
                'invisible fixed inset-x-0 top-0 z-[100] h-lvh w-lvw bg-popover opacity-0 transition-all duration-700',
                isOpen && 'visible opacity-100',
                {
                  'bg-background-green': currentBackground === green,
                  'bg-background-lightBlue': currentBackground === lightBlue,
                  'bg-background-orange': currentBackground === orange,
                  'bg-background-peach': currentBackground === peach,
                  'bg-background-teal': currentBackground === paleHazelnut,
                }
              )}
            >
              <div className='absolute bottom-0 -z-10 h-dvh w-full'>
                <Background />
              </div>
              <OffCanvasMenu
                columns={columns}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                handleRouteChange={handleRouteChange}
                params={params}
              />
            </div>
          )}
        </DismissableLayer>
      </FocusScope>
    </>
  );
};
