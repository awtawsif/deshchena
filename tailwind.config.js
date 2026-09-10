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
      animation: {
        'bounce-short': 'bounce-short 0.5s ease-in-out',
      },
      keyframes: {
        'bounce-short': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
