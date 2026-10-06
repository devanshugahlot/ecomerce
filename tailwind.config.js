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
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#00A86B', // Emerald primary
          600: '#008F5B',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
        cream: {
          50: '#FFFDF9',
          100: '#FEF8EC', // Bold Care Banner Cream background
          200: '#FDEEAA',
          300: '#FCD777',
          400: '#FBBF24',
          500: '#F59E0B',
        },
        pinkish: {
          50: '#FFF0F5', // Bold Care ticker banner ribbon
          100: '#FCE7F3',
          200: '#FBCFE8',
        },
        dark: {
          50: '#F3F4F6',
          100: '#E5E7EB',
          200: '#D1D5DB',
          300: '#9CA3AF',
          400: '#4B5563',
          500: '#1F2937',
          600: '#111827',
          700: '#0B0F17',
          800: '#070A0F',
          900: '#030508',
        },
        accent: {
          amber: '#D97706',
          copper: '#C2410C',
          gold: '#F59E0B',
          navy: '#1E293B',
          slate: '#334155',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(0, 168, 107, 0.25)',
        'glow-amber': '0 0 20px -5px rgba(217, 119, 6, 0.25)',
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
