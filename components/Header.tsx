import Link from 'next/link';
import React from 'react';

import { LayoutGrid } from './LayoutGrid';
import { Logo } from './Logo';
import { Button } from './shadcn-ui/button';

type HeaderProps = {
  props?: any;
};

export const Header: React.FC<HeaderProps> = ({}) => {
  return (
    <>
      <header className='absolute top-0 z-40 w-full bg-white py-2'>
        <LayoutGrid>
          <div className='col-span-12 flex justify-between py-0'>
            <div className='flex flex-grow basis-0 items-center'>
              <div className='block md:hidden'>
                <Logo
                  src='/monogram-perrie.svg'
                  alt='Monogram of The Perrie'
                  width={42}
                  height={42}
                />
              </div>
              <div className='hidden md:block'>
                <Logo
                  src='/monogram-perrie.svg'
                  alt='Monogram of The Perrie'
                  width={64}
                  height={64}
                />
              </div>
            </div>
            <div className='flex items-center'>
              <div className='block md:hidden'>
                <Logo
                  src='/logo-perrie.svg'
                  alt='Logo of The Perrie'
                  width={46}
                  height={33}
                />
              </div>
              <div className='hidden md:block'>
                <Logo
                  src='/logo-perrie.svg'
                  alt='Logo of The Perrie'
                  width={70}
                  height={50}
                />
              </div>
            </div>
            <div className='flex flex-grow basis-0 items-center justify-end'>
              <Link href={'/contact'}>
                <span className='font-atica text-sm uppercase md:text-base'>
                  Register
                </span>
              </Link>
            </div>
          </div>
        </LayoutGrid>
      </header>
    </>
  );
};
