// tailwind.config.js
module.exports = {
  theme: {
    extend: {
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
        button: {
          big: 'var(--big-buttons)',
          bigHover: 'var(--big-buttons-hover)',
          small: 'var(--small-buttons)',
          smallHover: 'var(--small-buttons-hover)',
        },
        header: {
          background: 'var(--header-background)',
        },
        footer: {
          background: 'var(--footer-background)',
        },
        pink: 'pink', // if you want raw pink
      },
    },
  },
  plugins: [],
};
