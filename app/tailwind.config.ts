import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

const config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1400px',
    },
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
          light: colors.rose[500],
          dark: colors.rose[700],
        },
        hover: {
          light: colors.rose[600],
          dark: colors.rose[800],
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
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
