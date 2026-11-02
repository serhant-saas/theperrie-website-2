import { type SchemaTypeDefinition } from 'sanity';

import components, { section } from './components';
import { pageSEO, page, pageStyling } from './documents/page';
import {
  footerNavigation,
  footerTextLine,
  navigationColumn,
} from './singletons/footer-navigation';
import {
  generalSettings,
  generalSEO,
  announcementBars,
} from './singletons/general-settings';

import {
  headerNavigationColumn,
  multiLinkNavigationItem,
  offCanvasNavigation,
  singleLinkNavigationItem,
} from './singletons/off-canvas-navigation';
import pressArticle from './documents/press';

const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    generalSEO,
    announcementBars,
    generalSettings,
    footerNavigation,
    footerTextLine,
    headerNavigationColumn,
    multiLinkNavigationItem,
    navigationColumn,
    pressArticle,
    offCanvasNavigation,
    pageSEO,
    page,
    pageStyling,
    section,
    singleLinkNavigationItem,
    ...components,
  ],
};

export default schema;
