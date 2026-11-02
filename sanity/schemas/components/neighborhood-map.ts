import { defineField, defineType } from 'sanity';

export const neighborhoodMapPinIcon = defineType({
  name: 'icon',
  title: 'Icon',
  type: 'object',
  fields: [
    defineField({
      name: 'svgIcon',
      title: 'SVGIcon',
      type: 'inlineSvg',
      description:
        'Please run them through https://iconly.io/tools/svg-cleaner first to optimize and mitigate errors.',
    }),
    defineField({
      name: 'anchor',
      title: 'Anchor',
      type: 'string',
      options: {
        list: [
          {
            title: 'Center',
            value: 'center',
          },
          {
            title: 'Top Left',
            value: 'topLeft',
          },
          {
            title: 'Top Right',
            value: 'topRight',
          },
          {
            title: 'Bottom Left',
            value: 'bottomLeft',
          },
          {
            title: 'Bottom Right',
            value: 'bottomRight',
          },
        ],
      },
      initialValue: 'topRight',
      description: 'The anchor point of the icon.',
    }),
    defineField({
      name: 'showTooltipOnMobile',
      title: 'Show Tooltip on Mobile',
      type: 'boolean',
      initialValue: true,
      description:
        'Choose whether to show a tooltip when hovering over/clicking on a marker on mobile screens.',
    }),
  ],
});

export const neighborhoodMapPin = defineType({
  name: 'pin',
  title: 'Pin',
  type: 'object',
  fields: [
    defineField({
      name: 'lat',
      title: 'Latitude',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lng',
      title: 'Longitude',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pinIcon',
      title: 'Pin Icon',
      type: 'icon',
    }),
  ],
});

export const neighborhoodMapCategoryData = defineType({
  name: 'categoryData',
  title: 'Category Data',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Category name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'locations',
      title: 'Locations',
      type: 'array',
      of: [{ type: 'pin' }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      name: 'name',
      locations: 'locations',
    },
    prepare({ name, locations }) {
      return {
        title: `Category - ${name}`,
        subtitle: `${locations?.length} location${locations?.length > 1 ? 's' : ''}`,
      };
    },
  },
});

export const neighborhoodMap = defineType({
  name: 'neighborhoodMap',
  title: 'Neighborhood Map',
  type: 'object',
  fields: [
    defineField({
      name: 'mapCenter',
      title: 'Map Center',
      type: 'object',
      fields: [
        defineField({
          name: 'lat',
          title: 'Latitude',
          type: 'number',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'lng',
          title: 'Longitude',
          type: 'number',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'The Perrie Logo',
      type: 'pin',
    }),
    defineField({
      name: 'data',
      title: 'Categiories',
      type: 'array',
      of: [{ type: 'categoryData' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'mapImage',
      title: 'Map Image',
      type: 'image',
    }),
  ],
  preview: {
    select: {
      data: 'data',
    },
    prepare({ data }) {
      return {
        title: `Neighborhood Map`,
        subtitle: `${data?.length} categor${data?.length > 1 ? 'ies' : 'y'}`,
      };
    },
  },
});
