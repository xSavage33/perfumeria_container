/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#CFE8E1',
          50: '#F5FAF9',
          100: '#E8F4F1',
          200: '#CFE8E1',
          300: '#A8D4C8',
          400: '#7DBFAD',
          500: '#52A992',
          600: '#3D8A76',
          700: '#2E6A5A',
          800: '#1F4B3F',
          900: '#102B24',
        },
        secondary: {
          DEFAULT: '#002941',
          50: '#E6EEF3',
          100: '#B3CCD9',
          200: '#80AABF',
          300: '#4D88A5',
          400: '#1A668B',
          500: '#004471',
          600: '#003759',
          700: '#002941',
          800: '#001C29',
          900: '#000E11',
        },
        accent: {
          DEFAULT: '#FD6E6E',
          50: '#FFF0F0',
          100: '#FFD9D9',
          200: '#FEB3B3',
          300: '#FE8D8D',
          400: '#FD6E6E',
          500: '#FC3F3F',
          600: '#E81818',
          700: '#B21212',
          800: '#7C0D0D',
          900: '#460707',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
