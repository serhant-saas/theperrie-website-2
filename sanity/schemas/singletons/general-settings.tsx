import { CharacterCountInput } from '@/sanity/ui/CharacterCountInput';
import { CharacterCountTextArea } from '@/sanity/ui/CharacterCountTextArea';
import {
  defineField,
  defineType,
  StringInputProps,
  StringSchemaType,
} from 'sanity';

export const announcementBars = defineType({
  name: 'announcementBars',
  title: 'Announcement Bars',
  type: 'object',
  fields: [
    defineField({
      name: 'announcementAboveHeader',
      title: 'Announcement Bar Above Header',
      description:
        'Short announcement text that appears above the header. Will not be displayed if empty.',
      type: 'string',
    }),
    defineField({
      name: 'announcementBelowHeader',
      title: 'Announcement Bar Below Header',
      description:
        'Short announcement text that appears below the header. Will not be displayed if empty.',
      type: 'string',
    }),
  ],
});

export const generalSEO = defineType({
  name: 'generalSEO',
  title: 'General SEO',
  type: 'object',
  description:
    'General SEO settings that apply to the entire site. These settings will be used as default values for pages that do not have their own specific SEO settings.',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description:
        'The default title for the site, used in search engine results and browser tabs if a page-specific title is not provided.',
      validation: (Rule) =>
        Rule.required()
          .max(60)
          .warning('Titles should be under 60 characters.'),
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
        'The default meta description for the site, used in search engine snippets and social media shares if a page-specific description is not provided.',
      validation: (Rule) =>
        Rule.required()
          .max(160)
          .warning('Meta descriptions should be under 160 characters.'),
      components: {
        input: (props: StringInputProps<StringSchemaType>) => (
          <CharacterCountTextArea sanityProps={props} maxLength={160} />
        ),
      },
    }),
    defineField({
      name: 'image',
      title: 'Open Graph Image',
      type: 'image',
      description:
        'The default image representing the site when shared on social media platforms if a page-specific image is not provided. Optimal format: JPEG, 1200 x 630 pixels, under 300 KB.',
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'The icon that appears in the browser tab for the site.',
    }),
  ],
});

export const generalSettings = defineType({
  name: 'generalSettings',
  title: 'Settings',
  type: 'document',
  groups: [
    {
      name: 'general',
      title: 'General',
    },
    {
      name: 'announcements',
      title: 'Announcements',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'homePage',
      title: 'Home Page',
      type: 'reference',
      description: 'Choose a home page',
      to: [{ type: 'page' }],
      validation: (Rule) => Rule.required(),
      group: 'general',
    }),
    defineField({
      name: 'announcements',
      title: 'Announcement Bars',
      type: 'announcementBars',
      group: 'announcements',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'generalSEO',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      pageTitle: 'homePage.title',
    },
    prepare({ pageTitle }) {
      return {
        title: `Home Page - ${pageTitle}`,
      };
    },
  },
});
