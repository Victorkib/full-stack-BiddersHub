import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure this matches your build output directory
  },
  // If your app is hosted at a subdirectory, e.g., example.com/myapp/
  // base: '/myapp/',
});
