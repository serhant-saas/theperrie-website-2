'use client';

import dynamic from 'next/dynamic';

import type { NeighborhoodMapProps } from './NeighborhoodMap';

const NeighborhoodMap = dynamic(
  () =>
    import('@/components/NeighborhoodMap').then((mod) => mod.NeighborhoodMap),
  { ssr: false }
);

export const NeighborhoodMapLoader = (props: NeighborhoodMapProps) => {
  return <NeighborhoodMap {...props} />;
};
