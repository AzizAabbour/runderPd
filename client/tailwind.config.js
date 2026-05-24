/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          DEFAULT: '#07111f',
          soft: '#0b1729',
          panel: 'rgba(10, 16, 32, 0.72)',
          light: '#f5f7fb',
        },
        border: 'rgba(148, 163, 184, 0.16)',
        primary: {
          DEFAULT: '#38bdf8',
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
        },
        accent: {
          DEFAULT: '#8b5cf6',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      boxShadow: {
        glass: '0 24px 80px rgba(15, 23, 42, 0.24)',
        glow: '0 0 40px rgba(56, 189, 248, 0.24)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(14px, -16px, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        drift: 'drift 10s ease-in-out infinite',
        shimmer: 'shimmer 8s linear infinite',
        fadeUp: 'fadeUp 0.45s ease-out both',
      },
      backgroundImage: {
        'radial-glow':
          'radial-gradient(circle at top left, rgba(56, 189, 248, 0.18), transparent 35%), radial-gradient(circle at right top, rgba(139, 92, 246, 0.16), transparent 30%), radial-gradient(circle at bottom left, rgba(34, 197, 94, 0.10), transparent 28%)',
      },
    },
  },
  plugins: [],
};

