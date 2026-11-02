import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'pressList',
  title: 'Press List',
  type: 'object',
  description: 'List of press articles',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      hidden: true,
      readOnly: true,
      initialValue: 'Press List',
    }),
  ],
  preview: {
    select: {},
    prepare() {
      return {
        title: `Press List`,
        subtitle: `-`,
      };
    },
  },
});
