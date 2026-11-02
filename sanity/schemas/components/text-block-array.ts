import { defineField, defineType } from 'sanity';

export const textBlock = defineType({
  title: 'Text Block',
  name: 'textBlock',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Give this text block a title. (optional)',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) =>
        Rule.required().min(1).error('Content is required.'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      content: 'content',
    },
    prepare({ title, content }) {
      const transformedTitle = (title as string).toUpperCase();

      const blockText =
        content[0]?.children
          ?.map((child: { text: any }) => child.text)
          .join('') || '';
      return {
        title: transformedTitle ? transformedTitle : `Text Block`,
        subtitle: blockText ? blockText.substring(0, 50) + '...' : 'No content',
      };
    },
  },
});

export const textBlockArray = defineType({
  title: 'Text Blocks',
  name: 'textBlockArray',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'textBlocks',
      title: 'Text Blocks',
      type: 'array',
      of: [
        {
          type: 'textBlock',
        },
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .error('At least one TextBlock item is required.'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      textBlocks: 'textBlocks',
    },
    prepare({ title, textBlocks }) {
      return {
        title: `Text Blocks - ${title}`,
        subtitle: `${textBlocks.length} Text Blocks`,
      };
    },
  },
});
