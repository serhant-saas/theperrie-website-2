import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'imageCarousel',
  title: 'Image Carousel',
  type: 'object',
  fields: [
    defineField({
      name: 'numberOfVisibleImages',
      title: 'Number of visible images',
      type: 'number',
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .error('Number of visible images must be at least 1'),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              fields: [
                { name: 'alt', title: 'Alt', type: 'string' },
                { name: 'caption', title: 'Caption', type: 'text' },
              ],
            }),
          ],
          preview: {
            select: {
              media: 'image',
              alt: 'image.alt',
              caption: 'image.caption',
            },
            prepare(selection) {
              const { media, alt, caption } = selection;
              return {
                title: alt || 'No alt text',
                subtitle: caption || 'No caption',
                media,
              };
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.required().min(1).error('At least one image is required'),
    }),
  ],
  preview: {
    select: {
      images: 'images',
    },
    prepare(selection) {
      return {
        title: 'Image Carousel',
        subtitle: `${selection.images.length} images`,
        media: selection.images[0]?.image,
      };
    },
  },
});
