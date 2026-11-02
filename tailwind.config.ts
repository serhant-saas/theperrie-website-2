import type { Config } from 'tailwindcss';

const logoBrown = '#473D2C';
const hotspot = '#47D065';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontSize: {
        /** Off Canvas Navigation */
        'navigation-desktop': [
          '4rem',
          {
            lineHeight: '120%',
            letterSpacing: '0%',
          },
        ],
        'navigation-mobile': [
          '1.563rem',
          {
            lineHeight: '90%',
            letterSpacing: '0%',
          },
        ],

        /** Headline */
        'headline-desktop': [
          '3rem',
          {
            lineHeight: '90%',
            letterSpacing: '0%',
          },
        ],
        'headline-mobile': [
          '1.125rem',
          {
            lineHeight: '27px',
            letterSpacing: '0%',
          },
        ],
        /** Text */

        desktop: [
          '1.25rem',
          {
            lineHeight: '132.5%',
            letterSpacing: '0%',
          },
        ],
        mobile: [
          '1rem',
          {
            lineHeight: '132.5%',
            letterSpacing: '0%',
          },
        ],
        /** Availabiltiy */
        'headline-availability-desktop': [
          '3rem',
          {
            lineHeight: '102.5%',
            letterSpacing: '0%',
          },
        ],
        'headline-availability-mobile': [
          '0.875rem',
          {
            lineHeight: '102.5%',
            letterSpacing: '0%',
          },
        ],
        /** Facts */
        'headline-facts-desktop': [
          '1.5rem',
          {
            lineHeight: '102.5%',
            letterSpacing: '-1%',
          },
        ],
        'headline-facts-mobile': [
          '1.653rem',
          {
            lineHeight: '102.5%',
            letterSpacing: '-1%',
          },
        ],
        'facts-desktop': [
          '1rem',
          {
            lineHeight: '120%',
            letterSpacing: '0%',
          },
        ],
        'facts-mobile': [
          '1rem',
          {
            lineHeight: '120%',
            letterSpacing: '0%',
          },
        ],
        /** Buttons */
        'buttons-desktop': [
          '1rem',
          {
            lineHeight: '27px',
            letterSpacing: '0%',
          },
        ],
        'buttons-mobile': [
          '0.9rem',
          {
            lineHeight: '27px',
            letterSpacing: '0%',
          },
        ],
      },
      gap: {
        images: '0.75rem',
        desktop: '0.75rem',
        mobile: '0.6rem',
      },
      fontFamily: {
        default: ['var(--font-lora)'],
        atica: ['var(--font-atica)'],
      },
      colors: {
        border: {
          DEFAULT: logoBrown,
        },
        input: 'hsl(var(--input))',
        ring: logoBrown,
        background: {
          green: '#EEDDEE',
          lightBlue: '#E7E0D8',
          orange: '#E2E0B2',
          teal: '#E7E0D8',
          paleHazelnut: '#E9E0D7',
          beige: '#E8E0D7',
          blue: '#BFDAE0',
          lightBeige: '#F3EBE1',
          lightGreen: '#E2E0AC',
          peach: '#F3CAB4',
          pink: '#F0DCEF',
          slate: '#C8D0C9',
        },
        text: {
          default: logoBrown,
          teal: '#8CC2C2',
          appleGreen: '#93C284',
          babyBlue: '#B3DAF3',
          seafoamBlue: '#B2D5C7',
          pink: '#E9A5C4',
          orange: '#F9A969',
          peach: '#FAB89A',
        },
        foreground: logoBrown,
        hotspot: hotspot,
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'marker-scale-down': {
          from: { transform: 'scale(1.5)' },
          to: { transform: 'scale(1.0)' },
        },
        'marker-scale-up': {
          from: { transform: 'scale(1.0)' },
          to: { transform: 'scale(1.5)' },
        },
        'tooltip-opacity-up': {
          from: { opacity: '0.0' },
          to: { opacity: '1.0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'image-with-hotspots-ping':
          'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'spin-slow': 'spin 2s linear infinite',
        'marker-scale-down': 'marker-scale-down 0.3s ease-out',
        'marker-scale-up': 'marker-scale-up 0.3s ease-out',
        'tooltip-opacity-up': 'tooltip-opacity-up 0.3s ease-out',
      },
      screens: {
        '3xl': '1920px',
      },
      zIndex: {
        header: '40',
        text: '30',
        overlay: '20',
        image: '10',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
