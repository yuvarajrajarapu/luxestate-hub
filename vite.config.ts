import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import compression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Detect SSR build: when --ssr flag is passed to vite build command
  const isSsr = process.argv.includes('--ssr');
  
  return {
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
      sourcemap: false,
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
      
      // Ultra-aggressive code splitting - ONLY for client builds, NOT for SSR
      rollupOptions: isSsr ? {
        // SSR build: minimal config, no manual chunks (React is external in SSR)
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          compact: true,
        },
      } : {
        // Client build: full manual chunking for optimal code splitting
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
            'firebase-vendor': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
            'forms-vendor': ['react-hook-form', '@hookform/resolvers'],
            'animation': ['framer-motion'],
            'radix-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-navigation-menu', '@radix-ui/react-select', '@radix-ui/react-label', '@radix-ui/react-checkbox', '@radix-ui/react-slider', '@radix-ui/react-progress', '@radix-ui/react-tabs'],
            'query': ['@tanstack/react-query'],
          },
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          compact: true,
        },
      },
      
      chunkSizeWarningLimit: 200,
      assetsInlineLimit: 2048,
    },
    
    css: {
      postcss: './postcss.config.js',
    },
    
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
  };
});
