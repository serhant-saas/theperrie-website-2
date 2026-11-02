import React from 'react';

import type { SIZES, TEXT_TAGS } from '@/types/component-props';

export type TextProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  tag?: TEXT_TAGS;
  size?: Extract<SIZES, 's' | 'm' | 'l'>;
};

export const Text: React.FC<TextProps> = ({
  children,
  tag: Component = 'p',
  size,
  ...rest
}) => {
  return <Component {...rest}>{children}</Component>;
};
