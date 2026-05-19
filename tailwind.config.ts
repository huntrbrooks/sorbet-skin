import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF8',
        foreground: '#1A1A1A',
        muted: '#F5F3F0',
        'muted-foreground': '#6B6B6B',
        accent: '#B8860B',
        'accent-secondary': '#D4A84B',
        'accent-foreground': '#FFFFFF',
        border: '#E8E4DF',
        card: '#FFFFFF',
        ring: '#B8860B',

        // Legacy Sorbet Skin aliases retained so the existing component markup
        // can inherit the Serif system without one-off utility churn.
        warmwhite: '#FAFAF8',
        buttercream: '#F5F3F0',
        vanilla: '#FAFAF8',
        peach: '#D4A84B',
        blush: '#B8860B',
        lavender: '#E8E4DF',
        honey: '#D4A84B',
        caramel: '#B8860B',
        cocoa: '#1A1A1A',
        mint: '#F5F3F0',
        charcoal: '#1A1A1A',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Source Sans 3', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        gloss: '0 8px 24px rgba(26, 26, 26, 0.08)',
        soft: '0 4px 12px rgba(26, 26, 26, 0.06)',
        button: '0 1px 2px rgba(26, 26, 26, 0.06), 0 8px 18px rgba(184, 134, 11, 0.14)',
        editorial: '0 1px 2px rgba(26, 26, 26, 0.04)',
      },
      animation: {
        floaty: 'floaty 7s ease-in-out infinite',
        ribbon: 'ribbon 12s ease-in-out infinite',
        shimmer: 'shimmer 2.8s ease-in-out infinite',
        fadeUp: 'fadeUp 650ms ease both',
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
      },
    },
  },
  plugins: [],
} satisfies Config;
