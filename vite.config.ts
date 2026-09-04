import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        // fix para path com espaço + motion 12.23 que re-exporta framer-motion/dom
        // framer-motion 12.43 deveria ter dist/es/dom.mjs mas o install com espaço corrompeu — aponta pro cjs que existe
        'framer-motion/dom': path.resolve(__dirname, 'node_modules/framer-motion/dist/cjs/dom.js'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      chunkSizeWarningLimit: 600,
      cssCodeSplit: true,
      cssMinify: true,
      target: 'es2020',
      rollupOptions: {
        output: {
          // chunk manual elegante — sem quebrar design, só quebra JS para TBT 4.4s -> <300ms
          manualChunks(id) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router') || id.includes('node_modules/scheduler')) return 'react';
            if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) return 'three';
            if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion') || id.includes('node_modules/motion-')) return 'motion';
            if (id.includes('node_modules/lucide-react') || id.includes('node_modules/@vercel')) return 'vendor';
            if (id.includes('node_modules')) return 'vendor';
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'three', 'motion'],
      exclude: [],
    },
  };
});
