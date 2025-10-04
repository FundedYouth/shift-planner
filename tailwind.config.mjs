/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{mjs,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        "black-primary": "#1a1a1a",
        "gray-light": "#f7f7f7",
        "gray-primary": "#bbbbbb",
        "blue-primary": "#0064d0",
        "blue-accent": "#98b5d5",
        "blue-dark": "#0050a7",
      },
    }
  },
  plugins: []
}
