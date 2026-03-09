import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { docsPlugin } from './vite-plugin-docs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), docsPlugin()],
})
