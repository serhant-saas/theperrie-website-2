import { groq } from 'next-sanity';

export const PAGES_QUERY = groq`*[_type == "page" && defined(slug)]`;

export const PAGE_QUERY = groq`*[_type == "page" && slug.current == $slug][0]`;

export const PRESS_LIST_QUERY = groq`
  *[_type == "pressArticle"] | order(publishedAt desc) {
    _id,
    title,
    publisher,
    publishedAt,
    featuredImage,
    url,
    "fileUrl": file.asset->url
  }
`;
export const SETTINGS_QUERY = groq`
  *[_type == "generalSettings"][0]{
    homePage->{
      title,
      slug
    },
    seo {
      title,
      description,
      image,
      favicon
    },
  }
`;

export const ANNOUNCEMENTS_QUERY = groq`
*[_type == "generalSettings"][0]{
    announcements {
      announcementAboveHeader,
      announcementBelowHeader
    },
  }`;

export const OFF_CANVAS_NAVIGATION_QUERY = groq`
*[_type == "offCanvasNavigation"][0]{
  _id,
  _type,
  items[]{
    _type,
    items[]{
      _key,
      _type,
      label,
      uppercase,
      linkType,
      internalLink->{
        _type,
        slug
      },
      externalLink,
      staticLink,
      newTab,
      _type == "multiLinkNavigationItem" => {
        "items": items[]{
          _key,
          _type,
          label,
          uppercase,
          linkType,
          internalLink->{
            _type,
            slug
          },
          externalLink,
          staticLink,
          newTab
        }
      }
    }
  },
  highlightedLink{
    _type,
    label,
    uppercase,
    linkType,
    internalLink->{
      _type,
      slug
    },
    externalLink,
    staticLink,
    newTab
  }
}`;

export const FOOTER_QUERY = groq`*[_type == "footerNavigation"][0]{
  _id,
  _type,
  navItems[]{
    _type,
    "items": items[]{
      _type,
      label,
      linkType,
      internalLink->{
        _type,
        slug
      },
      externalLink,
      newTab,
      uppercase,
      _type == "multiLinkNavigationItem" => {
        "items": items[]{
          _type,
          label,
          linkType,
          internalLink->{
            _type,
            slug
          },
          externalLink,
          newTab,
          uppercase,
        }
      }
    }
  },
  furtherLinks[]{
    _type,
    label,
    linkType,
    internalLink->{
      _type,
      slug
    },
    externalLink,
    newTab,
    uppercase,
  },
  address[],
  miscellaneousText,
  instagramUrl,
  legalText,
}`;
