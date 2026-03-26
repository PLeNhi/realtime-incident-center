/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'severity-critical': '#ef4444',
        'severity-high': '#f97316',
        'severity-medium': '#eab308',
        'severity-low': '#22c55e',
      },
    },
  },
  plugins: [],
}
