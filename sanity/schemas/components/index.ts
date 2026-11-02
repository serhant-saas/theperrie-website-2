import headlineSingle from './headline-single';
import heroTeaser from './hero-teaser';
import imageSingle from './image-single';
import linkToPage from './link-to-page';
import registerForm from './register-form';
import section from './section';
import { textBlock, textBlockArray } from './text-block-array';
import { imageObject, textImageDual } from './text-image-dual';
import { textImageSingle } from './text-image-single';
import textSingle from './text-single';
import facts from './facts';
import imageCarousel from './image-carousel';
import { richText } from './richText';
import { availability, availabilityItem } from './availability';
import scrollOverlay from './scroll-overlay';
import imageWithHotspots from './image-with-hotspots';
import {
  neighborhoodMap,
  neighborhoodMapCategoryData,
  neighborhoodMapPin,
  neighborhoodMapPinIcon,
} from './neighborhood-map';
import pressList from './press-list';

const contentComponents = [
  availability,
  availabilityItem,
  facts,
  headlineSingle,
  heroTeaser,
  imageCarousel,
  imageObject,
  imageSingle,
  imageWithHotspots,
  linkToPage,
  neighborhoodMap,
  neighborhoodMapCategoryData,
  neighborhoodMapPin,
  neighborhoodMapPinIcon,
  pressList,
  registerForm,
  richText,
  scrollOverlay,
  textBlock,
  textBlockArray,
  textImageDual,
  textImageSingle,
  textSingle,
];

export { section };
export default contentComponents;
