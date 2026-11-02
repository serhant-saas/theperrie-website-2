'use server';

import * as dotenv from 'dotenv';
import { Resend } from 'resend';

import { EmailTemplate } from '@/components/EmailTemplate';
import { RegisterFormSchema } from '@/lib/register-form-config';

dotenv.config();

export const subscribeUser = async (formData: RegisterFormSchema) => {
  try {
    const mailChimpData = {
      email_address: formData.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: formData.first_name,
        LNAME: formData.last_name,
        PHONE: formData.phone_number,
        LOCATION: formData.current_location,
        ISBROKER: formData.is_broker,
        HASBROKER: formData.has_representative_broker,
        CONTACT: formData.contact,
        DISCOVERY: formData.discovery,
        BUDGET: formData.preferred_budget,
      },
    };

    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const URL = `https://us14.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        Authorization: `auth ${API_KEY as string}`,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: JSON.stringify(mailChimpData),
    });

    const data = await response.json();

    if (data.status === 400) {
      console.log('Mailchimp Error:', data);

      const title: string = data.title;
      const detail: string = data.detail;

      if (detail.includes('fake')) {
        return {
          success: false,
          error: `An error occurred: ${data.detail}`,
        };
      }

      if (detail.includes('is already a list member')) {
        return {
          success: false,
          error: `Already subscribed. Please contact theperrie@corcoran.com if you need help.`,
        };
      }

      if (title.includes('Forgotten Email Not Subscribed')) {
        return {
          success: false,
          error: `${title}. Please use a different email address or contact us if you need any further assistance.`,
        };
      }

      return {
        success: false,
        error: `${title}. Please contact theperrie@corcoran.com if you need help.`,
      };
    } else if (response.status === 200) {
      return {
        success: true,
        contact_id: data.contact_id,
      };
    }
  } catch (e) {
    return {
      error: 'Something went wrong, please try again later.',
    };
  }
};

export const sendEmail = async (
  formData: RegisterFormSchema,
  subscriberId: string,
  newSubscriberEmailRecipients: string[]
) => {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const resend = new Resend(RESEND_API_KEY);

  try {
    const data = await resend.batch.send([
      {
        from: 'register@theperrie.com',
        to: newSubscriberEmailRecipients,
        subject: 'New Subscriber',
        text: `${formData.first_name} just subscribed!`,
        react: EmailTemplate({ formData, subscriberId }) as React.ReactElement,
      },
    ]);

    return data;
  } catch (e) {
    console.log('error: ', e);
    return {
      error: e + 'Error forwarding email.',
    };
  }
};
