const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getTelDigits = (value: string) => value.replace(/\D/g, '');

export const isValidRichTextLink = (value?: string): boolean => {
  if (!value?.trim()) return false;

  const trimmed = value.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      new URL(trimmed);
      return true;
    } catch {
      return false;
    }
  }

  if (/^mailto:/i.test(trimmed)) {
    return EMAIL_PATTERN.test(trimmed.replace(/^mailto:/i, '').trim());
  }

  if (/^tel:/i.test(trimmed)) {
    const digits = getTelDigits(trimmed.replace(/^tel:/i, ''));
    return digits.length >= 7 && digits.length <= 15;
  }

  if (EMAIL_PATTERN.test(trimmed)) {
    return true;
  }

  const telDigits = getTelDigits(trimmed);
  return telDigits.length >= 7 && telDigits.length <= 15;
};

export const normalizeRichTextHref = (value?: string): string | undefined => {
  if (!value?.trim() || !isValidRichTextLink(value)) return undefined;

  const trimmed = value.trim();

  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^mailto:/i.test(trimmed)) return trimmed;
  if (/^tel:/i.test(trimmed)) return trimmed;

  if (EMAIL_PATTERN.test(trimmed)) {
    return `mailto:${trimmed}`;
  }

  return `tel:${getTelDigits(trimmed)}`;
};

export const richTextLinkValidationMessage =
  'Must be a valid URL (http/https), email address, or phone number.';
