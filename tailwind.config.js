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
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#0A7E8C',
          600: '#086672',
          700: '#064E57',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          hover: 'var(--secondary-hover)',
          50: '#EDF5F0',
          500: '#0F3D2B',
          600: '#155E3E',
          700: '#0B3022',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          light: 'var(--accent-light)',
          500: '#D4A373',
        },
        forest: {
          50: '#EDF5F0',
          100: '#D5E6DC',
          200: '#AECCCB',
          300: '#7FA897',
          400: '#4F846D',
          500: '#155E3E',
          600: '#0F3D2B',
          700: '#0B3022',
          800: '#072117',
          900: '#04130D',
        },
        brand: {
          50: '#F0F9FA',
          100: '#E0F2F4',
          500: '#0A7E8C',
          600: '#086672',
          700: '#0F3D2B',
        },
        gold: {
          50: '#FAF4E8',
          100: '#F3E5C7',
          400: '#D4A373',
          500: '#B8924A',
          600: '#947234',
        },
        ivory: {
          50: '#FFFDFB',
          100: '#F8FAFC',
          200: '#F1F5F9',
        },
        sage: {
          50: '#F5F8F5',
          100: '#F0F4F5',
          200: '#E2EBE2',
        },
        charcoal: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          500: '#475569',
          900: '#0F172A',
        },
        dark: {
          950: '#000000',
          900: '#08090C',
          800: '#111318',
          700: '#181B22',
          600: '#222630',
          500: '#2D3342',
          400: '#3E4659',
          300: '#5B667E',
        },
        terracotta: {
          500: '#B5472F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        serif: ['Poppins', 'serif'],
      },
      boxShadow: {
        'glow-primary': 'var(--shadow-glow-primary)',
        'glow-secondary': 'var(--shadow-glow-secondary)',
        'glow-accent': 'var(--shadow-glow-accent)',
        'glow-forest': '0 8px 30px rgba(15, 61, 43, 0.12)',
        'glow-gold': '0 8px 25px rgba(212, 163, 115, 0.25)',
        'glow-amber': '0 8px 25px rgba(245, 158, 11, 0.25)',
        'glow': '0 8px 25px rgba(10, 126, 140, 0.15)',
        'premium': 'var(--shadow-premium)',
        'card': 'var(--shadow-card)',
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


