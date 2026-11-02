import { z } from 'zod';
/*
 * Current Location
 */
export const currentLocationOptions = [
  {
    label: 'Manhattan',
    value: 'Manhattan',
  },
  {
    label: 'Brooklyn',
    value: 'Brooklyn',
  },
  {
    label: 'Queens',
    value: 'Queens',
  },
  {
    label: 'New York City Other',
    value: 'New York City Other',
  },
  {
    label: 'New York City Suburbs/Tristate',
    value: 'New York City Suburbs/Tristate',
  },
  {
    label: 'US Other',
    value: 'US Other',
  },
  {
    label: 'International',
    value: 'International',
  },
] as const;

type CurrentLocationValue = (typeof currentLocationOptions)[number]['value'];

export const CURRENT_LOCATION_VALUES: [
  CurrentLocationValue,
  ...CurrentLocationValue[],
] = [
  currentLocationOptions[0].value,
  ...currentLocationOptions.slice(1).map((o) => o.value),
];

/*
 * Preferred Budget
 */
export const preferredBudgetOptions = [
  {
    label: 'Under $1,000,000',
    value: 'Under $1,000,000',
  },
  {
    label: '$1,000,000 - $1,200,000',
    value: '$1,000,000 - $1,200,000',
  },
  {
    label: '$1,200,000 - $1,400,000',
    value: '$1,200,000 - $1,400,000',
  },
  {
    label: '$1,400,000 - $1,600,000',
    value: '$1,400,000 - $1,600,000',
  },
] as const;

type PreferredBudgetValue = (typeof preferredBudgetOptions)[number]['value'];

export const PREFERRED_BUDGET_VALUES: [
  PreferredBudgetValue,
  ...PreferredBudgetValue[],
] = [
  preferredBudgetOptions[0].value,
  ...preferredBudgetOptions.slice(1).map((o) => o.value),
];

/*
 * Are you a broker?
 */
export const isBrokerOptions = [
  {
    label: 'Yes',
    value: 'Yes',
  },
  {
    label: 'No',
    value: 'No',
  },
] as const;

type IsBrokerValue = (typeof isBrokerOptions)[number]['value'];

export const IS_BROKER_VALUES: [IsBrokerValue, ...IsBrokerValue[]] = [
  isBrokerOptions[0].value,
  ...isBrokerOptions.slice(1).map((o) => o.value),
];

/*
 * If no, are you wotking with a broker?
 */
export const hasRepresentativeBrokerOptions = [
  {
    label: 'Yes',
    value: 'Yes',
  },
  {
    label: 'No',
    value: 'No',
  },
] as const;

type HasRepresentativeBrokerValue =
  (typeof hasRepresentativeBrokerOptions)[number]['value'];

export const HAS_REPRESENTATIVE_BROKER_VALUES: [
  HasRepresentativeBrokerValue,
  ...HasRepresentativeBrokerValue[],
] = [
  hasRepresentativeBrokerOptions[0].value,
  ...hasRepresentativeBrokerOptions.slice(1).map((o) => o.value),
];

export const contactOptions = [
  {
    label: 'Email',
    value: 'Email',
  },
  {
    label: 'Call',
    value: 'Call',
  },
  {
    label: 'Text',
    value: 'Text',
  },
] as const;

type ContactValue = (typeof contactOptions)[number]['value'];

export const CONTACT_VALUES: [ContactValue, ...ContactValue[]] = [
  contactOptions[0].value,
  ...contactOptions.slice(1).map((o) => o.value),
];

/*
 * How did you hear about us?
 */
export const discoveryOptions = [
  {
    label: 'Broker',
    value: 'Broker',
  },
  {
    label: 'Corcoran.com',
    value: 'Corcoran.com',
  },
  {
    label: 'StreetEasy',
    value: 'StreetEasy',
  },
  {
    label: 'Facebook/Instagram',
    value: 'Facebook/Instagram',
  },
  {
    label: 'Site Signage',
    value: 'Site Signage',
  },
  {
    label: 'Live in the Neighborhood',
    value: 'Live in the Neighborhood',
  },
  {
    label: 'News Article/Press',
    value: 'News Article/Press',
  },
  {
    label: 'Friend/Family/Referral',
    value: 'Friend/Family/Referral',
  },
  {
    label: 'Online Search',
    value: 'Online Search',
  },
  {
    label: 'Other',
    value: 'Other',
  },
] as const;

type DiscoveryValue = (typeof discoveryOptions)[number]['value'];

export const DISCOVERY_VALUES: [DiscoveryValue, ...DiscoveryValue[]] = [
  discoveryOptions[0].value,
  ...discoveryOptions.slice(1).map((o) => o.value),
];

/*
 * Form Schema
 */
export const FormSchema = z.object({
  first_name: z.string().min(1, { message: 'First name is required.' }),
  last_name: z.string().min(1, { message: 'Last name is required.' }),
  email: z.string().min(1, { message: 'Email is required.' }).email(),
  phone_number: z.string().min(1, { message: 'Phone number is required.' }),
  current_location: z.union([
    z.enum(CURRENT_LOCATION_VALUES).optional(),
    z.literal(''),
  ]),
  is_broker: z.enum(IS_BROKER_VALUES, {
    errorMap: () => ({
      message: 'Please select one of the options.',
    }),
  }),
  has_representative_broker: z.union([
    z.enum(HAS_REPRESENTATIVE_BROKER_VALUES).optional(),
    z.literal(''),
  ]),

  contact: z.union([z.enum(CONTACT_VALUES).optional(), z.literal('')]),
  discovery: z.union([z.enum(DISCOVERY_VALUES).optional(), z.literal('')]),
  preferred_budget: z.union([
    z.enum(PREFERRED_BUDGET_VALUES).optional(),
    z.literal(''),
  ]),
});
export type RegisterFormSchema = z.infer<typeof FormSchema>;
