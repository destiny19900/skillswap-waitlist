/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './sections/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Dark theme colors
        dark: {
          50: '#C1C2C5',
          100: '#A6A7AC',
          200: '#909096',
          300: '#5C5F66',
          400: '#373A40',
          500: '#2C2E33',
          600: '#25262B',
          700: '#1A1B1E',
          800: '#141517',
          900: '#101113',
        },
        primary: {
          50: '#E6F7FF',
          100: '#BAE7FF',
          200: '#91D5FF',
          300: '#69C0FF',
          400: '#40A9FF',
          500: '#1890FF',
          600: '#096DD9',
          700: '#0050B3',
          800: '#003A8C',
          900: '#002766',
        },
        secondary: {
          50: '#F5F5FF',
          100: '#EDEDFF',
          200: '#D6D6FF',
          300: '#B5B5FF',
          400: '#9999FF',
          500: '#8080FF',
          600: '#6B6BFF',
          700: '#5C5CD6',
          800: '#4D4DB3',
          900: '#3F3F8C',
        },
        accent: {
          50: '#EDFBF9',
          100: '#D0F4EE',
          200: '#A0E9DC',
          300: '#5BD9C3',
          400: '#33C9AF',
          500: '#14B8A0',
          600: '#0FAC95',
          700: '#0A9283',
          800: '#077A71',
          900: '#056661',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in-up': 'fadeInUp 0.7s ease-out',
        'slide-in-right': 'slideInRight 0.7s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(24, 144, 255, 0.2)' },
          '100%': { boxShadow: '0 0 15px rgba(24, 144, 255, 0.6)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
} 