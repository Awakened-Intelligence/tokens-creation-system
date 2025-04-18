
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        typing: 'typing 3.5s steps(30, end) forwards'
      },
      keyframes: {
        typing: {
          from: { width: '0' },
          to: { width: '100%' }
        }
      }
    },
  },
  plugins: [],
}
