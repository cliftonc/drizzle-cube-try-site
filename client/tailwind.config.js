/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/drizzle-cube/dist/client/**/*.{js,mjs}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'dc-surface': 'var(--dc-surface)',
        'dc-surface-secondary': 'var(--dc-surface-secondary)',
        'dc-surface-hover': 'var(--dc-surface-hover)',
        'dc-primary': 'var(--dc-primary)',
        'dc-primary-hover': 'var(--dc-primary-hover)',
      },
      textColor: {
        'dc-text': 'var(--dc-text)',
        'dc-text-secondary': 'var(--dc-text-secondary)',
      },
      borderColor: {
        'dc-border': 'var(--dc-border)',
      },
    },
  },
  plugins: [],
}
