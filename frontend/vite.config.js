import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: true,
    proxy: {
      '/api': 'https://univents-764n.onrender.com'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})