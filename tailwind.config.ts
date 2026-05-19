import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FFF7F2',
        foreground: '#2A1F27',
        muted: '#FFE6EF',
        'muted-foreground': '#755C68',
        accent: '#FF5F9D',
        'accent-secondary': '#FFD65C',
        'accent-foreground': '#FFFFFF',
        border: '#FFD1DF',
        card: '#FFFFFF',
        ring: '#FF5F9D',

        // Legacy Sorbet Skin aliases retained so the existing component markup
        // can inherit the Serif system without one-off utility churn.
        warmwhite: '#FFF7F2',
        buttercream: '#FFE6EF',
        vanilla: '#FFF7F2',
        peach: '#FFB38A',
        blush: '#FF5F9D',
        lavender: '#B8A7FF',
        honey: '#FFD65C',
        caramel: '#F3B64D',
        cocoa: '#2A1F27',
        mint: '#9BE7D7',
        charcoal: '#2A1F27',
      },
      fontFamily: {
        display: ['Fraunces', 'Recoleta', 'Georgia', 'serif'],
        body: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        gloss: '0 24px 80px rgba(255, 95, 157, 0.14)',
        soft: '0 12px 30px rgba(255, 95, 157, 0.08)',
        button: '0 1px 2px rgba(42, 31, 39, 0.06), 0 10px 24px rgba(255, 95, 157, 0.22)',
        editorial: '0 10px 24px rgba(255, 95, 157, 0.08)',
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
