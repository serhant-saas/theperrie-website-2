import type { PortableTextComponents } from '@portabletext/react';
import { PortableText } from '@portabletext/react';

import { normalizeRichTextHref } from '@/lib/rich-text-link';
import type { RichText as RichTextType } from '@/sanity/types';

const defaultComponents: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const href = normalizeRichTextHref(value?.href);

      if (!href) {
        return <>{children}</>;
      }

      const isExternalUrl = /^https?:\/\//i.test(href);

      return (
        <a
          href={href}
          {...(isExternalUrl
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
  block: {
    normal: ({ children }) => {
      if (
        !children ||
        (Array.isArray(children) &&
          children.every(
            (child) => typeof child === 'string' && child.trim() === ''
          ))
      ) {
        return <br />;
      }
      return (
        <span className='whitespace-pre-wrap text-left align-text-top tracking-normal [&_span]:underline [&_span]:!decoration-1 [&_span]:underline-offset-4 md:[&_span]:underline-offset-8 lg:[&_span]:!decoration-2'>
          {children}
        </span>
      );
    },
  },
};

type RichTextProps = {
  text?: RichTextType;
  components?: PortableTextComponents;
};

export const RichText: React.FC<RichTextProps> = ({ text, components }) => {
  if (!text) return null;

  return (
    <PortableText value={text} components={components ?? defaultComponents} />
  );
};
