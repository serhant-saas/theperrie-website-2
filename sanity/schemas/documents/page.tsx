import { CharacterCountInput } from '@/sanity/ui/CharacterCountInput';
import { CharacterCountTextArea } from '@/sanity/ui/CharacterCountTextArea';
import {
  StringInputProps,
  StringSchemaType,
  defineField,
  defineType,
} from 'sanity';

export const pageSEO = defineType({
  name: 'pageSEO',
  title: 'Page SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description:
        'The title of the page that will be displayed in search engine results and browser tabs.',
      validation: (Rule) =>
        Rule.max(60).warning('Titles should be under 60 characters.'),
      components: {
        input: (props: StringInputProps<StringSchemaType>) => (
          <CharacterCountInput sanityProps={props} maxLength={60} />
        ),
      },
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      description:
        'A brief description of the page content for search engine snippets and social media shares.',
      validation: (Rule) =>
        Rule.max(60).warning('Titles should be under 60 characters.'),
      components: {
        input: (props: StringInputProps<StringSchemaType>) => (
          <CharacterCountTextArea sanityProps={props} maxLength={60} />
        ),
      },
    }),
    defineField({
      name: 'image',
      title: 'Open Graph Image',
      type: 'image',
      description:
        'An image that represents the page when shared on social media platforms. Optimal format: JPEG, 1200 x 630 pixels, under 300 KB.',
    }),
  ],
  description: '',
});

export const pageStyling = defineType({
  name: 'pageStyling',
  title: 'Page Styling',
  type: 'object',
  fields: [
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'Transparent', value: 'transparent' },
          { title: 'Beige', value: 'beige' },
          { title: 'Blue', value: 'blue' },
          { title: 'Light Beige', value: 'lightBeige' },
          { title: 'Light Green', value: 'lightGreen' },
          { title: 'Peach', value: 'peach' },
          { title: 'Pink', value: 'pink' },
          { title: 'Slate', value: 'slate' },
        ],
      },
    }),
  ],
});

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'styling',
      title: 'Styling',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [{ type: 'section' }],
      group: 'content',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'pageSEO',
      group: 'seo',
      description:
        'SEO settings for individual pages. If these fields are not filled, data will be pulled from the global settings.',
    }),
    defineField({
      name: 'styling',
      title: 'Styling',
      type: 'pageStyling',
      group: 'styling',
      description: 'Style settings for individual pages.',
    }),
  ],
});
