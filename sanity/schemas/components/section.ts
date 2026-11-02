import { defineField, defineType } from 'sanity';

const contentComponentTypes = [
  { type: 'availability' },
  { type: 'facts' },
  { type: 'headlineSingle' },
  { type: 'heroTeaser' },
  { type: 'imageSingle' },
  { type: 'imageCarousel' },
  { type: 'imageWithHotspots' },
  { type: 'linkToPage' },
  { type: 'neighborhoodMap' },
  { type: 'pressList' },
  { type: 'registerForm' },
  { type: 'textBlockArray' },
  { type: 'textImageDual' },
  { type: 'textImageSingle' },
  { type: 'textSingle' },
  { type: 'scrollOverlay' },
];

export default defineType({
  name: 'section',
  title: 'Section',
  type: 'object',
  fieldsets: [
    {
      name: 'settings',
      title: 'Optional Section Settings',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
    {
      name: 'overlay',
      title: 'Optional Image Overlay',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal title for the section',
    }),
    defineField({
      name: 'slug',
      title: 'Slug / ID',
      description: 'Unique identifier for the section',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 200,
      },
      fieldset: 'settings',
    }),
    defineField({
      name: 'background',
      title: 'Background color',
      type: 'string',
      options: {
        list: [
          'transparent',
          'beige',
          'blue',
          'lightBeige',
          'lightGreen',
          'peach',
          'pink',
          'slate',
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'transparent',
      fieldset: 'settings',
    }),
    defineField({
      name: 'spaceTop',
      title: 'Space Top',
      type: 'string',
      options: {
        list: ['none', 'small', 'medium', 'large'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'none',
      fieldset: 'settings',
    }),
    defineField({
      name: 'spaceBottom',
      title: 'Space Bottom',
      type: 'string',
      options: {
        list: ['none', 'small', 'medium', 'large'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'none',
      fieldset: 'settings',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: contentComponentTypes,
    }),
    defineField({
      name: 'overlayImage',
      title: 'Overlay Image',
      type: 'imageObject',
      fieldset: 'overlay',
    }),
    defineField({
      name: 'overlayImageStartingPosition',
      title: 'Overlay Image Starting Position',
      type: 'number',
      initialValue: 50,
      fieldset: 'overlay',
      description:
        'Set the starting position of the image by translating it downwards by X percent of the image height. 0 means it will start at the top edge of the section. (Default value: 50)',
    }),
    defineField({
      name: 'overlayImageEndingPosition',
      title: 'Overlay Image Ending Position',
      type: 'number',
      initialValue: 0,
      description:
        'Set the ending position of the image. 0 means it will stop at the top edge of the section. (Default value: 0)',
      fieldset: 'overlay',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      content: 'content',
      overlayImage: 'overlayImage.image',
    },
    prepare({ title, content, overlayImage }) {
      const overlay = overlayImage ? 'with Overlay Image' : '';

      return {
        title: `Section - ${title}`,
        subtitle: `${content?.length || 0} components ${overlay}`,
      };
    },
  },
});
