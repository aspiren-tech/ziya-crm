/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
    "./App.tsx"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#2a75d1',
        'primary-dark': '#1e5aab',
        'secondary': '#f0483e',
        'background': '#f5f6f8',
        'sidebar': '#222533',
        'sidebar-hover': '#33374d',
        'text-main': '#333333',
        'text-light': '#666666',
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      }
    },
  },
  plugins: [],
}