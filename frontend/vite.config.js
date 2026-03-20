import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Output directly to public_html at the repository root so TrueHost
    // (cPanel) serves the built SPA from the correct document root.
    // emptyOutDir is required because the output directory is outside the
    // frontend workspace; it is safe here because public_html contains only
    // generated build artefacts.
    outDir: '../public_html',
    emptyOutDir: true,
  },
})
