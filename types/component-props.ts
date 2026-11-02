type HEADLINE_TAGS = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type TEXT_TAGS =
  | 'p'
  | 'span'
  | 'address'
  | 'cite'
  | 'code'
  | 'em'
  | 'strong'
  | 'time';
type SIZES = 'xs' | 's' | 'm' | 'l' | 'xl';
type HORIZONTAL_ALIGNMENTS = 'left' | 'center' | 'right';
type VERTICAL_ALIGNMENTS = 'top' | 'center' | 'bottom';
type WIDTHS = 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4' | '5/6';
type ASPECT_RATIOS = '16-9' | '4-3' | 'original';
type FONT_FAMILY = 'Lora' | 'Atica';
// type TEXT_TYPES = 'navigation' | 'headline' | 'text' | 'factsHeadline' | 'factsText' | 'floorPlanText ' | 'button' | ''
type HEADLINE_TYPES = 'default' | 'facts' | 'availability';
type DISPLAY = 'regular' | 'fullbleed' | 'fullbleedMobileOnly';
type TEXT_COLORS =
  | 'default'
  | 'appleGreen'
  | 'babyBlue'
  | 'orange'
  | 'peach'
  | 'pink'
  | 'seafoamBlue'
  | 'teal';
type BACKGROUND_COLORS =
  | 'transparent'
  | 'beige'
  | 'blue'
  | 'lightBeige'
  | 'lightGreen'
  | 'peach'
  | 'pink'
  | 'slate';

export const textColorClass = {
  default: 'text-text-default',
  appleGreen: 'text-text-appleGreen',
  babyBlue: 'text-text-babyBlue',
  orange: 'text-text-orange',
  peach: 'text-text-peach',
  pink: 'text-text-pink',
  seafoamBlue: 'text-text-seafoamBlue',
  teal: 'text-text-teal',
};

export const backgroundClass = {
  transparent: 'bg-background-transparent',
  beige: 'bg-background-beige',
  blue: 'bg-background-blue',
  lightBeige: 'bg-background-lightBeige',
  lightGreen: 'bg-background-lightGreen',
  peach: 'bg-pbackground-each',
  pink: 'bg-background-pink',
  slate: 'bg-background-slate',
};

export type {
  ASPECT_RATIOS,
  BACKGROUND_COLORS,
  DISPLAY,
  FONT_FAMILY,
  HEADLINE_TAGS,
  HEADLINE_TYPES,
  HORIZONTAL_ALIGNMENTS,
  SIZES,
  TEXT_TAGS,
  TEXT_COLORS,
  VERTICAL_ALIGNMENTS,
  WIDTHS,
};
