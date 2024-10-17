/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'background-default': '#0F242A',
        'deep-blue': '#083344',
        'light-blue': '#035170',
        'mint-green': '#DBFFE8',
      },
    },
  },
  plugins: [],
}

