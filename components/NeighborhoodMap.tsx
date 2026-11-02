'use client';

import 'leaflet/dist/leaflet.css';

import {
  createLeafletContext,
  type LeafletContextInterface,
  LeafletProvider,
} from '@react-leaflet/core';
import { type SanityImageSource } from '@sanity/asset-utils';
import { vercelStegaClean } from '@vercel/stega';
import type {
  LatLngBoundsExpression,
  LatLngTuple,
  MapOptions,
  PointExpression,
} from 'leaflet';
import L from 'leaflet';
import { PinIcon } from 'lucide-react';
import Image from 'next/image';
import {
  type ReactNode,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ImageOverlay,
  Marker,
  TileLayer,
  Tooltip,
  ZoomControl,
} from 'react-leaflet';

import { cn } from '@/lib/utils';
import { urlForImage } from '@/sanity/lib/assets';
import type { NeighborhoodMap as NeighborhoodMapType } from '@/sanity/types';

import Eight from '../public/neighborhood-icons/PERRIE_Neighborhood_Icons_Eight.svg';
import { LayoutGrid } from './LayoutGrid';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './shadcn-ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './shadcn-ui/select';

type MapMarkerType = {
  pin: Pin;
  animate: boolean;
};

type PinIcon = {
  svgIcon?: string;
  anchor?: string;
  showTooltipOnMobile?: boolean;
};

type Pin = {
  lat: number;
  lng: number;
  title: string;
  pinIcon?: PinIcon;
};

export type NeighborhoodMapProps = {
  logo: NeighborhoodMapType['logo'];
  data: NeighborhoodMapType['data'];
  mapImage: NeighborhoodMapType['mapImage'];
};

const getSVGDimensions = (
  svgString: string
): { width: number; height: number } => {
  const viewBoxMatch = svgString.match(/viewBox=["']([^"']+)["']/i);

  if (viewBoxMatch?.[1]) {
    const [, , width, height] = viewBoxMatch[1]
      .trim()
      .split(/[\s,]+/)
      .map(Number);

    if (Number.isFinite(width) && Number.isFinite(height)) {
      return { width, height };
    }
  }

  const widthMatch = svgString.match(/width=["']([\d.]+)(?:px)?["']/i);
  const heightMatch = svgString.match(/height=["']([\d.]+)(?:px)?["']/i);

  return {
    width: Number(widthMatch?.[1]) || 100,
    height: Number(heightMatch?.[1]) || 100,
  };
};

function calculateAnchor(
  width: number,
  height: number,
  pinIconAnchor?: string
) {
  let anchor: PointExpression;

  switch (pinIconAnchor) {
    case 'center':
      anchor = [width / 2, height / 2];
      break;
    case 'topLeft':
      anchor = [0, 0];
      break;
    case 'topRight':
      anchor = [width, 0];
      break;
    case 'bottomLeft':
      anchor = [0, height];
      break;
    case 'bottomRight':
      anchor = [width, height];
      break;
    default:
      anchor = [0, 0];
  }

  return anchor;
}

type LeafletMapProps = MapOptions & {
  children: ReactNode;
  className?: string;
};

const LeafletMap = ({ children, className, ...options }: LeafletMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [context, setContext] = useState<LeafletContextInterface | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = L.map(container, options);
    setContext(createLeafletContext(map));

    return () => {
      map.remove();
    };
    // Map options are not reactive; match react-leaflet MapContainer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {context ? (
        <LeafletProvider value={context}>{children}</LeafletProvider>
      ) : null}
    </div>
  );
};

export const NeighborhoodMap = ({
  logo,
  data,
  mapImage,
}: NeighborhoodMapProps) => {
  const categories = data ?? [];
  const firstCategory = categories.at(0);
  const [activePin, setActivePin] = useState('');
  const [activeCategory, setActiveCategory] = useState(
    firstCategory?.name ?? ''
  );

  const imageUrl = urlForImage(mapImage as SanityImageSource);

  const mapBounds: LatLngBoundsExpression = [
    [40.766456150708, -73.98529449185841],
    [40.74137355061533, -73.95814895762682],
  ];

  const MapMarker = ({ pin, animate }: MapMarkerType) => {
    const markerRef = useRef(null);

    const eventHandlers = useMemo(
      () => ({
        mouseover() {
          setActivePin(pin.title);
        },
        mouseout() {
          setActivePin('');
        },
      }),
      [pin.title]
    );

    if (!pin.pinIcon?.svgIcon) return null;

    const position = [pin.lat, pin.lng] as LatLngTuple;
    const { width, height } = getSVGDimensions(pin.pinIcon.svgIcon);
    const cleanedAnchor = vercelStegaClean(pin.pinIcon.anchor);

    const anchor = calculateAnchor(width, height, cleanedAnchor);

    const icon = L.divIcon({
      className: cn('[&_svg]:origin-center [&_svg]:scale-100', {
        '[&_svg]:animate-marker-scale-up [&_svg]:scale-150':
          animate && activePin === pin.title,
        '[&_svg]:origin-top-left': cleanedAnchor === 'topLeft',
        '[&_svg]:origin-top-right': cleanedAnchor === 'topRight',
        '[&_svg]:origin-bottom-right': cleanedAnchor === 'bottomRight',
        '[&_svg]:origin-bottom-left': cleanedAnchor === 'bottomLeft',
        'after:content-[""] after:inset-[-50%] after:absolute':
          pin.pinIcon.showTooltipOnMobile,
      }),
      html: `
          ${pin.pinIcon.svgIcon}`,
      iconSize: [width, height],
      iconAnchor: anchor,
    });

    return (
      <Marker
        ref={markerRef}
        position={position}
        icon={icon}
        eventHandlers={eventHandlers}
      >
        {pin.pinIcon.showTooltipOnMobile && (
          <Tooltip
            className={cn(
              'rounded-none border-foreground font-atica text-xs uppercase md:hidden',
              '!rounded-b-none !rounded-t-none !border-b-[0.5px] !border-l-[0.5px] !border-t-[0.5px] !border-foreground !text-foreground !shadow-none before:!border-t-transparent',
              {
                'animate-tooltip-opacity-up': pin.title === activePin,
              }
            )}
            direction='top'
            offset={[width / 2, -height / 2]}
            permanent
            opacity={activePin === pin.title ? 1 : 0}
          >
            {pin.title}
          </Tooltip>
        )}
      </Marker>
    );
  };

  const plusIcon = `<svg width="63" height="63" viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="31.5" cy="31.5" r="31.25" fill="white" stroke="black" stroke-width="0.5"/>
<line x1="31.25" y1="1.09278e-08" x2="31.25" y2="63" stroke="black" stroke-width="0.5"/>
<line x1="63" y1="32.25" y2="32.25" stroke="black" stroke-width="0.5"/>
</svg>
`;

  const minusIcon = `<svg width="63" height="63" viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="31.5" cy="31.5" r="31.25" fill="white" stroke="black" stroke-width="0.5"/>
<line x1="63" y1="32.25" y2="32.25" stroke="black" stroke-width="0.5"/>
</svg>
`;

  return (
    <LayoutGrid display='fullbleedMobileOnly'>
      <div className='relative col-span-1 ml-3 size-9 lg:col-span-1 lg:ml-0 lg:size-16'>
        <Image
          alt='Map pin stencil'
          src={Eight}
          quality={100}
          fill
          className='absolute'
        />
      </div>
      <div className='col-span-11 col-start-2 ml-6 mr-3 block lg:mr-0 lg:hidden'>
        <Select value={activeCategory} onValueChange={setActiveCategory}>
          <SelectTrigger
            className={cn(
              'rounded-full border-[0.5px] border-foreground bg-transparent',
              'text-left font-atica text-lg uppercase',
              'h-9 py-0 pl-3 pr-2'
            )}
          >
            <SelectValue placeholder={firstCategory?.name} />
          </SelectTrigger>
          <SelectContent
            className={cn(
              'rounded-xl',
              'border-[0.5px] border-foreground bg-white'
            )}
          >
            {categories.map((category) => {
              return (
                <SelectItem
                  key={category._key}
                  value={category.name}
                  className={cn('font-atica text-lg uppercase')}
                >
                  {category.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className='col-span-5 hidden lg:block'>
        <Accordion
          type='single'
          defaultValue={firstCategory?.name}
          value={activeCategory}
          onValueChange={setActiveCategory}
        >
          {categories.map((category, i) => {
            return (
              <AccordionItem
                key={i}
                value={category.name}
                className='border-none'
              >
                <AccordionTrigger
                  className={cn(
                    'w-fit items-start py-0 decoration-1 underline-offset-2',
                    {
                      underline: category.name === activeCategory,
                    }
                  )}
                >
                  {category.name}
                </AccordionTrigger>
                <AccordionContent
                  className={cn('flex flex-col items-end justify-end')}
                >
                  <ul className='mt-4 flex w-2/3 flex-col overflow-y-auto max-md:hidden'>
                    {category.locations.map((location, index) => (
                      <li
                        id={`pin-${index + 1}`}
                        key={index + 1}
                        onMouseOut={() => setActivePin('')}
                        onMouseOver={() => setActivePin(location.title)}
                        onClick={() => setActivePin(location.title)}
                        tabIndex={0}
                        className={cn(
                          'w-fit cursor-pointer list-none rounded leading-[152.5%] transition-all duration-200 ease-in-out',
                          {
                            underline: location.title === activePin,
                          }
                        )}
                      >
                        {location.title}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
      <div className='col-span-full lg:col-span-6'>
        {imageUrl && (
          <LeafletMap
            center={[40.75258135177342, -73.97131166613518]}
            zoom={15.5}
            minZoom={15}
            maxZoom={18}
            zoomControl={false}
            scrollWheelZoom={false}
            maxBounds={mapBounds}
            zoomSnap={0}
            className={cn('z-0 h-[60dvh] !bg-transparent md:h-[80dvh]')}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {logo && <MapMarker animate={false} pin={logo} />}
            {categories
              .filter((cat) => cat.name === activeCategory)
              .at(0)
              ?.locations.map((location, i) => {
                return <MapMarker key={i} animate={true} pin={location} />;
              })}
            <ImageOverlay url={imageUrl} bounds={mapBounds} opacity={1} />
            <ZoomControl
              position='bottomright'
              zoomInText={plusIcon}
              zoomOutText={minusIcon}
            />
          </LeafletMap>
        )}
      </div>
    </LayoutGrid>
  );
};
