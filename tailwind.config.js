import { defineConfig } from 'tailwindcss'

export default defineConfig({
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // Include drizzle-cube module files to scan for Tailwind classes
    '../node_modules/drizzle-cube/dist/client/**/*.js',
    '../node_modules/drizzle-cube/dist/client/**/*.jsx',
    '../node_modules/drizzle-cube/dist/client/components.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
})