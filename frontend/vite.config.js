import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy /api/* requests to the Express backend during development so the
    // frontend dev server (port 5173) can reach the API (port 3000) without
    // needing to set VITE_API_URL manually.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Output to dist/ at the repository root so `npm run build` (local and CI)
    // produces a standard dist/ folder. The cPanel deployment task then rsyncs
    // dist/ into ~/public_html/ on the server.
    // emptyOutDir is required because the output directory is outside the
    // frontend workspace; it is safe here because dist/ contains only
    // generated build artifacts.
    outDir: '../dist',
    emptyOutDir: true,
  },
})
