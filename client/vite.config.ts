import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],  
  server: {
    port: 3458,
    proxy: {
      // Proxy API calls to the Hono server
      '/cubejs-api': {
        target: 'http://localhost:3459',
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:3459',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: '../dist'
  }
})