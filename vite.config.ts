import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import compression from 'vite-plugin-compression';

export default defineConfig(({ mode, command, ssrBuild }) => {
  const baseConfig = {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      compression({
        verbose: false,
        disable: false,
        threshold: 1024,
        algorithm: 'gzip',
        ext: '.gz',
      }),
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
      rollupOptions: {
        output: {
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

  if (!ssrBuild) {
    baseConfig.build.rollupOptions.output.manualChunks = {
      'react-vendor': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
      'firebase-vendor': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
      'forms-vendor': ['react-hook-form', '@hookform/resolvers'],
      'animation': ['framer-motion'],
      'radix-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-navigation-menu', '@radix-ui/react-select', '@radix-ui/react-label', '@radix-ui/react-checkbox', '@radix-ui/react-slider', '@radix-ui/react-progress', '@radix-ui/react-tabs'],
      'query': ['@tanstack/react-query'],
    };
  }

  return baseConfig;
});
