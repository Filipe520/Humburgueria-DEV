/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    fontFamily: {
      "sans": ["Poppins", "Roboto", 'sans-serif']
    },
    extend: {
      backgroundImage: {
        "home": "url(../src/image/bg.png)"
      }
    },
  },
  plugins: [],
}

