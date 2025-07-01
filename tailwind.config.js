import { defineConfig } from 'tailwindcss'


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,js,jsx,ts,tsx}', 
    './components/**/*.{astro,js,jsx,ts,tsx}',
    './pages/**/*.{astro,js,jsx,ts,tsx}',
    './layouts/**/*.{astro,js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
          'brand-primary': 'var(--brand-primary)',
          'brand-secondary': 'var(--brand-secondary)',
          'brand-lighter': 'var(--brand-lighter)',
          'brand-orig': 'var(--brand-orig)',
            'brand-text-dark': 'var(--brand-text-dark)',
            'brand-text-light': 'var(--brand-text-light)',
            'brand-text-title': 'var(--brand-text-title)',
          'text-dark': 'var(--text-dark',
          'brand-background': 'var(--brand-background)',
          'big-buttons': 'var(--big-buttons)',
          'big-buttons-hover': 'var(--big-buttons-hover)',
          'small-buttons': 'var(--small-buttons)',
          'small-buttons-hover': 'var(--small-buttons-hover)',
        
        'header-background': 'var(--header-background)',
        'footer-background': 'var(--footer-background)',
      },
    },
  },
  plugins: [],
};
