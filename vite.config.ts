import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import compression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig(({ mode, command, ssrBuild }) => ({
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
      threshold: 1024,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Brotli compression for even better compression
    compression({
      verbose: false,
      disable: false,
      threshold: 1024,
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
        drop_console: mode === 'production',
        drop_debugger: true,
        passes: 2,
      },
      mangle: true,
      format: {
        comments: false,
      },
    },
    
    // Ultra-aggressive code splitting
    rollupOptions: {
      output: {
        ...(ssrBuild ? {} : {
          manualChunks: {
          // Core React
          'react-vendor': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          // Firebase - separate to lazy load
          'firebase-vendor': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          // Forms
          'forms-vendor': ['react-hook-form', '@hookform/resolvers'],
          // Animations
          'animation': ['framer-motion'],
          // Radix UI components
          'radix-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-navigation-menu', '@radix-ui/react-select', '@radix-ui/react-label', '@radix-ui/react-checkbox', '@radix-ui/react-slider', '@radix-ui/react-progress', '@radix-ui/react-tabs'],
          // Query
          'query': ['@tanstack/react-query'],
          },
        }),
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        compact: true,
      },
    },
    
    // Aggressive chunk size limits
    chunkSizeWarningLimit: 200,
    assetsInlineLimit: 2048,
  },
  
  // CSS optimization
  css: {
    postcss: './postcss.config.js',
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
