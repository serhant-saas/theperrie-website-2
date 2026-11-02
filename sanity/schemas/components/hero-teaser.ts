import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'heroTeaser',
  title: 'Hero Teaser',
  type: 'object',
  fieldsets: [
    {
      name: 'slideshowSettings',
      title: 'Optional Slideshow Settings',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {
        list: ['images', 'video'],
        layout: 'radio',
        direction: 'horizontal',
      },
      description: 'Choose whether you want to show image(s) or video(s).',
    }),
    defineField({
      name: 'videoSource',
      title: 'Video Source',
      type: 'string',
      options: {
        list: ['file', 'url'],
        layout: 'radio',
        direction: 'horizontal',
      },
      hidden: ({ parent }) => parent?.mediaType !== 'video',
      description:
        'Choose "File" to upload video(s) or "Url" to insert Vimeo links.',
    }),
    defineField({
      name: 'videoFile',
      title: 'Video File',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      hidden: ({ parent }) =>
        parent?.videoSource !== 'file' || parent?.mediaType !== 'video',
      description: 'Upload or choose a video file.',
    }),
    defineField({
      name: 'videoMobileFile',
      title: 'Video Mobile File',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      hidden: ({ parent }) =>
        parent?.videoSource !== 'file' || parent?.mediaType !== 'video',
      description:
        'Optionally, upload or choose a video file to display on mobile screens.',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video Url',
      type: 'string',
      hidden: ({ parent }) =>
        parent?.videoSource !== 'url' || parent?.mediaType !== 'video',
      description: 'Insert the URL of a Vimeo video.',
    }),
    defineField({
      name: 'videoMobileUrl',
      title: 'Video Mobile Url',
      type: 'string',
      hidden: ({ parent }) =>
        parent?.videoSource !== 'url' || parent?.mediaType !== 'video',
      description:
        'Optionally, insert the URL of a Vimeo video to display on mobile screens.',
    }),
    defineField({
      name: 'loop',
      title: 'Loop',
      type: 'boolean',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
      initialValue: false,
    }),
    defineField({
      name: 'showVolumeToggle',
      title: 'Show Volume Toggle',
      type: 'boolean',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
      initialValue: false,
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          fields: [{ name: 'alt', title: 'Alt', type: 'string' }],
          options: { layout: 'grid' },
        },
      ],
      hidden: ({ parent }) => parent?.mediaType !== 'images',
      description: 'Upload or choose one or more images.',
    }),
    defineField({
      name: 'arrows',
      title: 'Show Arrows',
      description:
        'Show arrows for image carousel. Only applicable if there are multiple images.',
      type: 'boolean',
      hidden: ({ parent }) => parent?.mediaType !== 'images',
      initialValue: false,
      validation: (Rule) => Rule.required(),
      fieldset: 'slideshowSettings',
    }),
    defineField({
      name: 'slideshowInterval',
      title: 'Slideshow Interval',
      description: 'Interval in Milliseconds between images.',
      type: 'number',
      hidden: ({ parent }) => parent?.mediaType !== 'images',
      initialValue: 3000,
      validation: (Rule) => Rule.required(),
      fieldset: 'slideshowSettings',
    }),
    defineField({
      name: 'callToAction',
      title: 'Call to Action',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
          type: 'string',
          description: 'The text that appears in the link to the desired page.',
        }),
        defineField({
          name: 'reference',
          title: 'Page Reference',
          type: 'reference',
          to: [{ type: 'page' }],
          description: 'Choose one of the published pages.',
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
  preview: {
    select: {
      mediaType: 'mediaType',
      video: 'video',
      images: 'images',
    },
    prepare({ mediaType, video, images }) {
      return {
        title: `Hero Teaser - ${mediaType}`,
        subtitle: `Media: ${mediaType === 'video' ? video?.asset?.originalFilename : images[0]?.asset?.originalFilename}`,
        media: mediaType === 'video' ? video : images[0],
      };
    },
  },
});
