import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
      'https://muda-movement-v1-backend.vercel.app': {
        target: 'https://muda-movement-v1-backend.vercel.app',
        changeOrigin: true,
      }
    },
  },
})
