import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Keep worklets as separate static assets
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
