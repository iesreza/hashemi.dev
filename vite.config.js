import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  build: {
    // Optimize for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    },
    // Code splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue'],
          'markdown': ['marked']
        }
      }
    },
    // Asset optimization
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    cssCodeSplit: true,
    sourcemap: false // Disable sourcemaps in production for smaller bundle
  },

  // Server configuration
  server: {
    port: 5173,
    strictPort: false,
    open: false
  },

  // Preview configuration
  preview: {
    port: 4173
  },

  // Public base path
  base: '/',

  // Define global constants for better tree-shaking
  define: {
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_OPTIONS_API__: true
  }
})
