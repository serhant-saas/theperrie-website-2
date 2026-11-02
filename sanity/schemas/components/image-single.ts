import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'imageSingle',
  title: 'Image Single',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      fields: [
        { name: 'alt', title: 'Alt', type: 'string' },
        { name: 'caption', title: 'Caption', type: 'text' },
        {
          name: 'textColor',
          title: 'Text Color',
          type: 'string',
          options: {
            list: [
              'default',
              'appleGreen',
              'babyBlue',
              'orange',
              'peach',
              'pink',
              'seafoamBlue',
              'teal',
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: ['16-9', '4-3', 'original'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'original',
    }),
    defineField({
      name: 'display',
      title: 'Display',
      type: 'string',
      options: {
        list: ['regular', 'fullbleed', 'fullbleedMobileOnly'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'regular',
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
        list: ['full', '2/3', '3/4'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: '3/4',
    }),
  ],
  preview: {
    select: {
      alt: 'image.alt',
      image: 'image',
      alignment: 'alignment',
      width: 'width',
    },
    prepare({ alt, image, alignment, width }) {
      return {
        title: `Image Single - ${alt}`,
        subtitle: `${alignment}, ${width}`,
        media: image,
      };
    },
  },
});
