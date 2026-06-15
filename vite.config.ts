import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages serves this app from https://<user>.github.io/tooling-dashboard/,
  // so production builds need the repo name as the base path.
  base: command === 'build' ? '/tooling-dashboard/' : '/',
}))
