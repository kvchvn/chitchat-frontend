import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {},
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.active-link': {
          borderRight: '2px solid black',
        },
        '.overflow-anywhere': {
          overflowWrap: 'anywhere',
        },
      });
    }),
  ],
};
export default config;
