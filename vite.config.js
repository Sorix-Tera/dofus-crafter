
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // REMPLACE par '/<nom-du-repo>/' avant de déployer sur GitHub Pages
  base: '/dofus-crafter/'
})
