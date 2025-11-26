import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../dist', // Output to root dist directory for deployment
    emptyOutDir: true,
    // Ensure assets are copied correctly
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Don't hash service worker file name - it needs to be /sw.js
        manualChunks: undefined,
      }
    }
  },
  // Ensure public assets are accessible (includes sw.js and manifest.json)
  publicDir: 'public',
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173, // Default Vite port
    allowedHosts: true, // Allow all hosts including ngrok
  }
})
