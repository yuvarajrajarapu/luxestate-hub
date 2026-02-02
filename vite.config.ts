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
    // Gzip compression for production builds
    compression({
      verbose: true,
      disable: false,
      threshold: 1024,
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Production optimizations
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: mode === 'development',
    
    // Optimize for mobile - better code splitting
    rollupOptions: {
      output: {
        // Optimized manualChunks strategy
        manualChunks: (id) => {
          // React ecosystem
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          // Firebase
          if (id.includes('node_modules/firebase')) {
            return 'firebase';
          }
          // Radix UI components
          if (id.includes('node_modules/@radix-ui')) {
            return 'radix-ui';
          }
          // Animation libraries
          if (id.includes('node_modules/framer-motion')) {
            return 'animation';
          }
          // Charts and data visualization
          if (id.includes('node_modules/recharts')) {
            return 'charts';
          }
          // Forms
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/@hookform')) {
            return 'forms';
          }
        },
        // Ensure small chunks
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 600,
    
    // Inline small chunks
    assetsInlineLimit: 4096,
  },
  
  // CSS optimization
  css: {
    postcss: './postcss.config.js',
    modules: {
      localsConvention: 'camelCase',
    },
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'firebase/app',
      'firebase/firestore',
      'firebase/auth',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-navigation-menu',
      'framer-motion',
      'recharts',
      'react-hook-form',
    ],
  },
}));
