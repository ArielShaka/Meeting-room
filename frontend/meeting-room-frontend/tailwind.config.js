/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
    theme: {
      extend: {
        maxWidth: {
          ...defaultTheme.maxWidth,
          'screen-lg': '1024px', // re-add if missing
        },
      },
    },
    plugins: [],
  };
  