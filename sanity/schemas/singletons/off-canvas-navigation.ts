import { defineField, defineType } from 'sanity';

export const singleLinkNavigationItem = defineType({
  title: 'Single Link Navigation Item',
  description:
    'A standalone navigation item that directs to a specific page or section.',
  name: 'singleLinkNavigationItem',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'The text displayed for this navigation item.',
    }),
    defineField({
      name: 'uppercase',
      title: 'Uppercase',
      type: 'boolean',
      initialValue: true,
      description: 'The letter case of the label.',
    }),
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      description: 'Choose if the link is internal or external.',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Internal', value: 'internal' },
          { title: 'External', value: 'external' },
          { title: 'Static Page', value: 'static' },
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
    }),
    defineField({
      name: 'internalLink',
      title: 'Internal Link',
      type: 'reference',
      to: [{ type: 'page' }],
      description:
        'The page that this navigation item links to. Select the target page from the list of available pages.',
      hidden: ({ parent }) => (parent?.linkType ?? 'internal') !== 'internal',
    }),
    defineField({
      name: 'externalLink',
      title: 'External Link',
      type: 'url',
      description: 'The URL that this navigation item links to.',
      hidden: ({ parent }) => (parent?.linkType ?? 'external') !== 'external',
    }),
    defineField({
      name: 'staticLink',
      title: 'Static Link',
      type: 'string',
      options: {
        list: [{ title: 'Contact', value: '/contact' }],
      },
      description: 'Select a static route for this navigation item.',
      hidden: ({ parent }) => (parent?.linkType ?? 'static') !== 'static',
    }),
    defineField({
      name: 'newTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'label',
    },
    prepare: ({ title }) => {
      return {
        title: `Single Link Navigation Item - ${title}`,
      };
    },
  },
});

export const multiLinkNavigationItem = defineType({
  name: 'multiLinkNavigationItem',
  title: 'Multi Link Navigation Item',
  description:
    'An expandable navigation item that reveals multiple links when clicked, providing access to nested pages or sections.',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'The text displayed for this navigation item.',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{ type: 'singleLinkNavigationItem' }],
      description: 'A list of links under this expandable navigation item.',
    }),
  ],
  preview: {
    select: {
      title: 'label',
      items: 'items',
    },
    prepare: ({ title, items }) => {
      const description =
        items.map((item: { label: any }) => item.label).join(', ') || '';

      return {
        title: `Multi Link Navigation Item - ${title}`,
        subtitle: `${items.length} item(s) - ${description}`,
      };
    },
  },
});

export const headerNavigationColumn = defineType({
  name: 'headerNavigationColumn',
  title: 'Navigation List',
  description:
    'A list in the navigation containing multiple navigation items, which can either be single links or expandable multi-link items.',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      description:
        'An array of navigation items to be displayed in this list. Each item can be a single link or an expandable list of links.',
      type: 'array',
      of: [
        {
          type: 'singleLinkNavigationItem',
          description:
            'A standalone navigation item that directs to a specific page or section.',
        },
        {
          type: 'multiLinkNavigationItem',
          description:
            'An expandable navigation item that reveals multiple links when clicked, providing access to nested pages or sections.',
        },
      ],
    }),
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare: ({ items }) => {
      const description =
        items.map((item: { label: any }) => item.label).join(', ') || '';

      return {
        title: `Navigation List - ${description}`,
        subtitle: `${items.length} navigation item(s)`,
      };
    },
  },
});

export const offCanvasNavigation = defineType({
  name: 'offCanvasNavigation',
  title: 'Off-Canvas Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'items',
      title: 'Columns of Navigation Items or Arrays',
      type: 'array',
      of: [{ type: 'headerNavigationColumn' }],
      description:
        'The items or arrays thereof which are listed in one column in the header navigation.',
    }),
    defineField({
      name: 'highlightedLink',
      title: 'Highlighted Link',
      type: 'singleLinkNavigationItem',
      description:
        'This link appears as a sticky button next to the hamburger menu.',
    }),
  ],
});
