import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        buttercream: '#FFF3DD',
        vanilla: '#FFFDF6',
        peach: '#FFB38A',
        blush: '#FF8FBC',
        lavender: '#B8A7FF',
        honey: '#E7A84E',
        caramel: '#C9894B',
        cocoa: '#6B412A',
        mint: '#BEE5C5',
        charcoal: '#302621',
      },
      fontFamily: {
        display: ['Baloo 2', 'ui-rounded', 'system-ui', 'sans-serif'],
        body: ['Nunito Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gloss: '0 24px 70px rgba(107, 65, 42, 0.18)',
        soft: '0 16px 45px rgba(107, 65, 42, 0.12)',
        button: '0 10px 22px rgba(201, 137, 75, 0.22)',
      },
      animation: {
        floaty: 'floaty 7s ease-in-out infinite',
        ribbon: 'ribbon 12s ease-in-out infinite',
        shimmer: 'shimmer 2.8s ease-in-out infinite',
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
      },
    },
  },
  plugins: [],
} satisfies Config;
