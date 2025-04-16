/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: 'var(--primary-color)',
            dark: 'var(--primary-dark)',
          },
          secondary: 'var(--secondary-color)',
          success: 'var(--success-color)',
          danger: 'var(--danger-color)',
          warning: 'var(--warning-color)',
          info: 'var(--info-color)',
          light: 'var(--light-color)',
          dark: 'var(--dark-color)',
        },
        boxShadow: {
          card: 'var(--box-shadow)',
        },
      },
    },
    plugins: [],
  }