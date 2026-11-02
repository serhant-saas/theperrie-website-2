import { defineField, defineType } from 'sanity';

export const availabilityItem = defineType({
  title: 'Availability Item',
  name: 'availabilityItem',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required().error('Name is required.'),
    }),
    defineField({
      name: 'beds',
      title: 'Beds',
      type: 'number',
      validation: (Rule) => Rule.required().error('Beds is required.'),
    }),
    defineField({
      name: 'baths',
      title: 'Baths',
      type: 'number',
      validation: (Rule) => Rule.required().error('Baths is required.'),
    }),
    defineField({
      name: 'interiorSF',
      title: 'Interior SF-SM',
      type: 'string',
      validation: (Rule) => Rule.required().error('Interior is required.'),
    }),
    defineField({
      name: 'exteriorSF',
      title: 'Exterior SF-SM',
      type: 'string',
    }),
    defineField({
      name: 'exposure',
      title: 'Exposure',
      type: 'string',
      validation: (Rule) => Rule.required().error('Exposure is required.'),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      validation: (Rule) => Rule.required().error('Price is required.'),
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'string',
      options: {
        list: [
          {
            title: 'Sold',
            value: 'Sold',
          },
          {
            title: 'In Contract',
            value: 'In Contract',
          },
          {
            title: 'Available',
            value: 'Available',
          },
        ],
      },
      initialValue: 'Available',
      validation: (Rule) => Rule.required().error('Availability is required.'),
    }),
    defineField({
      name: 'commonCharges',
      title: 'Common Charges',
      type: 'string',
    }),
    defineField({
      name: 'taxes',
      title: 'Taxes',
      type: 'string',
    }),
    defineField({
      name: 'floorPlanImage',
      title: 'Floor Plan Image',
      type: 'image',
      fields: [
        { name: 'alt', title: 'Alt', type: 'string' },
        { name: 'caption', title: 'Caption', type: 'text' },
      ],
    }),
    defineField({
      name: 'buildingImage',
      title: 'Building Image',
      type: 'image',
      fields: [
        { name: 'alt', title: 'Alt', type: 'string' },
        { name: 'caption', title: 'Caption', type: 'text' },
      ],
    }),
    defineField({
      name: 'floorKeyImage',
      title: 'Floor Key Image',
      type: 'image',
      fields: [
        { name: 'alt', title: 'Alt', type: 'string' },
        { name: 'caption', title: 'Caption', type: 'text' },
      ],
    }),
    defineField({
      title: 'Floorplan PDF',
      name: 'floorplanPDF',
      type: 'file',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      beds: 'beds',
      price: 'price',
      floorPlan: 'floorPlan',
    },
    prepare({ name, beds, price, floorPlan }) {
      return {
        title: `Availability Item - ${name}`,
        subtitle: `Beds: ${beds}, Price: ${price}...`,
        media: floorPlan,
      };
    },
  },
});

export const availability = defineType({
  title: 'Availability',
  name: 'availability',
  type: 'object',
  fields: [
    defineField({
      title: 'Fact Sheet PDF',
      name: 'factSheetPDF',
      type: 'file',
    }),
    defineField({
      name: 'items',
      title: 'Availability Items',
      type: 'array',
      of: [
        {
          type: 'availabilityItem',
        },
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .error('At least one Availability item is required.'),
    }),
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare({ items }) {
      return {
        title: 'Availability',
        subtitle: `${items.length} availability items`,
      };
    },
  },
});
