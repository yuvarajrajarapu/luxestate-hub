import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import compression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Aggressive compression for production builds
    compression({
      verbose: false,
      disable: false,
      threshold: 512,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Brotli compression for even better compression
    compression({
      verbose: false,
      disable: false,
      threshold: 512,
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Aggressive production optimizations
    target: 'esnext',
    minify: 'terser',
    sourcemap: false, // Disable sourcemaps for production - NUCLEAR
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3,
      },
      mangle: true,
      format: {
        comments: false,
      },
    },
    
    // Ultra-aggressive code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React - minimal
          'react': ['react', 'react-dom', 'react-router-dom'],
          // Firebase - separate chunk, lazy loaded
          'firebase-vendor': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          // Forms - heavy utility  
          'forms': ['react-hook-form', '@hookform/resolvers'],
          // Framer - animations
          'framer': ['framer-motion'],
          // Radix UI - critical
          'radix-critical': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-navigation-menu', '@radix-ui/react-select'],
          // Rest of Radix
          'radix-rest': ['@radix-ui/react-label', '@radix-ui/react-checkbox', '@radix-ui/react-slider', '@radix-ui/react-progress', '@radix-ui/react-sheet'],
          // Utils
          'utils': ['clsx', 'class-variance-authority', 'tailwind-merge'],
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        compact: true,
      },
    },
    
    // Aggressive chunk size limits
    chunkSizeWarningLimit: 200,
    assetsInlineLimit: 2048,
    
    // Remove unused code
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  
  // CSS optimization
  css: {
    postcss: './postcss.config.js',
    modules: {
      localsConvention: 'camelCase',
    },
  },
  
  // Optimize dependencies - only critical ones pre-bundled
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-hook-form',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      'clsx',
      'tailwind-merge',
    ],
    exclude: ['firebase', '@tanstack/react-query', 'recharts'],
  },
}));
