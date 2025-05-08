/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,njk,md,js}",
    "./content/**/*.{html,njk,md}",
    "./index.md"
  ],
  theme: {
    extend: {
      colors: {
        'eps-blue': '#1e40af',
        'eps-gray': '#374151',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      fontSize: {
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}