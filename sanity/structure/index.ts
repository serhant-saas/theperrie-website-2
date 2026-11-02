import {
  CogIcon,
  LayersIcon,
  MenuIcon,
  PanelBottomIcon,
  NewspaperIcon,
} from 'lucide-react';
import type { StructureBuilder, StructureResolver } from 'sanity/structure';

const generalSettingsStructure = (S: StructureBuilder) =>
  S.listItem()
    .title('Settings')
    .icon(CogIcon)
    .child(
      S.document()
        .schemaType('generalSettings')
        .documentId('generalSettings')
        .title('Settings')
    );

const navigationStructure = (S: StructureBuilder) =>
  S.list()
    .title('Navigation')
    .items([
      S.listItem()
        .title('Off-Canvas Navigation')
        .child(
          S.document()
            .schemaType('offCanvasNavigation')
            .documentId('offCanvasNavigation')
            .title('Off-Canvas Navigation')
        ),
      S.listItem()
        .title('Footer Navigation')
        .icon(PanelBottomIcon)
        .child(
          S.document()
            .schemaType('footerNavigation')
            .documentId('footerNavigation')
            .title('Footer Navigation')
        ),
    ]);

const pagesStructure = (S: StructureBuilder) =>
  S.documentTypeList('page')
    .title('Pages')
    .child((documentId: string) =>
      S.document().documentId(documentId).schemaType('page')
    );

const pressStructure = (S: StructureBuilder) =>
  S.list()
    .title('Press')
    .items([S.documentTypeListItem('pressArticle').title('Articles')]);

export const structure: StructureResolver = (S) =>
  S.list()
    .id('root')
    .title('The Perrie')
    .items([
      S.listItem()
        .title('Navigation')
        .icon(MenuIcon)
        .child(navigationStructure(S)),
      S.listItem().title('Pages').icon(LayersIcon).child(pagesStructure(S)),
      S.listItem().title('Press').icon(NewspaperIcon).child(pressStructure(S)),
      S.divider(),
      generalSettingsStructure(S),
    ]);
