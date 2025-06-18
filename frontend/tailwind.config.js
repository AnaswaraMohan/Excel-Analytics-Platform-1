/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      },
      boxShadow: {
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      },
      colors: {
        'blue': {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#bddcff',
          300: '#85c2ff',
          400: '#4aa3ff',
          500: '#1a84ff',
          600: '#0067f5',
          700: '#0053d6',
          800: '#0044ab',
          900: '#003c8a',
        },
        'indigo': {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c7d5ff',
          300: '#a4b9ff',
          400: '#8493ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
    },
  },
  plugins: [],
}
