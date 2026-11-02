import type { OFF_CANVAS_NAVIGATION_QUERYResult } from '../sanity/types';
import type {
  MultiLinkType,
  NavigationItemType,
  OffCanvasNavigationType,
  SingleLinkType,
} from './off-canvas-navigation-utils';

type OffCanvasNavigationData = NonNullable<OFF_CANVAS_NAVIGATION_QUERYResult>;
type OffCanvasColumn = NonNullable<OffCanvasNavigationData['items']>[number];
type OffCanvasNavItem = NonNullable<OffCanvasColumn['items']>[number];
type OffCanvasSingleLink = Extract<
  OffCanvasNavItem,
  { _type: 'singleLinkNavigationItem' }
>;
type OffCanvasMultiLink = Extract<
  OffCanvasNavItem,
  { _type: 'multiLinkNavigationItem' }
>;
type OffCanvasNestedLink = NonNullable<
  NonNullable<OffCanvasMultiLink['items']>[number]
>;
type OffCanvasHighlightedLink = NonNullable<
  OffCanvasNavigationData['highlightedLink']
>;
type SingleLinkSource =
  OffCanvasSingleLink | OffCanvasNestedLink | OffCanvasHighlightedLink;

export const transformOffCanvasNavigation = (
  data: OFF_CANVAS_NAVIGATION_QUERYResult
): OffCanvasNavigationType => {
  const resolveLink = (item: SingleLinkSource): string => {
    switch (item.linkType) {
      case 'internal':
        return item.internalLink?.slug?.current ?? '';
      case 'external':
        return item.externalLink ?? '';
      default:
        return item.staticLink ?? '';
    }
  };

  const mapSingleLink = (item: SingleLinkSource): SingleLinkType => ({
    link: resolveLink(item),
    label: item.label ?? '',
    newTab: item.newTab ?? false,
    key: '_key' in item ? item._key : '',
    uppercase: item.uppercase ?? false,
  });

  const mapMultiLink = (item: OffCanvasMultiLink): MultiLinkType => ({
    label: item.label ?? '',
    items: (item.items ?? []).map(mapSingleLink),
  });

  const mapNavItem = (
    item: OffCanvasNavItem,
    index: number
  ): NavigationItemType => ({
    index,
    item:
      item._type === 'multiLinkNavigationItem'
        ? mapMultiLink(item)
        : mapSingleLink(item),
    type: item._type,
  });

  return {
    columns: (data?.items ?? []).map((column, columnIndex) => ({
      items: (column.items ?? []).map(mapNavItem),
      key: columnIndex.toString(),
    })),
    highlightedLink: data?.highlightedLink
      ? mapSingleLink(data.highlightedLink)
      : undefined,
  };
};
