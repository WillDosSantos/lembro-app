/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
          fontFamily: {
            lexend: ['var(--font-lexend)'],
          },
        },
      },
      plugins: [typography],
  };
  