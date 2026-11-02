import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export type LogoProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const Logo = ({ src, alt, width, height }: LogoProps) => {
  return (
    <Link href='/' className='block max-w-max'>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority
        className='cursor-pointer object-contain'
      />
    </Link>
  );
};
