import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'web.config', // Path to the web.config file in your project
          dest: '', // Destination folder, '' means root of the dist folder
        },
      ],
    }),
  ],
  build: {
    outDir: 'dist', // Ensure this matches your build output directory
  },
});
