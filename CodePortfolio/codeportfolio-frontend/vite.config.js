import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Proxy para desarrollo local (npm run dev)
    // En producción/Docker el proxy lo hace Nginx (nginx.conf)
    proxy: {
      '/api': {
        target: 'http://localhost:5102',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
