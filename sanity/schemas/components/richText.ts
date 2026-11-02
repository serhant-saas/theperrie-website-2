import { defineType } from 'sanity';

import {
  isValidRichTextLink,
  richTextLinkValidationMessage,
} from '@/lib/rich-text-link';

export const richText = defineType({
  name: 'richText',
  title: 'Text',
  type: 'array',
  of: [
    {
      type: 'block',
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
          { title: 'Underline', value: 'underline' },
          { title: 'Strike', value: 'strike-through' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'string',
                title: 'URL, email, or phone',
                description:
                  'Enter a URL (https://…), email address, or phone number.',
                validation: (Rule) =>
                  Rule.required().custom((value) => {
                    if (
                      typeof value !== 'string' ||
                      isValidRichTextLink(value)
                    ) {
                      return true;
                    }

                    return richTextLinkValidationMessage;
                  }),
              },
            ],
          },
        ],
      },
    },
  ],
});
