import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this repository under /Dice-Dare/.
  base: '/Dice-Dare/',
  plugins: [react()],
})
