/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#14452F',
          greenDark: '#0F3524',
        },
        pureBlack: '#000000',
        richBlack: '#0A0A0A',
        grey: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#6B6B6B',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },
        primary: {
          DEFAULT: '#14452F',
          hover: '#0F3524',
          50: '#F5F5F5',
          100: '#E5E5E5',
          500: '#14452F',
          600: '#0F3524',
          700: '#0F3524',
        },
        secondary: {
          DEFAULT: '#FFFFFF',
          hover: '#F5F5F5',
          50: '#FAFAFA',
          500: '#6B6B6B',
          600: '#404040',
          700: '#171717',
        },
        accent: {
          DEFAULT: '#14452F',
          light: '#F5F5F5',
          500: '#14452F',
        },
        dark: {
          950: '#0F3524',
          900: '#14452F',
          800: '#14452F',
          700: '#0F3524',
          600: '#14452F',
          500: '#0F3524',
          400: '#1F5A3E',
          300: '#8EAA9D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        serif: ['Poppins', 'serif'],
      },
      boxShadow: {
        'glow-primary': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'glow-secondary': '0 8px 30px rgba(0, 0, 0, 0.08)',
        'glow-accent': '0 8px 25px rgba(0, 0, 0, 0.1)',
        'glow-forest': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'glow-gold': '0 8px 25px rgba(0, 0, 0, 0.12)',
        'glow-amber': '0 8px 25px rgba(0, 0, 0, 0.12)',
        'glow': '0 8px 25px rgba(0, 0, 0, 0.08)',
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}


