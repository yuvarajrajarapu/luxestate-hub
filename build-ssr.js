#!/usr/bin/env node

/**
 * Build script for SSR/Prerendering
 * This script builds both client and server bundles for Vercel Edge Functions
 */

import { build } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildSSR() {
  console.log('🚀 Building client bundle...');
  
  // Build client
  await build({
    configFile: resolve(__dirname, 'vite.config.ts'),
    mode: 'production',
  });

  console.log('✅ Client bundle built successfully');
  
  console.log('🚀 Building SSR bundle...');
  
  // Build server/SSR bundle
  await build({
    configFile: resolve(__dirname, 'vite.config.ts'),
    mode: 'production',
    build: {
      ssr: true,
      outDir: 'dist/ssr',
      rollupOptions: {
        input: resolve(__dirname, 'src/entry-server.tsx'),
      },
    },
  });

  console.log('✅ SSR bundle built successfully');
  
  // Create necessary directories for Vercel
  const apiDir = resolve(__dirname, 'api');
  try {
    await fs.access(apiDir);
  } catch {
    await fs.mkdir(apiDir, { recursive: true });
  }

  console.log('✅ Build complete! Ready for Vercel deployment');
  console.log('\n📝 Deploy with: vercel --prod');
}

buildSSR().catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
