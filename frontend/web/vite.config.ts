// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Necesitamos el módulo 'path' de Node.js

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Aquí definimos el alias '@' para que apunte a la carpeta 'src'
      // path.resolve(__dirname, './src') crea la ruta absoluta correcta
      '@': path.resolve(__dirname, './src'),
    },
  },
})