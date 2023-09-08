import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {},
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.plate-shadow': {
          boxShadow: '0px 2px 4px #BFC4C933, 0px 3px 4px #BFC4C92D, 0px 1px 5px #BFC4C93D',
        },
      });
    }),
  ],
};
export default config;
