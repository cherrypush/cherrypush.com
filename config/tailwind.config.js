const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './public/*.html',
    './app/helpers/**/*.rb',
    './app/javascript/**/*.js',
    './app/views/**/*.{erb,haml,html,slim}',
    './node_modules/flowbite/**/*.js', // https://flowbite.com/docs/getting-started/rails/
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}', // https://flowbite.com/docs/getting-started/react/
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    // Works thanks to flowbite being imported from package.json
    require('flowbite/plugin'),
  ],
}
