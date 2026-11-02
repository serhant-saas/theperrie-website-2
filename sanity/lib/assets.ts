import type { SanityFileSource, SanityImageSource } from '@sanity/asset-utils';
import { getFileAsset } from '@sanity/asset-utils';
import createImageUrlBuilder from '@sanity/image-url';

import { dataset, projectId } from '@/sanity/env';

const projectDetails = {
  projectId: projectId || '',
  dataset: dataset || '',
};

const imageBuilder = createImageUrlBuilder(projectDetails);

export const urlForImage = (source: SanityImageSource) => {
  return imageBuilder?.image(source).auto('format').fit('max').url();
};

export const urlForVideo = (source?: SanityFileSource) => {
  if (!source) return null;
  return getFileAsset(source, projectDetails).url;
};

export const urlForFile = (source?: SanityFileSource) => {
  if (!source) return null;
  return getFileAsset(source, projectDetails).url;
};
