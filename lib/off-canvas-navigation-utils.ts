import { sanityFetch } from '@/sanity/lib/fetch';
import { OFF_CANVAS_NAVIGATION_QUERY } from '@/sanity/lib/queries';
import type { OFF_CANVAS_NAVIGATION_QUERYResult } from '@/sanity/types';

import { transformOffCanvasNavigation } from './off-canvas-navigation-transform';

export type SingleLinkType = {
  key: string;
  link: string;
  label: string;
  newTab: boolean;
  uppercase: boolean;
};

export type MultiLinkType = {
  label: string;
  items: SingleLinkType[];
};

export type NavigationItemType = {
  index: number;
  item: SingleLinkType | MultiLinkType;
  type: 'singleLinkNavigationItem' | 'multiLinkNavigationItem';
};

export type OffCanvasNavigationColumnType = {
  key: string;
  items: NavigationItemType[];
};

export type OffCanvasNavigationType = {
  columns: OffCanvasNavigationColumnType[];
  highlightedLink?: SingleLinkType;
  announcements?: {
    announcementAboveHeader?: string;
    announcementBelowHeader?: string;
  };
};

export { transformOffCanvasNavigation };

export const fetchAndTransformOffCanvasNavigation =
  async (): Promise<OffCanvasNavigationType> => {
    const data = await sanityFetch<OFF_CANVAS_NAVIGATION_QUERYResult>({
      query: OFF_CANVAS_NAVIGATION_QUERY,
    });

    return transformOffCanvasNavigation(data);
  };
