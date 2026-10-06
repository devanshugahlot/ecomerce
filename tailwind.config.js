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
        forest: {
          50: '#EDF5F0',
          100: '#D5E6DC',
          200: '#AECCCB',
          300: '#7FA897',
          400: '#4F846D',
          500: '#155E3E', // Hover Forest
          600: '#0F3D2B', // Primary Deep Forest Green
          700: '#0B3022',
          800: '#072117',
          900: '#04130D',
        },
        brand: {
          50: '#EDF5F0',
          100: '#D5E6DC',
          200: '#AECCCB',
          300: '#7FA897',
          400: '#4F846D',
          500: '#0F3D2B', // Primary Forest Green
          600: '#155E3E',
          700: '#0B3022',
          800: '#072117',
          900: '#04130D',
        },
        gold: {
          50: '#FAF4E8',
          100: '#F3E5C7',
          200: '#E7CE97',
          300: '#DDB872',
          400: '#B8924A', // Warm Gold Accent
          500: '#947234',
          600: '#735624',
          700: '#533C17',
        },
        ivory: {
          50: '#FFFDFB',
          100: '#FAF7F2', // Warm Ivory Background
          200: '#F4EFE6',
          300: '#E8E0D2',
        },
        sage: {
          50: '#F5F8F5',
          100: '#EEF3EE', // Soft Sage Tint
          200: '#E2EBE2',
          300: '#C9DAC9',
        },
        charcoal: {
          50: '#F6F7F7',
          100: '#E4E6E5',
          300: '#9E9E9D',
          500: '#5B655F', // Secondary Text
          900: '#1B1F1D', // Primary Text
        },
        terracotta: {
          500: '#B5472F', // Sale/Alert Muted Terracotta
        },
        dark: {
          900: '#070A11',
          800: '#0B0F17',
          700: '#0F172A',
          600: '#1E293B',
          500: '#334155',
          400: '#475569',
          300: '#64748B',
          200: '#94A3B8',
          100: '#CBD5E1',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow-forest': '0 8px 30px rgba(15, 61, 43, 0.12)',
        'glow-gold': '0 8px 25px rgba(184, 146, 74, 0.18)',
        'premium': '0 10px 40px -10px rgba(27, 31, 29, 0.07)',
        'card': '0 4px 20px -2px rgba(15, 61, 43, 0.05)',
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

