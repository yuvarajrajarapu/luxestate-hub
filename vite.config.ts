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
          // Core React
          'react': ['react', 'react-dom', 'react-router-dom'],
          // Firebase - lazy loaded
          'firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          // Radix UI - only essential
          'radix-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-navigation-menu'],
          // Heavy dependencies
          'framer': ['framer-motion'],
          'forms': ['react-hook-form', '@hookform/resolvers'],
          // Utilities
          'utils': ['clsx', 'class-variance-authority', 'tailwind-merge'],
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        compact: true,
      },
    },
    
    // Aggressive chunk size limits
    chunkSizeWarningLimit: 300,
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
      'firebase/app',
      'firebase/firestore',
      'firebase/auth',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      'framer-motion',
      'react-hook-form',
    ],
    exclude: ['recharts', '@radix-ui/react-accordion', '@radix-ui/react-tabs'],
  },
}));
