import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // VITE_BASE_URL：GitHub Pages子目录部署时设置（如 /PersonaLink/），默认 /
  base: process.env.VITE_BASE_URL || '/',
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true
      }
    }
  }
})