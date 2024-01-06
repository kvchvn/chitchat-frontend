import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
    extend: {
      fontFamily: {
        sans: ['var(--font-onest)'],
        mono: ['var(--font-sometype-mono)'],
      },
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/ui/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {},
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.overflow-anywhere': {
          overflowWrap: 'anywhere',
        },
      });
    }),
  ],
};
} satisfies Config;
export default config;
