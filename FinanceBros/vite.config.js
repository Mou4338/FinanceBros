import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// npm run build         → normal optimised build for hosting (Vercel/Netlify): dist/
// npm run build:single  → everything inlined into one dist/index.html (preview/sharing)
export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === 'single' && viteSingleFile()].filter(Boolean),
  build: mode === 'single' ? { assetsInlineLimit: 100000000 } : {},
}))
