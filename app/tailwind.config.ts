import colors from 'tailwindcss/colors';
import plugin from 'tailwindcss/plugin';
import { Config, ResolvableTo, ScreensConfig } from 'tailwindcss/types/config';

const SCREENS: ResolvableTo<ScreensConfig> = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px',
};

const config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    screens: SCREENS,
    colors: {
      primary: {
        base: colors.slate,
        outline: {
          light: colors.slate[200],
          dark: colors.slate[800],
        },
        bg: {
          lightest: colors.slate[100],
          lighter: colors.slate[200],
          light: colors.slate[300],
          dark: colors.slate[400],
          darker: colors.slate[600],
          darkest: colors.slate[700],
        },
      },
      success: {
        base: {
          light: colors.teal[500],
          dark: colors.teal[700],
        },
        hover: {
          light: colors.teal[600],
          dark: colors.teal[800],
        },
      },
      error: {
        base: {
          light: colors.rose[700],
          dark: colors.rose[100],
        },
        bg: {
          light: colors.rose[100],
          dark: colors.rose[500],
        },
        hover: {
          light: colors.rose[200],
          dark: colors.rose[800],
        },
      },
      warning: {
        base: {
          light: colors.orange[400],
          dark: colors.orange[600],
        },
      },
      ...colors,
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-onest)'],
        mono: ['var(--font-sometype-mono)'],
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
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(({ addUtilities, addComponents }) => {
      addUtilities({
        '.shadow-top': {
          'box-shadow':
            'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
        },
        '.overflow-anywhere': {
          overflowWrap: 'anywhere',
        },
        '.scrollbar-stable': {
          'scrollbar-gutter': 'stable',
        },
      });
      addComponents({
        '.title': {
          padding: '0 0.5rem',
          'font-size': '1.5rem',
          'line-height': '2rem',
          'font-weight': '600',
          'margin-bottom': '1rem',
          width: 'fit-content',
          'background-image': `linear-gradient(transparent 60%, ${colors.teal[300]} 40%)`,
          'background-size': '100%',
          'background-repeat': 'no-repeat',
          'background-position': '1.25rem',
          transition: 'background 0.2s, transform 0.2s',
          '&:hover': {
            'background-position': '-1rem',
            transform: 'translateX(0.5rem)',
          },
        },
        '.dark .title': {
          'background-image': `linear-gradient(transparent 60%, ${colors.teal[700]} 40%)`,
        },
        '.btn-context-menu': {
          position: 'relative',
          display: 'flex',
          height: '2rem',
          'align-items': 'center',
          gap: '4px',
          '& > svg': {
            height: '100%',
            width: '2rem',
            fill: 'inherit !important',
          },
          '&:hover': {
            fill: colors.slate[200],
            color: colors.slate[200],
            '&:disabled': {
              fill: 'inherit',
              color: 'inherit',
            },
          },
          '&:disabled': {
            opacity: '0.5',
          },
        },
        '.dark .btn-context-menu': {
          fill: colors.slate[200],
          '&:hover': {
            fill: colors.slate[900],
            color: colors.slate[900],
          },
        },
      });
    }),
  ],
} satisfies Config;

export default config;
