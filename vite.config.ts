import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // IMPORTANT: Replace 'creator-s-suite' with the exact name of your GitHub repository.
  base: '/creator-s-suite/',
  plugins: [react()],
})
