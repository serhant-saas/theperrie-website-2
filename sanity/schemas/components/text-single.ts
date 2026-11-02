import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'textSingle',
  title: 'Text Single',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'richText',
      validation: (Rule) => Rule.required().error('Text is required.'),
    }),
    defineField({
      name: 'alignment',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'width',
      title: 'Text Width',
      type: 'string',
      options: {
        list: [
          { title: '1/2', value: '1/2' },
          { title: '1/3', value: '1/3' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
  ],
  preview: {
    select: {
      text: 'text',
    },
    prepare({ text }) {
      const textPreview =
        text[0]?.children?.map((child: { text: any }) => child.text).join('') ||
        '';

      return {
        title: `Text Single`,
        subtitle: `${textPreview ? textPreview.substring(0, 30) + '...' : 'No content'}`,
      };
    },
  },
});
