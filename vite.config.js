import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Base public path when served in production
  base: './',
  
  // Configure the build
  build: {
    // Output directory for production build
    outDir: 'dist',
    
    // Empty the outDir before building
    emptyOutDir: true,
    
    // Generate sourcemaps for better debugging
    sourcemap: true,
  },
  
  // Configure the dev server
  server: {
    port: 3000,
    open: true,
  },
  
  // Resolve file paths
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  
  // Configure plugins
  plugins: [],
});