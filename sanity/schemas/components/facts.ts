import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'facts',
  title: 'Facts',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'The text that appears above the fact columns.',
    }),
    defineField({
      name: 'columnLeft',
      title: 'Column Left',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'The list of facts that appears on the left side.',
    }),
    defineField({
      name: 'columnRight',
      title: 'Column Right',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'The list of facts that appears on the right side.',
    }),
    defineField({
      name: 'previewLimit',
      title: 'Preview Limit',
      type: 'number',
      initialValue: 3,
      description:
        'The number of list items to be shows in the collapsed list for mobile screens. If set to 0, the list will not be collapsible.',
    }),
    defineField({
      name: 'fontFamily',
      title: 'Font Family',
      type: 'string',
      options: {
        list: ['Lora', 'Atica'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'Lora',
    }),
    defineField({
      name: 'uppercase',
      title: 'Uppercase',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      headline: 'headline',
    },
    prepare({ headline }) {
      return {
        title: `Facts`,
        subtitle: headline ?? '-',
      };
    },
  },
});
