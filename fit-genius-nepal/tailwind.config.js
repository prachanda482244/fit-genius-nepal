/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E63946", // bold red (energy, power)
          dark: "#B72C37",
        },
        secondary: {
          DEFAULT: "#1D3557", // deep navy (discipline, focus)
          light: "#457B9D",
        },
        accent: {
          DEFAULT: "#F1FAEE", // off-white for balance
        },
        neutral: {
          dark: "#111111", // dark backgrounds
          light: "#F8F9FA", // light backgrounds
          gray: "#6B7280",  // muted text
        },
      },
      fontFamily: {
        heading: ["Oswald"], // motivational headings
        body: ["Inter"],     // clean text
      },
    },
  },
  plugins: [],
}
