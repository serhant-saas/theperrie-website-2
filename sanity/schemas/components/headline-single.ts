import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'headlineSingle',
  title: 'Headline Single',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'richText',
    }),
    defineField({
      name: 'tag',
      title: 'Tag',
      type: 'string',
      options: {
        list: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'h2',
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {
        list: ['s', 'm', 'l'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'm',
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
    defineField({
      name: 'alignment',
      title: 'Alignment',
      type: 'string',
      options: {
        list: ['center', 'left', 'right'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'width',
      title: 'Width',
      type: 'string',
      options: {
        list: ['full', '5/6'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'full',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          'One',
          'Two',
          'Three',
          'Four',
          'Five',
          'Six',
          'Seven',
          'Eight',
          'Nine',
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'full',
    }),
  ],
  preview: {
    select: {
      headline: 'headline',
    },
    prepare({ headline }) {
      const textPreview =
        headline[0]?.children
          ?.map((child: { text: any }) => child.text)
          .join('') || '';

      return {
        title: `Headline Single`,
        subtitle: `${textPreview ? textPreview.substring(0, 30) + '...' : 'No content'}`,
      };
    },
  },
});
