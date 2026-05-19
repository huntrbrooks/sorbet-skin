import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FFF7F2',
        foreground: '#2A1810',
        muted: '#FBE9DF',
        'muted-foreground': '#8A6A5C',
        accent: '#E89BAE',
        'accent-secondary': '#F5C6C0',
        'accent-foreground': '#FFFFFF',
        border: '#F1DDD0',
        card: '#FFFFFF',
        ring: '#E89BAE',

        // Legacy Sorbet Skin aliases retained so the existing component markup
        // can inherit the Paullie-inspired system without one-off utility churn.
        warmwhite: '#FFF7F2',
        buttercream: '#FBE9DF',
        vanilla: '#FFF7F2',
        peach: '#FBC4A8',
        blush: '#E89BAE',
        lavender: '#F1DDD0',
        honey: '#F5C6C0',
        caramel: '#E89BAE',
        cocoa: '#2A1810',
        mint: '#FBE9DF',
        charcoal: '#2A1810',
      },
      fontFamily: {
        display: ['Fraunces', 'Recoleta', 'Georgia', 'serif'],
        body: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        gloss: '0 18px 40px rgba(232, 155, 174, 0.18)',
        soft: '0 12px 30px rgba(42, 24, 16, 0.06)',
        button: '0 1px 2px rgba(42, 24, 16, 0.04), 0 12px 24px rgba(232, 155, 174, 0.28)',
        editorial: '0 1px 2px rgba(42, 24, 16, 0.04)',
      },
      borderRadius: {
        DEFAULT: '0.875rem',
        sm: '0.5rem',
        md: '0.875rem',
        lg: '1.25rem',
        xl: '1.75rem',
        '2xl': '2.25rem',
      },
      animation: {
        floaty: 'floaty 7s ease-in-out infinite',
        ribbon: 'ribbon 12s ease-in-out infinite',
        shimmer: 'shimmer 2.8s ease-in-out infinite',
        fadeUp: 'fadeUp 650ms ease both',
        marquee: 'marquee 32s linear infinite',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0) rotate(-1deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1deg)' },
        },
        ribbon: {
          '0%, 100%': { transform: 'translateX(-3%) scaleX(1)' },
          '50%': { transform: 'translateX(3%) scaleX(1.04)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.5', transform: 'translateX(-20%)' },
          '50%': { opacity: '0.95', transform: 'translateX(20%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
