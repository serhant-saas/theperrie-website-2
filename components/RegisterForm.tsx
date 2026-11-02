'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { vercelStegaClean } from '@vercel/stega';
import { LoaderIcon } from 'lucide-react';
import Image from 'next/image';
import { RefObject, useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { sendEmail, subscribeUser } from '@/app/actions/form-action';
import { LayoutGrid } from '@/components/LayoutGrid';
import { Text } from '@/components/mc-ui/text';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shadcn-ui/accordion';
import { Button } from '@/components/shadcn-ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn-ui/form';
import { Input } from '@/components/shadcn-ui/input';
import { Separator } from '@/components/shadcn-ui/separator';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/shadcn-ui/toggle-group';
import {
  contactOptions,
  currentLocationOptions,
  discoveryOptions,
  FormSchema,
  hasRepresentativeBrokerOptions,
  isBrokerOptions,
  preferredBudgetOptions,
  RegisterFormSchema,
} from '@/lib/register-form-config';
import { cn } from '@/lib/utils';
import {
  HeadlineSingle as HeadlineSingleType,
  RichText as RichTextType,
} from '@/sanity/types';
import { FONT_FAMILY } from '@/types/component-props';

import { HeadlineSingle } from './HeadlineSingle';
import { RichText } from './mc-ui/richText';

const SUCCESS_MESSAGE =
  'Thank you for joining THE PERRIE priority list.  A member of the sales team will be in touch soon.';
const ERROR_MESSAGE = 'Something went wrong, please try again.';

type RegisterFormProps = {
  headline?: HeadlineSingleType;
  richText?: RichTextType;
  leftText?: string;
  rightText?: string;
  fontFamily?: FONT_FAMILY;
  newSubscriberEmailRecipients?: string[];
};

export const RegisterForm = ({
  headline,
  richText,
  leftText,
  rightText,
  fontFamily,
  newSubscriberEmailRecipients = [],
}: RegisterFormProps) => {
  const cleanedFontFamily = vercelStegaClean(fontFamily);

  const [currentLocationAccordionState, setCurrentLocationAccordionState] =
    useState('');
  const [isBrokerAccordionState, setIsBrokerAccordionState] = useState('');
  const [
    hasRepresentativeBrokerAccordionState,
    setHasRepresentativeBrokerAccordionState,
  ] = useState('');
  const [contactAccordionState, setContactAccordionState] = useState('');
  const [discoveryAccordionState, setDiscoveryAccordionState] = useState('');
  const [preferredBudgetAccordionState, setPreferredBudgetAccordionState] =
    useState('');

  const firstNameRef = useRef<HTMLInputElement>(null);
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const onFirstNameFocus = () => {
    if (firstNameRef.current) firstNameRef.current.focus();
    setFirstNameFocused(true);
  };
  const onFirstNameBlur = () => setFirstNameFocused(false);

  const lastNameRef = useRef<HTMLInputElement>(null);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const onLastNameFocus = () => {
    if (lastNameRef.current) lastNameRef.current.focus();
    setLastNameFocused(true);
  };
  const onLastNameBlur = () => setLastNameFocused(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const [emailFocused, setEmailFocused] = useState(false);
  const onEmailFocus = () => {
    if (emailRef.current) emailRef.current.focus();
    setEmailFocused(true);
  };
  const onEmailBlur = () => setEmailFocused(false);

  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const [phoneNumberFocused, setPhoneNumberFocused] = useState(false);
  const onPhoneNumberFocus = () => {
    if (phoneNumberRef.current) phoneNumberRef.current.focus();
    setPhoneNumberFocused(true);
  };
  const onPhoneNumberBlur = () => setPhoneNumberFocused(false);

  const currentLocationToggleRef = useRef<HTMLDivElement>(null);
  const currentLocationTriggerRef = useRef<HTMLButtonElement>(null);

  const isBrokerToggleRef = useRef<HTMLDivElement>(null);
  const isBrokerTriggerRef = useRef<HTMLButtonElement>(null);

  const hasRepresentativeBrokerToggleRef = useRef<HTMLDivElement>(null);
  const hasRepresentativeBrokerTriggerRef = useRef<HTMLButtonElement>(null);

  const contactToggleRef = useRef<HTMLDivElement>(null);
  const contactTriggerRef = useRef<HTMLButtonElement>(null);

  const discoveryToggleRef = useRef<HTMLDivElement>(null);
  const discoveryTriggerRef = useRef<HTMLButtonElement>(null);

  const preferredBudgetToggleRef = useRef<HTMLDivElement>(null);
  const preferredBudgetTriggerRef = useRef<HTMLButtonElement>(null);

  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      current_location: undefined,
      is_broker: undefined,
      has_representative_broker: undefined,
      contact: undefined,
      discovery: undefined,
      preferred_budget: undefined,
    },
  });

  const [pending, setPending] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (formData: RegisterFormSchema) => {
    setShowMessage(false);
    setPending(true);
    try {
      const response = await subscribeUser(formData);

      if (response) {
        setShowMessage(true);
        setPending(false);

        const { success, error } = response;

        if (success) {
          setMessage(SUCCESS_MESSAGE);
          form.reset();
          sendEmail(
            formData,
            response.contact_id,
            newSubscriberEmailRecipients
          );
        } else if (error) {
          setMessage(error);
        } else {
          console.error('Response is undefined');
        }
      }
    } catch (error) {
      console.error('An error ocurred: ', error);
    }
  };

  const focusRefObject = (
    name: string,
    event?: React.KeyboardEvent<HTMLDivElement>
  ) => {
    setTimeout(() => {
      switch (name) {
        case 'current_location':
          event?.code === 'Escape' && setCurrentLocationAccordionState('');
          currentLocationAccordionState === ''
            ? focusToggleGroup(currentLocationToggleRef)
            : focusToggleGroup(currentLocationTriggerRef);
          break;
        case 'is_broker':
          event?.code === 'Escape' && setIsBrokerAccordionState('');
          isBrokerAccordionState === ''
            ? focusToggleGroup(isBrokerToggleRef)
            : focusToggleGroup(isBrokerTriggerRef);
          break;
        case 'has_representative_broker':
          event?.code === 'Escape' &&
            setHasRepresentativeBrokerAccordionState('');
          hasRepresentativeBrokerAccordionState === ''
            ? focusToggleGroup(hasRepresentativeBrokerToggleRef)
            : focusToggleGroup(hasRepresentativeBrokerTriggerRef);
          break;
        case 'contact':
          event?.code === 'Escape' && setContactAccordionState('');
          contactAccordionState === ''
            ? focusToggleGroup(contactToggleRef)
            : focusToggleGroup(contactTriggerRef);
          break;
        case 'discovery':
          event?.code === 'Escape' && setDiscoveryAccordionState('');
          discoveryAccordionState === ''
            ? focusToggleGroup(discoveryToggleRef)
            : focusToggleGroup(discoveryTriggerRef);
          break;
        case 'preferred_budget':
          event?.code === 'Escape' && setPreferredBudgetAccordionState('');
          preferredBudgetAccordionState === ''
            ? focusToggleGroup(preferredBudgetToggleRef)
            : focusToggleGroup(preferredBudgetTriggerRef);
          break;
      }
    }, 0);
  };

  const focusToggleGroup = (
    refObject: RefObject<HTMLDivElement | HTMLButtonElement>
  ) => {
    if (refObject.current) refObject.current.focus();
  };

  const onChangeHandler = useCallback(
    (onChange: (...event: any[]) => void, name: string) => {
      return (...event: any[]) => {
        switch (name) {
          case 'current_location':
            setCurrentLocationAccordionState('');
            break;
          case 'is_broker':
            if (event.at(0) === 'Yes') {
              form.resetField('has_representative_broker');
            }
            setIsBrokerAccordionState('');
            break;
          case 'has_representative_broker':
            setHasRepresentativeBrokerAccordionState('');
            break;
          case 'contact':
            setContactAccordionState('');
            break;
          case 'discovery':
            setDiscoveryAccordionState('');
            break;
          case 'preferred_budget':
            setPreferredBudgetAccordionState('');
            break;
        }
        onChange(...event);
      };
    },
    [form]
  );

  const formLabelClass =
    'flex w-full font-normal items-center justify-start pl-3 py-3 min-h-16 md:h-16 text-lg';
  const formFieldWrapperClass =
    'transition duration-300 ease-in-out [&:has(:focus-within)]:outline-none [&:has(:focus-within)]:ring-1 [&:has(:focus-within)]:ring-ring hover:cursor-text';
  const formInputClass =
    'pl-0 bg-transparent font-semibold text-lg outline-none transition-all border-0 duration-300 ease-in-out focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0';

  return (
    <>
      {headline && (
        <div className='w-full text-center'>
          <HeadlineSingle
            tag={headline.tag}
            alignment={headline.alignment}
            uppercase={headline.uppercase}
          >
            <RichText text={headline.headline} />
          </HeadlineSingle>
        </div>
      )}

      <LayoutGrid
        className={cn('mx-auto max-w-screen-xl justify-around', {
          'font-atica': cleanedFontFamily === 'Atica',
          'font-default': cleanedFontFamily === 'Lora',
        })}
      >
        <div className='col-span-12 space-y-6 md:col-span-10 md:col-start-2 md:space-y-12'>
          {richText && (
            <div className='text-center text-lg leading-[120%] [&_span]:text-center'>
              <RichText text={richText} />
            </div>
          )}
          {/* CONTACT TEXT */}
          {leftText && rightText && (
            <div
              className={cn(
                'grid grid-cols-8 grid-rows-2 gap-6 lg:grid-rows-1',
                'text-lg leading-[120%]'
              )}
            >
              <Text
                className={cn(
                  'col-span-8 row-start-1 lg:col-span-4 lg:col-start-1 lg:mr-10'
                )}
              >
                {leftText}
              </Text>
              <Text className='col-span-8 row-start-2 lg:col-span-4 lg:col-start-5 lg:row-start-1'>
                {rightText}
              </Text>
            </div>
          )}
          {/* FORM */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col lg:flex-row lg:gap-6'>
                {/*
                 * Left Column
                 */}
                <div className='basis-1/2'>
                  <Separator />
                  {/*
                   * First Name*
                   */}
                  <div
                    className={cn(
                      formFieldWrapperClass,
                      firstNameFocused
                        ? 'bg-white/50 hover:bg-white/50'
                        : 'hover:bg-white/50'
                    )}
                    onClick={onFirstNameFocus}
                  >
                    <FormField
                      control={form.control}
                      name='first_name'
                      render={({ field }) => (
                        <FormItem className='space-y-0'>
                          <FormLabel
                            className={cn(formLabelClass, 'cursor-text')}
                          >
                            <div className='flex w-full flex-col'>
                              <span className='w-full pr-4 text-left'>
                                First Name<sup>*</sup>
                              </span>
                              <FormControl>
                                <Input
                                  {...field}
                                  ref={firstNameRef}
                                  onFocus={onFirstNameFocus}
                                  onBlur={onFirstNameBlur}
                                  autoComplete='given-name'
                                  className={cn(
                                    'input',
                                    formInputClass,
                                    firstNameFocused || field.value
                                      ? 'mb-0 h-6 py-0'
                                      : 'h-0 min-h-0 p-0'
                                  )}
                                />
                              </FormControl>
                            </div>
                          </FormLabel>
                          <div
                            className={cn(
                              'pl-2 duration-300',
                              form.formState.errors.first_name
                                ? 'pb-3 pt-0'
                                : 'pb-0'
                            )}
                          >
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Separator />
                  {/*
                   * Last Name*
                   */}
                  <div
                    className={cn(
                      formFieldWrapperClass,
                      lastNameFocused
                        ? 'bg-white/50 hover:bg-white/50'
                        : 'hover:bg-white/50'
                    )}
                    onClick={onLastNameFocus}
                  >
                    <FormField
                      control={form.control}
                      name='last_name'
                      render={({ field }) => (
                        <FormItem className='space-y-0'>
                          <FormLabel
                            className={cn(formLabelClass, 'cursor-text')}
                          >
                            <div className='flex w-full flex-col'>
                              <span className='w-full pr-4 text-left'>
                                Last Name<sup>*</sup>
                              </span>
                              <FormControl>
                                <Input
                                  {...field}
                                  ref={lastNameRef}
                                  onFocus={onLastNameFocus}
                                  onBlur={onLastNameBlur}
                                  autoComplete='family-name'
                                  className={cn(
                                    formInputClass,
                                    lastNameFocused || field.value
                                      ? 'mb-0 h-6 py-0'
                                      : 'h-0 min-h-0 p-0'
                                  )}
                                />
                              </FormControl>
                            </div>
                          </FormLabel>
                          <div
                            className={cn(
                              'pl-2 duration-300',
                              form.formState.errors.last_name
                                ? 'pb-3 pt-0'
                                : 'pb-0'
                            )}
                          >
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Separator />
                  {/*
                   * Email*
                   */}
                  <div
                    className={cn(
                      formFieldWrapperClass,
                      emailFocused
                        ? 'bg-white/50 hover:bg-white/50'
                        : 'hover:bg-white/50'
                    )}
                    onClick={onEmailFocus}
                  >
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem className='space-y-0'>
                          <FormLabel
                            className={cn(formLabelClass, 'cursor-text')}
                          >
                            <div className='flex w-full flex-col'>
                              <span className='w-full pr-4 text-left'>
                                Email<sup>*</sup>
                              </span>
                              <FormControl>
                                <Input
                                  {...field}
                                  ref={emailRef}
                                  onFocus={onEmailFocus}
                                  onBlur={onEmailBlur}
                                  autoComplete='email'
                                  className={cn(
                                    formInputClass,
                                    emailFocused || field.value
                                      ? 'mb-0 h-6 py-0'
                                      : 'h-0 min-h-0 p-0'
                                  )}
                                />
                              </FormControl>
                            </div>
                          </FormLabel>
                          <div
                            className={cn(
                              'pl-2 duration-300',
                              form.formState.errors.email ? 'pb-3 pt-0' : 'pb-0'
                            )}
                          >
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Separator />
                  {/*
                   * Phone Number*
                   */}
                  <div
                    className={cn(
                      formFieldWrapperClass,
                      phoneNumberFocused
                        ? 'bg-white/50 hover:bg-white/50'
                        : 'hover:bg-white/50'
                    )}
                    onClick={onPhoneNumberFocus}
                  >
                    <FormField
                      control={form.control}
                      name='phone_number'
                      render={({ field }) => (
                        <FormItem className='space-y-0'>
                          <FormLabel
                            className={cn(formLabelClass, 'cursor-text')}
                          >
                            <div className='flex w-full flex-col'>
                              <span className='w-full pr-4 text-left'>
                                Phone Number<sup>*</sup>
                              </span>
                              <FormControl>
                                <Input
                                  {...field}
                                  ref={phoneNumberRef}
                                  onFocus={onPhoneNumberFocus}
                                  onBlur={onPhoneNumberBlur}
                                  autoComplete='tel'
                                  className={cn(
                                    formInputClass,
                                    phoneNumberFocused || field.value
                                      ? 'mb-0 h-6 py-0'
                                      : 'h-0 min-h-0 p-0'
                                  )}
                                />
                              </FormControl>
                            </div>
                          </FormLabel>
                          <div
                            className={cn(
                              'pl-2 duration-300',
                              form.formState.errors.phone_number
                                ? 'pb-3 pt-0'
                                : 'pb-0'
                            )}
                          >
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Separator />
                  {/*
                   * Current Location
                   */}
                  <FormField
                    control={form.control}
                    name='current_location'
                    render={({ field: { value, onChange, name } }) => (
                      <FormItem className='space-y-3'>
                        <Accordion
                          type='single'
                          collapsible
                          value={currentLocationAccordionState}
                          onValueChange={setCurrentLocationAccordionState}
                          onKeyDown={(event) => {
                            (event.code === 'Escape' ||
                              event.code === 'Enter') &&
                              focusRefObject(name, event);
                          }}
                          className={formFieldWrapperClass}
                        >
                          <AccordionItem
                            value='item-1'
                            className='group border-none'
                          >
                            <AccordionTrigger
                              ref={currentLocationTriggerRef}
                              onClick={() => focusRefObject(name)}
                              className={cn(
                                'relative py-0 transition duration-300 ease-in-out hover:no-underline focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0',
                                'group-focus-within:bg-white/50 group-hover:bg-white/50'
                              )}
                            >
                              <FormLabel
                                className={cn(
                                  formLabelClass,
                                  'hover:cursor-pointer'
                                )}
                              >
                                <div className='flex w-full flex-col'>
                                  <span className='w-full pr-4 text-left'>
                                    Current Location
                                  </span>
                                  <span className='flex w-full items-center justify-start text-start font-semibold'>
                                    {value}
                                  </span>
                                </div>
                                {/* Rotate on open/close and swap colors on hover*/}
                                <div className='mr-4 size-10'>
                                  <Image
                                    src='/arrow-inverted.svg'
                                    alt='Dropdown arrow'
                                    width={40}
                                    height={40}
                                    className={cn(
                                      'absolute transition-all duration-300',
                                      currentLocationAccordionState === ''
                                        ? 'rotate-0'
                                        : 'rotate-180'
                                    )}
                                  />
                                  <Image
                                    src='/arrow.svg'
                                    alt='Dropdown arrow'
                                    width={40}
                                    height={40}
                                    className={cn(
                                      'absolute opacity-100 transition-all duration-300 hover:opacity-0',
                                      currentLocationAccordionState === ''
                                        ? 'rotate-0'
                                        : 'rotate-180'
                                    )}
                                  />
                                </div>
                              </FormLabel>
                            </AccordionTrigger>
                            <AccordionContent
                              className={cn(
                                'pb-0 duration-300',
                                'group-focus-within:bg-white/50 group-hover:bg-white/50'
                              )}
                            >
                              <FormControl>
                                <ToggleGroup
                                  ref={currentLocationToggleRef}
                                  type='single'
                                  onValueChange={onChangeHandler(
                                    onChange,
                                    'current_location'
                                  )}
                                  defaultValue={value}
                                  className='flex flex-col gap-0'
                                >
                                  {currentLocationOptions.map((option, i) => {
                                    return (
                                      <FormItem
                                        className='flex w-full items-center space-x-3 space-y-0'
                                        key={i}
                                      >
                                        <FormControl>
                                          <ToggleGroupItem
                                            value={option.value}
                                            onClick={() => focusRefObject(name)}
                                            aria-label='Toggle all'
                                            className={cn(
                                              'w-full justify-start rounded-none py-7 pl-8 ring-offset-0 focus-within:bg-white/60 hover:bg-white/60 hover:text-foreground focus-visible:ring-0 group-focus-within:ring-offset-0 data-[state=on]:bg-white/90 data-[state=on]:text-foreground',
                                              'focus-within:bg-white/60 hover:bg-white/60'
                                            )}
                                          >
                                            <span className='pl-0 text-base'>
                                              {option.label}
                                            </span>
                                          </ToggleGroupItem>
                                        </FormControl>
                                      </FormItem>
                                    );
                                  })}
                                </ToggleGroup>
                              </FormControl>
                            </AccordionContent>
                            <div
                              className={cn(
                                'group-focus-within:bg-white/50 group-hover:bg-white/50',
                                currentLocationAccordionState !== '' &&
                                  form.formState.errors.current_location
                                  ? 'pt-2'
                                  : 'pt-0'
                              )}
                            >
                              <FormMessage />
                            </div>
                          </AccordionItem>
                        </Accordion>
                      </FormItem>
                    )}
                  />
                  <Separator className='hidden lg:block' />
                </div>
                {/*
                 * Right Column
                 */}
                <div className='basis-1/2'>
                  <Separator />
                  {/*
                   * Are you a broker?*
                   */}
                  <FormField
                    control={form.control}
                    name='is_broker'
                    render={({ field: { value, onChange, name } }) => (
                      <FormItem className='space-y-3'>
                        <Accordion
                          type='single'
                          collapsible
                          value={isBrokerAccordionState}
                          onValueChange={setIsBrokerAccordionState}
                          onKeyDown={(event) => {
                            (event.code === 'Escape' ||
                              event.code === 'Enter') &&
                              focusRefObject(name, event);
                          }}
                          className={formFieldWrapperClass}
                        >
                          <AccordionItem
                            value='item-1'
                            className='group border-none'
                          >
                            <AccordionTrigger
                              ref={isBrokerTriggerRef}
                              onClick={() => {
                                focusRefObject(name);
                              }}
                              className={cn(
                                'relative py-0 transition duration-300 ease-in-out hover:no-underline focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0',
                                'group-focus-within:bg-white/50 group-hover:bg-white/50'
                              )}
                            >
                              <FormLabel
                                className={cn(
                                  formLabelClass,
                                  'hover:cursor-pointer'
                                )}
                              >
                                <div className='flex w-full flex-col'>
                                  <span className='w-full pr-4 text-left'>
                                    Are you a broker?
                                    <sup>*</sup>
                                  </span>
                                  <span className='flex w-full items-center justify-start text-start font-semibold'>
                                    {value}
                                  </span>
                                </div>
                                {/* Rotate on open/close and swap colors on hover*/}
                                <div className='mr-4 size-10'>
                                  <Image
                                    src='/arrow-inverted.svg'
                                    alt='Dropdown arrow'
                                    width={40}
                                    height={40}
                                    className={cn(
                                      'absolute transition-all duration-300',
                                      isBrokerAccordionState === ''
                                        ? 'rotate-0'
                                        : 'rotate-180'
                                    )}
                                  />
                                  <Image
                                    src='/arrow.svg'
                                    alt='Dropdown arrow'
                                    width={40}
                                    height={40}
                                    className={cn(
                                      'absolute opacity-100 transition-all duration-300 hover:opacity-0',
                                      isBrokerAccordionState === ''
                                        ? 'rotate-0'
                                        : 'rotate-180'
                                    )}
                                  />
                                </div>
                              </FormLabel>
                            </AccordionTrigger>
                            <AccordionContent
                              className={cn(
                                'pb-0 duration-300',
                                'group-focus-within:bg-white/50 group-hover:bg-white/50'
                              )}
                            >
                              <FormControl>
                                <ToggleGroup
                                  ref={isBrokerToggleRef}
                                  type='single'
                                  onValueChange={onChangeHandler(
                                    onChange,
                                    'is_broker'
                                  )}
                                  defaultValue={value}
                                  className='flex flex-col gap-0'
                                >
                                  {isBrokerOptions.map((option, i) => {
                                    return (
                                      <FormItem
                                        className='flex w-full items-center space-x-3 space-y-0'
                                        key={i}
                                      >
                                        <FormControl>
                                          <ToggleGroupItem
                                            value={option.value}
                                            onClick={() => focusRefObject(name)}
                                            aria-label='Toggle all'
                                            className={cn(
                                              'w-full justify-start rounded-none py-7 pl-8 ring-offset-0 focus-within:bg-white/60 hover:bg-white/60 hover:text-foreground focus-visible:ring-0 group-focus-within:ring-offset-0 data-[state=on]:bg-white/90 data-[state=on]:text-foreground',
                                              'focus-within:bg-white/60 hover:bg-white/60'
                                            )}
                                          >
                                            <span className='pl-0 text-base'>
                                              {option.label}
                                            </span>
                                          </ToggleGroupItem>
                                        </FormControl>
                                      </FormItem>
                                    );
                                  })}
                                </ToggleGroup>
                              </FormControl>
                            </AccordionContent>
                            <div
                              className={cn(
                                'pl-2 duration-300',
                                'group-focus-within:bg-white/50 group-hover:bg-white/50',
                                form.formState.errors.is_broker
                                  ? 'pb-3'
                                  : 'pb-0',
                                isBrokerAccordionState !== '' &&
                                  form.formState.errors.is_broker
                                  ? 'pt-3 hover:cursor-default'
                                  : 'pt-0 hover:cursor-pointer'
                              )}
                              onClick={() =>
                                setIsBrokerAccordionState('item-1')
                              }
                            >
                              <FormMessage />
                            </div>
                          </AccordionItem>
                        </Accordion>
                      </FormItem>
                    )}
                  />
                  <Separator />
                  {/*
                   * If no, are you working with a broker?
                   */}
                  <FormField
                    control={form.control}
                    name='has_representative_broker'
                    render={({ field: { value, onChange, name } }) => (
                      <FormItem className='space-y-3'>
                        <Accordion
                          type='single'
                          collapsible
                          value={hasRepresentativeBrokerAccordionState}
                          onValueChange={
                            setHasRepresentativeBrokerAccordionState
                          }
                          onKeyDown={(event) => {
                            (event.code === 'Escape' ||
                              event.code === 'Enter') &&
                              focusRefObject(name, event);
                          }}
                          className={formFieldWrapperClass}
                        >
                          <AccordionItem
                            value='item-1'
                            className='group border-none'
                          >
                            <AccordionTrigger
                              ref={hasRepresentativeBrokerTriggerRef}
                              onClick={() => {
                                focusRefObject(name);
                              }}
                              className={cn(
                                'relative py-0 transition duration-300 ease-in-out hover:no-underline focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0',
                                'group-focus-within:bg-white/50 group-hover:bg-white/50'
                              )}
                            >
                              <FormLabel
                                className={cn(
                                  formLabelClass,
                                  'hover:cursor-pointer'
                                )}
                              >
                                <div className='flex w-full flex-col'>
                                  <span className='w-full pr-4 text-left'>
                                    If no, are you working with a broker?
                                  </span>
                                  <span className='flex w-full items-center justify-start text-start font-semibold'>
                                    {value}
                                  </span>
                                </div>
                                {/* Rotate on open/close and swap colors on hover*/}
                                <div className='mr-4 size-10'>
                                  <Image
                                    src='/arrow-inverted.svg'
                                    alt='Dropdown arrow'
                                    width={40}
                                    height={40}
                                    className={cn(
                                      'absolute transition-all duration-300',
                                      hasRepresentativeBrokerAccordionState ===
                                        ''
                                        ? 'rotate-0'
                                        : 'rotate-180'
                                    )}
                                  />
                                  <Image
                                    src='/arrow.svg'
                                    alt='Dropdown arrow'
                                    width={40}
                                    height={40}
                                    className={cn(
                                      'absolute opacity-100 transition-all duration-300 hover:opacity-0',
                                      hasRepresentativeBrokerAccordionState ===
                                        ''
                                        ? 'rotate-0'
                                        : 'rotate-180'
                                    )}
                                  />
                                </div>
                              </FormLabel>
                            </AccordionTrigger>
                            <AccordionContent
                              className={cn(
                                'pb-0 duration-300',
                                'group-focus-within:bg-white/50 group-hover:bg-white/50'
                              )}
                            >
                              <FormControl>
                                <ToggleGroup
                                  ref={hasRepresentativeBrokerToggleRef}
                                  type='single'
                                  onValueChange={onChangeHandler(
                                    onChange,
                                    'has_representative_broker'
                                  )}
                                  defaultValue={value}
                                  className='flex flex-col gap-0'
                                >
                                  {hasRepresentativeBrokerOptions.map(
                                    (option, i) => {
                                      return (
                                        <FormItem
                                          className='flex w-full items-center space-x-3 space-y-0'
                                          key={i}
                                        >
                                          <FormControl>
                                            <ToggleGroupItem
                                              value={option.value}
                                              onClick={() =>
                                                focusRefObject(name)
                                              }
                                              aria-label='Toggle all'
                                              className={cn(
                                                'w-full justify-start rounded-none py-7 pl-8 ring-offset-0 focus-within:bg-white/60 hover:bg-white/60 hover:text-foreground focus-visible:ring-0 group-focus-within:ring-offset-0 data-[state=on]:bg-white/90 data-[state=on]:text-foreground',
                                                'focus-within:bg-white/60 hover:bg-white/60'
                                              )}
                                            >
                                              <span className='pl-0 text-base'>
                                                {option.label}
                                              </span>
                                            </ToggleGroupItem>
                                          </FormControl>
                                        </FormItem>
                                      );
                                    }
                                  )}
                                </ToggleGroup>
                              </FormControl>
                            </AccordionContent>
                            <div
                              className={cn(
                                'group-focus-within:bg-white/15 group-hover:bg-white/15',
                                hasRepresentativeBrokerAccordionState !== '' &&
                                  form.formState.errors
                                    .has_representative_broker
                                  ? 'pt-4'
                                  : 'pt-0'
                              )}
                            >
                              <FormMessage />
                            </div>
                          </AccordionItem>
                        </Accordion>
                      </FormItem>
                    )}
                  />
                  <Separator />
                  {/*
                   * How would you like to be contacted?
                   */}
                  <FormField
                    control={form.control}
                    name='contact'
                    render={({ field: { value, onChange, name } }) => (
                      <FormItem className='space-y-3'>
                        <Accordion
                          type='single'
                          collapsible
                          value={contactAccordionState}
                          onValueChange={setContactAccordionState}
                          onKeyDown={(event) => {
                            (event.code === 'Escape' ||
                              event.code === 'Enter') &&
                              focusRefObject(name, event);
                          }}
                          className={formFieldWrapperClass}
                        >
                          <AccordionItem
                            value='item-1'
                            className='group border-none'
                          >
                            <AccordionTrigger
                              ref={contactTriggerRef}
                              onClick={() => {
                                focusRefObject(name);
                              }}
                              className={cn(
                                'relative py-0 transition duration-300 ease-in-out hover:no-underline focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0',
                                'group-focus-within:bg-white/50 group-hover:bg-white/50'
                              )}
                            >
                              <FormLabel
                                className={cn(
                                  formLabelClass,
                                  'hover:cursor-pointer'
                                )}
                              >
                                <div className='flex w-full flex-col'>
                                  <span className='w-full pr-4 text-left'>
                                    How would you like to be contacted?
                                  </span>
                                  <span className='flex w-full items-center justify-start text-start font-semibold'>
                                    {value}
                                  </span>
                                </div>
                                {/* Rotate on open/close and swap colors on hover*/}
                                <div className='mr-4 size-10'>
                                  <Image
                                    src='/arrow-inverted.svg'
                                    alt='Dropdown arrow'
                                    width={40}
                                    height={40}
                                    className={cn(
                                      'absolute transition-all duration-300',
                                      contactAccordionState === ''
                                        ? 'rotate-0'
                                        : 'rotate-180'
                                    )}
                                  />
                                  <Image
                                    src='/arrow.svg'
                                    alt='Dropdown arrow'
                                    width={40}
                                    height={40}
                                    className={cn(
                                      'absolute opacity-100 transition-all duration-300 hover:opacity-0',
                                      contactAccordionState === ''
                                        ? 'rotate-0'
                                        : 'rotate-180'
                                    )}
                                  />
                                </div>
                              </FormLabel>
                            </AccordionTrigger>
                            <AccordionContent
                              className={cn(
                                'pb-0 duration-300',
                                'group-focus-within:bg-white/50 group-hover:bg-white/50'
                              )}
                            >
                              <FormControl>
                                <ToggleGroup
                                  ref={contactToggleRef}
                                  type='single'
                                  onValueChange={onChangeHandler(
                                    onChange,
                                    'contact'
                                  )}
                                  defaultValue={value}
                                  className='flex flex-col gap-0'
                                >
                                  {contactOptions.map((option, i) => {
                                    return (
                                      <FormItem
                                        className='flex w-full items-center space-x-3 space-y-0'
                                        key={i}
                                      >
                                        <FormControl>
                                          <ToggleGroupItem
                                            value={option.value}
                                            onClick={() => focusRefObject(name)}
                                            aria-label='Toggle all'
                                            className={cn(
                                              'w-full justify-start rounded-none py-7 pl-8 ring-offset-0 focus-within:bg-white/60 hover:bg-white/60 hover:text-foreground focus-visible:ring-0 group-focus-within:ring-offset-0 data-[state=on]:bg-white/90 data-[state=on]:text-foreground',
                                              'focus-within:bg-white/60 hover:bg-white/60'
                                            )}
                                          >
                                            <span className='pl-0 text-base'>
                                              {option.label}
                                            </span>
                                          </ToggleGroupItem>
                                        </FormControl>
                                      </FormItem>
                                    );
                                  })}
                                </ToggleGroup>
                              </FormControl>
                            </AccordionContent>
                            <div
                              className={cn(
                                'group-focus-within:bg-white/15 group-hover:bg-white/15',
                                contactAccordionState !== '' &&
                                  form.formState.errors.contact
                                  ? 'pt-4'
                                  : 'pt-0'
                              )}
                            >
                              <FormMessage />
                            </div>
                          </AccordionItem>
                        </Accordion>
                      </FormItem>
                    )}
                  />
                  <Separator />
                  {/*
                   * How did you hear about us?
                   */}
                  <FormField
                    control={form.control}
                    name='discovery'
                    render={({ field: { value, onChange, name } }) => (
                      <FormItem className='space-y-3'>
                        <Accordion
                          type='single'
                          collapsible
                          value={discoveryAccordionState}
                          onValueChange={setDiscoveryAccordionState}
                          onKeyDown={(event) => {
                            (event.code === 'Escape' ||
                              event.code === 'Enter') &&
                              focusRefObject(name, event);
                          }}
                          className={formFieldWrapperClass}
                        >
                          <AccordionItem
                            value='item-1'
                            className='group border-none'
                          >
                            <AccordionTrigger
                              ref={discoveryTriggerRef}
                              onClick={() => {
                                focusRefObject(name);
                              }}
                              className={cn(
                                'relative py-0 transition duration-300 ease-in-out hover:no-underline focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0',
                                'group-focus-within:bg-white/50 group-hover:bg-white/50'
                              )}
                            >
                              <FormLabel
                                className={cn(
                                  formLabelClass,
                                  'hover:cursor-pointer'
                                )}
                              >
                                <div className='flex w-full flex-col'>
                                  <span className='w-full pr-4 text-left'>
                                    How did you hear about us?
                                  </span>
                                  <span className='flex w-full items-center justify-start text-start font-semibold'>
                                    {value}
                                  </span>
                                </div>
                                {/* Rotate on open/close and swap colors on hover*/}
                                <div className='mr-4 size-10'>
                                  <Image
                                    src='/arrow-inverted.svg'
                                    alt='Dropdown arrow'
                                    width={40}
                                    height={40}
                                    className={cn(
                                      'absolute transition-all duration-300',
                                      discoveryAccordionState === ''
                                        ? 'rotate-0'
                                        : 'rotate-180'
                                    )}
                                  />
                                  <Image
                                    src='/arrow.svg'
                                    alt='Dropdown arrow'
                                    width={40}
                                    height={40}
                                    className={cn(
                                      'absolute opacity-100 transition-all duration-300 hover:opacity-0',
                                      discoveryAccordionState === ''
                                        ? 'rotate-0'
                                        : 'rotate-180'
                                    )}
                                  />
                                </div>
                              </FormLabel>
                            </AccordionTrigger>
                            <AccordionContent
                              className={cn(
                                'pb-0 duration-300',
                                'group-focus-within:bg-white/50 group-hover:bg-white/50'
                              )}
                            >
                              <FormControl>
                                <ToggleGroup
                                  ref={discoveryToggleRef}
                                  type='single'
                                  onValueChange={onChangeHandler(
                                    onChange,
                                    'discovery'
                                  )}
                                  defaultValue={value}
                                  className='flex flex-col gap-0'
                                >
                                  {discoveryOptions.map((option, i) => {
                                    return (
                                      <FormItem
                                        className='flex w-full items-center space-x-3 space-y-0'
                                        key={i}
                                      >
                                        <FormControl>
                                          <ToggleGroupItem
                                            value={option.value}
                                            onClick={() => focusRefObject(name)}
                                            aria-label='Toggle all'
                                            className={cn(
                                              'w-full justify-start rounded-none py-7 pl-8 ring-offset-0 focus-within:bg-white/60 hover:bg-white/60 hover:text-foreground focus-visible:ring-0 group-focus-within:ring-offset-0 data-[state=on]:bg-white/90 data-[state=on]:text-foreground',
                                              'focus-within:bg-white/60 hover:bg-white/60'
                                            )}
                                          >
                                            <span className='pl-0 text-base'>
                                              {option.label}
                                            </span>
                                          </ToggleGroupItem>
                                        </FormControl>
                                      </FormItem>
                                    );
                                  })}
                                </ToggleGroup>
                              </FormControl>
                            </AccordionContent>
                            <div
                              className={cn(
                                'group-focus-within:bg-white/15 group-hover:bg-white/15',
                                discoveryAccordionState !== '' &&
                                  form.formState.errors.discovery
                                  ? 'pt-4'
                                  : 'pt-0'
                              )}
                            >
                              <FormMessage />
                            </div>
                          </AccordionItem>
                        </Accordion>
                      </FormItem>
                    )}
                  />
                  <Separator />
                  {/*
                   * Preferred Budget
                   */}
                  <FormField
                    control={form.control}
                    name='preferred_budget'
                    render={({ field: { value, onChange, name } }) => (
                      <FormItem className='space-y-3'>
                        <Accordion
                          type='single'
                          collapsible
                          value={preferredBudgetAccordionState}
                          onValueChange={setPreferredBudgetAccordionState}
                          onKeyDown={(event) => {
                            (event.code === 'Escape' ||
                              event.code === 'Enter') &&
                              focusRefObject(name, event);
                          }}
                          className={formFieldWrapperClass}
                        >
                          <AccordionItem
                            value='item-1'
                            className='group border-none'
                          >
                            <AccordionTrigger
                              ref={preferredBudgetTriggerRef}
                              onClick={() => {
                                focusRefObject(name);
                              }}
                              className={cn(
                                'relative py-0 transition duration-300 ease-in-out hover:no-underline focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0',
                                'group-focus-within:bg-white/50 group-hover:bg-white/50'
                              )}
                            >
                              <FormLabel
                                className={cn(
                                  formLabelClass,
                                  'hover:cursor-pointer'
                                )}
                              >
                                <div className='flex w-full flex-col'>
                                  <span className='w-full pr-4 text-left'>
                                    Preferred Budget
                                  </span>
                                  <span className='flex w-full items-center justify-start text-start font-semibold'>
                                    {value}
                                  </span>
                                </div>
                                {/* Rotate on open/close and swap colors on hover*/}
                                <div className='mr-4 size-10'>
                                  <Image
                                    src='/arrow-inverted.svg'
                                    alt='Dropdown arrow'
                                    width={40}
                                    height={40}
                                    className={cn(
                                      'absolute transition-all duration-300',
                                      preferredBudgetAccordionState === ''
                                        ? 'rotate-0'
                                        : 'rotate-180'
                                    )}
                                  />
                                  <Image
                                    src='/arrow.svg'
                                    alt='Dropdown arrow'
                                    width={40}
                                    height={40}
                                    className={cn(
                                      'absolute opacity-100 transition-all duration-300 hover:opacity-0',
                                      preferredBudgetAccordionState === ''
                                        ? 'rotate-0'
                                        : 'rotate-180'
                                    )}
                                  />
                                </div>
                              </FormLabel>
                            </AccordionTrigger>
                            <AccordionContent
                              className={cn(
                                'pb-0 duration-300',
                                'group-focus-within:bg-white/50 group-hover:bg-white/50'
                              )}
                            >
                              <FormControl>
                                <ToggleGroup
                                  ref={preferredBudgetToggleRef}
                                  type='single'
                                  onValueChange={onChangeHandler(
                                    onChange,
                                    'preferred_budget'
                                  )}
                                  defaultValue={value}
                                  className='flex flex-col gap-0'
                                >
                                  {preferredBudgetOptions.map((option, i) => {
                                    return (
                                      <FormItem
                                        className='flex w-full items-center space-x-3 space-y-0'
                                        key={i}
                                      >
                                        <FormControl>
                                          <ToggleGroupItem
                                            value={option.value}
                                            onClick={() => focusRefObject(name)}
                                            aria-label='Toggle all'
                                            className={cn(
                                              'w-full justify-start rounded-none py-7 pl-8 ring-offset-0 focus-within:bg-white/60 hover:bg-white/60 hover:text-foreground focus-visible:ring-0 group-focus-within:ring-offset-0 data-[state=on]:bg-white/90 data-[state=on]:text-foreground',
                                              'focus-within:bg-white/60 hover:bg-white/60'
                                            )}
                                          >
                                            <span className='pl-0 text-base'>
                                              {option.label}
                                            </span>
                                          </ToggleGroupItem>
                                        </FormControl>
                                      </FormItem>
                                    );
                                  })}
                                </ToggleGroup>
                              </FormControl>
                            </AccordionContent>
                            <div
                              className={cn(
                                'group-focus-within:bg-white/15 group-hover:bg-white/15',
                                preferredBudgetAccordionState !== '' &&
                                  form.formState.errors.preferred_budget
                                  ? 'pt-4'
                                  : 'pt-0'
                              )}
                            >
                              <FormMessage />
                            </div>
                          </AccordionItem>
                        </Accordion>
                      </FormItem>
                    )}
                  />
                  <Separator />
                </div>
              </div>
              {/*
               * Submit
               */}
              <div className='mt-6 grid grid-cols-8 space-y-4 md:mt-12 lg:space-x-4 lg:space-y-0'>
                <div className='col-span-8 md:col-span-4 md:col-start-3 lg:col-span-2 lg:col-start-4'>
                  <Button
                    type='submit'
                    name='Submit'
                    aria-label='Submit'
                    className='w-full rounded-3xl border border-foreground bg-white py-6 font-atica text-base font-normal text-foreground hover:border-white hover:bg-foreground hover:text-white'
                    disabled={pending}
                  >
                    {pending ? (
                      <LoaderIcon className='animate-spin-slow text-foreground ease-in-out' />
                    ) : (
                      <span className='uppercase'>Submit</span>
                    )}
                  </Button>
                </div>
                <div
                  className={cn(
                    'duration-600 col-span-8 row-start-2 rounded-3xl border bg-white px-6 py-3 text-base transition-all md:col-span-4 md:col-start-3 lg:col-start-6 lg:row-start-1',
                    'border-red-700 text-red-700',
                    message === SUCCESS_MESSAGE &&
                      'border-green-700 text-green-700',
                    showMessage ? 'block opacity-100' : 'hidden opacity-0'
                  )}
                >
                  {message}
                </div>
              </div>
              <p className='mb-4 mt-8 text-center'>
                By providing your name and phone number, you consent to
                receiving sales calls and texts from or on behalf of THE PERRIE
                at the number provided. Consent to such communications is not a
                condition of purchasing any property, goods, or services.
                Message and data rates may apply.
              </p>
            </form>
          </Form>
        </div>
      </LayoutGrid>
    </>
  );
};
