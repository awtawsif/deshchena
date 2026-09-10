/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bengal: {
          green: '#006a4e',
          'green-dark': '#00523c',
          'green-light': '#0b8262',
          red: '#f42a41',
          'red-dark': '#c81b2f',
          gold: '#e6a100',
        },
      },
    },
  },
  plugins: [],
};
