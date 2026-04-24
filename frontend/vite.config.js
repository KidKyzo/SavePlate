import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  // ── Vitest configuration ──────────────────────────────────────────────────
  test: {
    // Use happy-dom for a browser-like DOM environment (faster than jsdom)
    environment: 'happy-dom',
    // Make Vitest globals (describe, it, expect, beforeEach, vi) available
    // without importing them in every test file
    globals: true,
    // Resolve the @/ alias inside test files
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
