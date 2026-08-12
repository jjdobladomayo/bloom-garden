import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bloom: {
          green: { light: '#d4edda', DEFAULT: '#7cb87a', dark: '#4a8c48', deep: '#2d5a2c' },
          beige: { light: '#faf7f2', DEFAULT: '#f0e9df', dark: '#e0d5c5' },
          warm: { white: '#fdf9f5', cream: '#f5ede1' },
          earth: { light: '#c4956a', DEFAULT: '#8b5e3c', dark: '#5c3d1e' },
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'sway': 'sway 4s ease-in-out infinite',
        'pulse-gentle': 'pulse-gentle 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        'pulse-gentle': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(124,184,122,0.3)' },
          '50%': { transform: 'scale(1.015)', boxShadow: '0 0 0 10px rgba(124,184,122,0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
