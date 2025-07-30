import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  // Ensure service worker is copied to build output
  publicDir: 'public',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          utils: ['clsx', 'tailwind-merge'],
          audio: ['howler'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    sourcemap: false,
    target: 'es2015',
    // Ensure assets are properly handled
    assetsInlineLimit: 4096,
  },
  server: {
    port: 3000,
    host: true,
    // Add proper MIME type handling for development
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'Content-Type': 'application/javascript; charset=utf-8',
    },
  },
  preview: {
    port: 4173,
    host: true,
    // Add proper MIME type handling for preview
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'Content-Type': 'application/javascript; charset=utf-8',
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  // Ensure proper asset handling
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.ico'],
  // Add proper MIME type configuration
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})