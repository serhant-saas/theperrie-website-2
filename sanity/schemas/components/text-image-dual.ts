import { defineField, defineType } from 'sanity';

export const imageObject = defineType({
  name: 'imageObject',
  title: 'Image',
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
        list: ['16-9', '4-3', '9-16', '3-4', 'original'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: '3-4',
      validation: (Rule) => Rule.required().error('Aspect ratio is required.'),
    }),
  ],
  preview: {
    select: {
      alt: 'image.alt',
      image: 'image',
      aspectRatio: 'aspectRatio',
    },
    prepare({ alt, image, aspectRatio }) {
      return {
        title: `Image - ${alt}`,
        subtitle: `Aspect ratio - ${aspectRatio}`,
        media: image,
      };
    },
  },
});

export const textImageDual = defineType({
  name: 'textImageDual',
  title: 'Text + Image Dual',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'richText',
      validation: (Rule) => Rule.required().error('Text is required.'),
    }),
    defineField({
      name: 'firstImage',
      title: 'First Image',
      type: 'imageObject',
      validation: (Rule) => Rule.required().error('First image is required.'),
    }),
    defineField({
      name: 'secondImage',
      title: 'Second Image',
      type: 'imageObject',
      validation: (Rule) => Rule.required().error('Second is required.'),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: ['left', 'right'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'left',
      description:
        'Select the position of the text relative to the images. Choose "left" to place the text on the left and the images on the right, or "right" to place the text on the right and the images on the left.',
    }),
    defineField({
      name: 'verticalAlignment',
      title: 'Vertical alignment',
      type: 'string',
      options: {
        list: ['top', 'center', 'bottom'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'top',
      description: 'Select the vertical alignment for images.',
      validation: (Rule) =>
        Rule.required().error('Vertical alignment is required.'),
    }),
  ],
  preview: {
    select: {
      text: 'text',
      firstImage: 'firstImage',
      layout: 'layout',
      verticalAlignment: 'verticalAlignment',
    },
    prepare({ text, firstImage, layout, verticalAlignment }) {
      const textPreview =
        text[0]?.children?.map((child: { text: any }) => child.text).join('') ||
        '';

      return {
        title: `Text + Image Dual - ${textPreview ? textPreview.substring(0, 30) + '...' : 'No content'}`,
        subtitle: `Layout - ${layout}, Vertical Alignment - ${verticalAlignment}`,
        media: firstImage.image,
      };
    },
  },
});
