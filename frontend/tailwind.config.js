/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#A3D2CA", 
        secondary: "#F6DFEB", 
        accent: "#E8F0F2", 
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"], 
      },
      boxShadow: {
        soft: "0 4px 10px rgba(0,0,0,0.08)", 
        hover: "0 6px 14px rgba(0,0,0,0.12)", 
      },
      borderRadius: {
        soft: "16px", 
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
  

};










