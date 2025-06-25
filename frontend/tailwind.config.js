/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],  theme: {
    extend: {
      fontFamily: {
        'sans': ['Bricolage Grotesque', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        'primary': ['Bricolage Grotesque', 'sans-serif'],
        'secondary': ['Albert Sans', 'sans-serif'],
        'cardo': ['Cardo', 'serif'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'gradient': 'gradient 6s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': '0% 50%'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': '100% 50%'
          }
        }
      },
      boxShadow: {
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      },      backgroundImage: {
        'gradient-green-radial': 'radial-gradient(#3A9647, #374434, #282B28)',
        'gradient-green-to-r': 'linear-gradient(90deg, #3A9647, #374434, #282B28)',
        'gradient-green-to-br': 'linear-gradient(135deg, #3A9647, #374434, #282B28)',
        'gradient-green-subtle': 'linear-gradient(135deg, #f0f9f4, #dcfce7)',
        'gradient-hero': 'linear-gradient(to bottom right, #f0f9f4, #ffffff)',
        'gradient-dark': 'linear-gradient(135deg, #282B28, #374434, #3A9647)',
        'gradient-text': 'linear-gradient(to right, #3A9647, #4ade80, #86efac, #3A9647)',
      },
      colors: {
        // Green theme palette
        'malachite': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#33E27C',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        'limegreen': {
          50: '#f7fee7',
          100: '#ecfccb',
          200: '#d9f99d',
          300: '#bef264',
          400: '#a3e635',
          500: '#62C935',
          600: '#65a30d',
          700: '#4d7c0f',
          800: '#365314',
          900: '#1a2e05',
        },        'pigmentgreen': {
          50: '#f0f9f4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#3A9647',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        'blackolive': {
          50: '#f8faf9',
          100: '#f1f5f2',
          200: '#e2e8e4',
          300: '#cbd5d0',
          400: '#94a3a0',
          500: '#374434',
          600: '#2d372b',
          700: '#252b23',
          800: '#1f221e',
          900: '#1a1c19',
        },
        'jet': {
          50: '#f8f9f8',
          100: '#f1f2f1',
          200: '#e2e4e2',
          300: '#cbd0cb',
          400: '#94a094',
          500: '#282B28',
          600: '#222422',
          700: '#1d1f1d',
          800: '#181918',
          900: '#141514',
        },
        // Keep original colors for compatibility
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
        'green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#33E27C',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
}
