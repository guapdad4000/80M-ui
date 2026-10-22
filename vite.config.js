import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // three (~506 kB) and the single-file PortalPage (~526 kB) are both lazy-loaded or
    // isolated chunks; the home route no longer ships either PortalPage or route pages.
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'react-vendor', test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/, priority: 20 },
            { name: 'motion-vendor', test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/, priority: 15 },
            { name: 'three-vendor', test: /node_modules[\\/]three[\\/]/, priority: 12 },
            { name: 'vendor', test: /node_modules[\\/]/, priority: 10 },
          ],
        },
      },
    },
  },
})
