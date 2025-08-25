/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        tiwala: {
          red: "hsl(var(--tiwala-red))",
          gold: "hsl(var(--tiwala-gold))",
          green: "hsl(var(--tiwala-green))",
        },
      },
    },
  },
  plugins: [],
};
