import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this repository under /night-game/.
  base: '/night-game/',
  plugins: [react()],
})
