/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './client/index.html',
    './client/src/**/*.{js,ts,jsx,tsx}',
    // Include drizzle-cube module files to scan for Tailwind classes
    './node_modules/drizzle-cube/dist/client/**/*.{js,jsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}