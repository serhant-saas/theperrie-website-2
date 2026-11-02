import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'scrollOverlay',
  title: 'Scroll Overlay',
  type: 'object',
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
      name: 'image',
      title: 'Image',
      type: 'imageSingle',
      hidden: ({ parent }) => parent?.mediaType !== 'images',
      description: 'Upload or choose an image.',
    }),
    defineField({
      name: 'overlayImage',
      title: 'Overlay Image',
      type: 'imageSingle',
      description: 'Upload or choose an overlay image.',
      validation: (Rule) =>
        Rule.required().error('At least one image is required'),
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
        title: `Scroll Overlay - ${mediaType}`,
        subtitle: `Media: ${mediaType === 'video' ? video?.asset?.originalFilename : images[0]?.asset?.originalFilename}`,
        media: mediaType === 'video' ? video : images[0],
      };
    },
  },
});
