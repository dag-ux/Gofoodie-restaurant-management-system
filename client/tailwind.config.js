/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gofoodie: {
          orange: '#FF6600', // Primary Brand Color
          yellow: '#FFC107', // Secondary Brand Color
          dark: '#1F2937',   
          light: '#FAFAFA',  
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      }
    },
  },
  plugins: [],
}