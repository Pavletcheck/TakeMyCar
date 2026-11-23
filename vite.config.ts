import { defineConfig } from 'vite';

// base задаётся для GitHub Pages: https://<user>.github.io/TakeMyCar/
// Локально и в превью — корень.
export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE ?? (mode === 'production' ? '/TakeMyCar/' : '/'),
  build: {
    target: 'es2022',
    sourcemap: false,
    assetsInlineLimit: 0,
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
}));
