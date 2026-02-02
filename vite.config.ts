import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize for mobile - better code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-alert-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-navigation-menu'],
          'animation': ['framer-motion'],
          'firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage'],
        },
      },
    },
    // Smaller chunk size for mobile networks
    chunkSizeWarningLimit: 1000,
    // Enable minification (esbuild is default and already integrated)
    minify: 'esbuild',
  },
  // CSS optimization
  css: {
    postcss: './postcss.config.js',
  },
}));
