import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'registerForm',
  title: 'Register Form',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'headlineSingle',
      description: 'The headline that will appear above the the form.',
    }),
    defineField({
      name: 'richText',
      title: 'Rich Text',
      type: 'richText',
      description:
        'Centered text that will appear below the headline and above the left and right text blocks.',
    }),
    defineField({
      name: 'leftText',
      title: 'Left Text',
      type: 'text',
      description:
        'The left text block that will appear between the headline and the form.',
    }),
    defineField({
      name: 'rightText',
      title: 'Right Text',
      type: 'text',
      description:
        'The right text block that will appear between the headline and the form.',
    }),
    defineField({
      name: 'fontFamily',
      title: 'Text Font Family',
      type: 'string',
      options: {
        list: ['Lora', 'Atica'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'Lora',
      description: 'The font family for the two text blocks and the form.',
    }),
    defineField({
      name: 'newSubscriberEmailRecipients',
      title: 'New Subscriber Email Recipients',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
      description:
        'The list of email-addresses to receive a notifacation when a user subscribes.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Register Form',
      };
    },
  },
});
