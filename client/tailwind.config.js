/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gofoodie: {
          orange: '#FF6600', // Primary Logo Color
          yellow: '#FFC107', // Secondary Logo Color
          dark: '#1F2937',   // For text
          light: '#FFFDF9',  // Warm background
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'], // Rounded font to match your logo
      }
    },
  },
  plugins: [],
}