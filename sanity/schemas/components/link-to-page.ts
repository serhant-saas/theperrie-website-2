import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'linkToPage',
  title: 'Link to page',
  type: 'object',
  fields: [
    defineField({
      name: 'page',
      title: 'Page',
      type: 'reference',
      to: [{ type: 'page' }],
      validation: (Rule) => Rule.required(),
    }),
    {
      name: 'linkName',
      title: 'Link Name',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    },
  ],
  preview: {
    select: {
      title: 'linkName',
      pageTitle: 'page.title',
    },
    prepare({ title, pageTitle }) {
      return {
        title: `Link to page - ${title}`,
        subtitle: `Page: ${pageTitle}`,
      };
    },
  },
});
