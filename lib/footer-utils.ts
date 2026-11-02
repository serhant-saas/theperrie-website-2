import { sanityFetch } from '@/sanity/lib/fetch';
import { FOOTER_QUERY } from '@/sanity/lib/queries';
import type {
  FOOTER_QUERYResult,
  FooterTextLine as FooterTextLineType,
} from '@/sanity/types';

import {
  MultiLinkType,
  NavigationItemType,
  SingleLinkType,
} from './off-canvas-navigation-utils';

export type FooterNavigationColumnType = {
  key: string;
  items: NavigationItemType[];
};

export type FooterMenuType = {
  columns: FooterNavigationColumnType[];
};

export type FooterNavigationType = FooterMenuType & {
  address: FooterTextLineType[];
  furtherLinks: SingleLinkType[];
  miscellaneousText: string;
  instagramUrl: string;
  legalText: string;
};

export const fetchAndTransformFooterNavigation =
  async (): Promise<FooterNavigationType> => {
    const data = await sanityFetch<FOOTER_QUERYResult>({
      query: FOOTER_QUERY,
    });

    const resolveLink = (item: any): string => {
      switch (item.linkType) {
        case 'internal':
          return item.internalLink?.slug?.current ?? '';
        case 'external':
          return item.externalLink ?? '';
        default:
          return item.staticLink ?? '';
      }
    };

    const mapSingleLink = (item: any): SingleLinkType => ({
      link: resolveLink(item),
      label: item.label ?? '',
      newTab: item.newTab,
      key: item._key,
      uppercase: item.uppercase,
    });

    const mapMultiLink = (item: any): MultiLinkType => ({
      label: item.label ?? '',
      items: (item.items ?? []).map(mapSingleLink),
    });

    const mapNavItem = (item: any, index: number): NavigationItemType => ({
      index,
      item:
        item._type === 'multiLinkNavigationItem'
          ? mapMultiLink(item)
          : mapSingleLink(item),
      type: item._type,
    });

    return {
      columns: (data?.navItems ?? []).map((column, columnIndex) => ({
        items: (column.items ?? []).map(mapNavItem),
        key: columnIndex.toString(),
      })),
      furtherLinks: (data?.furtherLinks ?? []).map(mapSingleLink),
      address: data?.address ?? [],
      instagramUrl: data?.instagramUrl ?? '',
      miscellaneousText: data?.miscellaneousText ?? '',
      legalText: data?.legalText ?? '',
    };
  };
