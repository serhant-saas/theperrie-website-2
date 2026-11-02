import { defineField, defineType } from 'sanity';

export const footerTextLine = defineType({
  name: 'footerTextLine',
  title: 'Footer Text Line',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
    }),
    defineField({
      name: 'uppercase',
      title: 'Uppercase',
      type: 'boolean',
      initialValue: true,
    }),
  ],
});

export const navigationColumn = defineType({
  name: 'navigationColumn',
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
        subtitle: `${items?.length} navigation item${items?.length > 1 ? 's' : ''}`,
      };
    },
  },
});

export const footerNavigation = defineType({
  name: 'footerNavigation',
  title: 'Footer Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'address',
      title: 'Address',
      type: 'array',
      of: [
        {
          type: 'footerTextLine',
        },
      ],
      description:
        'The address lines that appear in the footer navigation. For accessibility reasons, please use sentence or title case.',
    }),
    defineField({
      name: 'navItems',
      title: 'Columns of Navigation Items or Arrays',
      type: 'array',
      of: [{ type: 'navigationColumn' }],
      description:
        'The items or arrays thereof which are listed in one column in the header navigation.',
    }),
    defineField({
      name: 'furtherLinks',
      title: 'Further Links',
      type: 'array',
      of: [{ type: 'singleLinkNavigationItem' }],
      description: 'These links will show in a comma seperated list.',
    }),
    defineField({
      name: 'miscellaneousText',
      title: 'Miscellaneous Text',
      type: 'text',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'legalText',
      title: 'Legal Text',
      type: 'text',
      description:
        'The legal text that appears on the very bottom of the footer navigation. For accessibility reasons, please use sentence or title case.',
    }),
  ],
});
