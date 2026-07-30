import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem',
      },
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        forest: {
          50: '#F1F6F2',
          100: '#DCE9DD',
          200: '#B7D3BA',
          300: '#85B38B',
          400: '#4F8A58',
          500: '#2D6B37',
          600: '#1E5429',
          700: '#164220',
          800: '#0F3418',
          900: '#0B2B13',
          950: '#06190B',
        },
        gold: {
          50: '#FBF5E6',
          100: '#F5E8BD',
          200: '#EDD78F',
          300: '#E4C35D',
          400: '#D9AE37',
          500: '#C69C2E',
          600: '#AA7E23',
          700: '#88601D',
          800: '#66481A',
          900: '#4D3717',
        },
        cream: {
          50: '#FDF9F0',
          100: '#FAF3E2',
          200: '#F5E9CA',
          300: '#EEDBA5',
          400: '#E6CA82',
        },
        ink: {
          50: '#F7F6F2',
          100: '#EBE9DF',
          200: '#D8D5C4',
          300: '#BCB79E',
          400: '#9C9677',
          500: '#7F7857',
          600: '#655F44',
          700: '#504C37',
          800: '#423F2F',
          900: '#3A372A',
        },
        glass: {
          light: 'rgba(255,255,255,0.05)',
          DEFAULT: 'rgba(255,255,255,0.08)',
          strong: 'rgba(255,255,255,0.14)',
          border: 'rgba(255,255,255,0.12)',
          dark: 'rgba(11, 43, 19, 0.55)',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['clamp(2.75rem, 6vw + 1rem, 5rem)', {
          lineHeight: '1.05',
          letterSpacing: '-0.02em',
          fontWeight: '700',
        }],
        'display-2': ['clamp(2.25rem, 4vw + 0.75rem, 3.75rem)', {
          lineHeight: '1.1',
          letterSpacing: '-0.015em',
          fontWeight: '700',
        }],
        'h2': ['clamp(1.875rem, 2.5vw + 0.75rem, 2.75rem)', {
          lineHeight: '1.2',
          letterSpacing: '-0.01em',
          fontWeight: '700',
        }],
        'h3': ['clamp(1.5rem, 1.8vw + 0.5rem, 2.25rem)', {
          lineHeight: '1.25',
          letterSpacing: '-0.005em',
          fontWeight: '600',
        }],
        'eyebrow': ['0.8125rem', {
          lineHeight: '1.2',
          letterSpacing: '0.22em',
          fontWeight: '600',
        }],
        'lead': ['1.125rem', { lineHeight: '1.7', fontWeight: '400' }],
      },
      borderRadius: {
        'xl': '18px',
        '2xl': '28px',
        '3xl': '40px',
      },
      boxShadow: {
        'soft': '0 8px 32px -8px rgba(11, 43, 19, 0.08)',
        'elevate': '0 18px 60px -18px rgba(11, 43, 19, 0.18)',
        'gold': '0 14px 48px -10px rgba(198, 156, 46, 0.35)',
        'card-hover': '0 28px 80px -20px rgba(11, 43, 19, 0.28)',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(90deg, rgba(6,25,11,0.88) 0%, rgba(6,25,11,0.72) 45%, rgba(6,25,11,0.45) 100%)',
        'hero-gradient-mobile':
          'linear-gradient(180deg, rgba(6,25,11,0.82) 0%, rgba(6,25,11,0.65) 50%, rgba(6,25,11,0.85) 100%)',
        'section-divider':
          'linear-gradient(90deg, rgba(198,156,46,0) 0%, rgba(198,156,46,0.65) 50%, rgba(198,156,46,0) 100%)',
      },
      keyframes: {
        'ken-burns': {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.12) translate(-2%, -1%)' },
        },
        'bob-vertical': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'ken-burns': 'ken-burns 20s ease-out forwards',
        'bob-vertical': 'bob-vertical 2.4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
