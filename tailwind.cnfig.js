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
            fontFamily: {
        sans: ['Assistant', 'sans-serif'],
            },
      colors: {
        brand: {
          primary: 'var(--brand-primary)',
          secondary: 'var(--brand-secondary)',
          lighter: 'var(--brand-lighter)',
          orig: 'var(--brand-orig)',
          text: {
            dark: 'var(--brand-text-dark)',
            light: 'var(--brand-text-light)',
            title: 'var(--brand-text-title)',
          },
          background: 'var(--brand-background)',
        },
        buttons: {
          big: 'var(--big-buttons)',
          bigHover: 'var(--big-buttons-hover)',
          small: 'var(--small-buttons)',
          smallHover: 'var(--small-buttons-hover)',
        },
        header: 'var(--header-background)',
        footer: 'var(--footer-background)',
      },
    },
  },
  plugins: [],
};
