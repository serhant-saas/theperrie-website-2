import type { MetadataRoute } from 'next';

import { resolveCanonicalUrl } from '@/lib/seo';
import { sanityFetch } from '@/sanity/lib/fetch';
import { PAGES_QUERY, SETTINGS_QUERY } from '@/sanity/lib/queries';
import type { PAGE_QUERYResult, SETTINGS_QUERYResult } from '@/sanity/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await sanityFetch<PAGE_QUERYResult[]>({
    query: PAGES_QUERY,
  });

  const generalSettings = await sanityFetch<SETTINGS_QUERYResult>({
    query: SETTINGS_QUERY,
  });

  const homePageSlug = generalSettings?.homePage.slug.current ?? '';

  const dynamicPages = pages
    .filter((page) => page?.slug.current !== homePageSlug)
    .map((page) => ({
      url: resolveCanonicalUrl(page?.slug.current),
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as 'weekly',
      priority: 0.5,
    }));

  const homePage = {
    url: resolveCanonicalUrl('/'),
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as 'weekly',
    priority: 1,
  };

  return [homePage, ...dynamicPages];
}
