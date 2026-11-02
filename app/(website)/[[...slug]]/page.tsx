import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { Availability } from '@/components/Availability';
import { Facts } from '@/components/Facts';
import { HeadlineSingle } from '@/components/HeadlineSingle';
import { HeroTeaser } from '@/components/HeroTeaser';
import ImageCarousel from '@/components/ImageCarousel';
import ImageSingle from '@/components/ImageSingle';
import { ImageWithHotspots } from '@/components/ImageWithHotspots';
import { RichText } from '@/components/mc-ui/richText';
import { NeighborhoodMapLoader } from '@/components/NeighborhoodMapLoader';
import { PressList } from '@/components/PressList';
import { RegisterForm } from '@/components/RegisterForm';
import { ScrollOverlay } from '@/components/ScrollOverlay';
import { Section } from '@/components/Section';
import TextBlockArray from '@/components/TextBlockArray';
import { TextImageDual } from '@/components/TextImageDual';
import { TextImageSingle } from '@/components/TextImageSingle';
import { TextSingle } from '@/components/TextSingle';
import ChangeBackgroundColor from '@/lib/page-utils';
import { resolveCanonicalUrl } from '@/lib/seo';
import type { ExtendedSanityImageType } from '@/lib/utils';
import { processImage } from '@/lib/utils';
import { sanityFetch } from '@/sanity/lib/fetch';
import { PAGE_QUERY, PAGES_QUERY, SETTINGS_QUERY } from '@/sanity/lib/queries';
import type { PAGE_QUERYResult, SETTINGS_QUERYResult } from '@/sanity/types';

type RootPageProps = {
  params: { slug: string[] };
};

export const generateMetadata = async ({
  params,
}: RootPageProps): Promise<Metadata> => {
  const { generalSettings, pageData } = await fetchPageData({ params });

  const title = pageData?.seo?.title || generalSettings?.seo?.title;
  const description =
    pageData?.seo?.description || generalSettings?.seo?.description;
  const image = pageData?.seo?.image || generalSettings?.seo?.image;

  const imageUrl = image
    ? processImage(image as ExtendedSanityImageType)?.imageUrl
    : undefined;

  const favicon = generalSettings?.seo?.favicon
    ? processImage(generalSettings?.seo?.favicon as ExtendedSanityImageType)
        ?.imageUrl
    : undefined;

  const currentSlug = params.slug?.join('/');
  const canonicalUrl = resolveCanonicalUrl(currentSlug);

  return {
    title: title || 'Default Title',
    description: description || 'Default Description',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    icons: {
      icon: favicon,
    },
  };
};

const fetchPageData = async ({ params }: RootPageProps) => {
  const { slug } = params;
  const currentSlug = slug?.join('/');

  const generalSettings = await sanityFetch<SETTINGS_QUERYResult>({
    query: SETTINGS_QUERY,
  });

  const homePageSlug = generalSettings?.homePage.slug.current ?? '';

  const pageData = await sanityFetch<PAGE_QUERYResult>({
    query: PAGE_QUERY,
    params: { slug: currentSlug || homePageSlug },
  });

  const allPages = await sanityFetch<PAGE_QUERYResult[]>({
    query: PAGES_QUERY,
  });

  return { generalSettings, pageData, homePageSlug, allPages };
};

export default async function RootPage({ params }: RootPageProps) {
  const { pageData, homePageSlug, allPages } = await fetchPageData({ params });

  const { slug } = params;
  const currentSlug = slug?.join('/');

  if (currentSlug === homePageSlug) {
    redirect('/');
  }

  if (!pageData) return notFound();

  const backgroundColor = pageData.styling?.backgroundColor ?? 'transparent';

  return (
    <div>
      <ChangeBackgroundColor backgroundColor={backgroundColor} />
      {pageData?.sections?.map((section) => (
        <Section
          key={section._key}
          spaceTop={section.spaceTop}
          spaceBottom={section.spaceBottom}
          background={section.background}
          overlayImage={section.overlayImage}
          overlayImageStartingPosition={section.overlayImageStartingPosition}
          overlayImageEndingPosition={section.overlayImageEndingPosition}
        >
          {section.content?.map((content) => {
            switch (content._type) {
              case 'availability':
                return (
                  <Availability
                    key={content._key}
                    factSheet={content.factSheetPDF}
                    items={content.items}
                  />
                );
              case 'facts':
                return (
                  <Facts
                    key={content._key}
                    headline={content.headline}
                    columnLeft={content.columnLeft}
                    columnRight={content.columnRight}
                    previewLimit={content.previewLimit}
                    uppercase={content.uppercase}
                    fontFamily={content.fontFamily}
                  />
                );
              case 'headlineSingle':
                return (
                  <HeadlineSingle
                    key={content._key}
                    tag={content.tag}
                    alignment={content.alignment}
                    uppercase={content.uppercase}
                    fontFamily={content.fontFamily}
                    width={content.width}
                    icon={content.icon}
                  >
                    <RichText text={content.headline} />
                  </HeadlineSingle>
                );
              case 'heroTeaser': {
                const slug = allPages.find(
                  (e) => e?._id === content.callToAction?.reference?._ref
                );

                return (
                  <HeroTeaser
                    key={content._key}
                    mediaType={content.mediaType}
                    images={content.images}
                    videoSource={content.videoSource}
                    videoFile={content.videoFile}
                    videoMobileFile={content.videoMobileFile}
                    videoUrl={content.videoUrl}
                    videoMobileUrl={content.videoMobileUrl}
                    arrows={content.arrows}
                    slideshowInterval={content.slideshowInterval}
                    loop={content.loop}
                    showVolumeToggle={content.showVolumeToggle}
                    callToAction={{
                      href: slug?.slug.current ?? '',
                      label: content.callToAction?.label ?? '',
                    }}
                  />
                );
              }
              case 'imageCarousel':
                return (
                  <ImageCarousel
                    key={content._key}
                    images={content.images}
                    numberOfVisibleImages={content.numberOfVisibleImages ?? 1}
                  />
                );
              case 'imageSingle':
                return (
                  <ImageSingle
                    key={content._key}
                    image={content.image}
                    aspectRatio={content.aspectRatio}
                    alignment={content.alignment}
                    width={content.width}
                    display={content.display}
                    caption={content.image?.caption}
                    textColor={content.image?.textColor}
                  />
                );
              case 'imageWithHotspots':
                return (
                  <ImageWithHotspots
                    key={content._key}
                    hotspotImage={content.hotspotImage}
                    hotspots={content.hotspots}
                  />
                );
              case 'neighborhoodMap':
                return (
                  <NeighborhoodMapLoader
                    key={content._key}
                    mapImage={content.mapImage}
                    logo={content.logo}
                    data={content.data}
                  />
                );
              case 'pressList':
                return <PressList key={content._key} />;
              case 'registerForm':
                return (
                  <RegisterForm
                    key={content._key}
                    headline={content.headline}
                    richText={content.richText}
                    leftText={content.leftText}
                    rightText={content.rightText}
                    fontFamily={content.fontFamily}
                    newSubscriberEmailRecipients={
                      content.newSubscriberEmailRecipients
                    }
                  />
                );
              case 'scrollOverlay':
                return (
                  <ScrollOverlay
                    key={content._key}
                    overlayImage={content.overlayImage}
                    mediaType={content.mediaType}
                    image={content.image}
                    videoSource={content.videoSource}
                    videoFile={content.videoFile}
                    videoMobileFile={content.videoMobileFile}
                    videoUrl={content.videoUrl}
                    videoMobileUrl={content.videoMobileUrl}
                  />
                );
              case 'textImageDual':
                return (
                  <TextImageDual
                    key={content._key}
                    text={content.text}
                    firstImage={content.firstImage}
                    secondImage={content.secondImage}
                    layout={content.layout}
                    verticalAlignment={content.verticalAlignment}
                  />
                );
              case 'textImageSingle':
                return (
                  <TextImageSingle
                    key={content._key}
                    text={content.text}
                    image={content.image}
                    layout={content.layout}
                    imageLayout={content.imageLayout}
                  />
                );
              case 'textSingle':
                return (
                  <TextSingle
                    key={content._key}
                    text={content.text}
                    alignment={content.alignment}
                    width={content.width}
                  />
                );
              case 'textBlockArray':
                return (
                  <TextBlockArray
                    key={content._key}
                    blocks={content.textBlocks ?? []}
                  />
                );
              default:
                return null;
            }
          })}
        </Section>
      ))}
    </div>
  );
}
