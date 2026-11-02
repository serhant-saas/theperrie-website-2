import { defineField, defineType } from 'sanity';

export const textImageSingle = defineType({
  name: 'textImageSingle',
  title: 'Text + Image Single',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'richText',
      validation: (Rule) => Rule.required().error('Text is required.'),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'imageObject',
      validation: (Rule) => Rule.required().error('Image is required.'),
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
        'Select the position of the text relative to the image. Choose "left" to place the text on the left and the image on the right, or "right" to place the text on the right and the image on the left.',
    }),
    defineField({
      name: 'imageLayout',
      title: 'Image Layout',
      type: 'string',
      options: {
        list: ['vertical', 'horizontal'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'vertical',
      description:
        'Select the layout of the image. A vertical image will take up 5 columns, whereas a horizontal image will take up 8 columns of width.',
    }),
  ],
  preview: {
    select: {
      text: 'text',
      image: 'image',
      layout: 'layout',
    },
    prepare({ text, image, layout }) {
      const textPreview =
        text[0]?.children?.map((child: { text: any }) => child.text).join('') ||
        '';

      return {
        title: `Text + Image Single - ${textPreview ? textPreview.substring(0, 30) + '...' : 'No content'}`,
        subtitle: `Layout - ${layout}`,
        media: image.image,
      };
    },
  },
});
