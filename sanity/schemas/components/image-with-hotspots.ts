import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'imageWithHotspots',
  title: 'Image with Hotspots',
  type: 'object',
  fields: [
    defineField({
      name: 'hotspotImage',
      title: 'Image',
      type: 'image',
      fields: [
        { name: 'alt', title: 'Alt', type: 'string' },
        // { name: 'caption', title: 'Caption', type: 'text' },
      ],
      validation: (Rule) => Rule.required().error('Image is required.'),
    }),
    defineField({
      name: `hotspots`,
      type: `array`,
      of: [
        defineField({
          name: 'spot',
          type: 'object',
          fieldsets: [{ name: 'position', options: { columns: 2 } }],
          fields: [
            { name: 'details', type: 'text', rows: 2 },
            {
              name: 'x',
              type: 'number',
              fieldset: 'position',
              initialValue: 50,
              validation: (Rule) => Rule.required().min(0).max(100),
            },
            {
              name: 'y',
              type: 'number',
              fieldset: 'position',
              initialValue: 50,
              validation: (Rule) => Rule.required().min(0).max(100),
            },
          ],
          preview: {
            select: {
              title: 'details',
              x: 'x',
              y: 'y',
            },
            prepare({ title, x, y }) {
              return {
                title,
                subtitle: x && y ? `${x}% x ${y}%` : `No position set`,
              };
            },
          },
        }),
      ],
      options: {
        // plugin adds support for this option
        imageHotspot: {
          // see `Image and description path` setup below
          pathRoot: 'parent',
          imagePath: `hotspotImage`,
          // descriptionPath: `details`,
          // see `Custom tooltip` setup below
          tooltip: undefined,
        },
      },
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
  ],
  preview: {
    select: {
      alt: 'hotspotImage.alt',
      image: 'hotspotImage',
      hotspots: 'hotspots',
    },
    prepare({ alt, image, hotspots }) {
      return {
        title: `Image with Hotspots${alt ? ` - ${alt}` : ''}`,
        subtitle: `${hotspots.length} hotspots`,
        media: image,
      };
    },
  },
});
