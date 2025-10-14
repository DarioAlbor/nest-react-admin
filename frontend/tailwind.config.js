module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        'urbano': {
          'primary': '#c1292e',
          'background': '#ffffff',
          'active': '#c1292e',
          'header': '#e2e1e1',
          'white': '#ffffff',
          'white-hover': '#f2f2f2',
        },
      },
      fontFamily: {
        'sans': ['Roboto', 'Helvetica Neue', 'Helvetica', 'Nunito Sans', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
