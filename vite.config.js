import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

function i18nHotReloadPlugin() {
  const srcDir = path.resolve(__dirname, 'src/i18n');
  const destDir = path.resolve(__dirname, 'dist/assets');

  function copyFiles() {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.readdirSync(srcDir).forEach(file => {
      if (file.endsWith('.json')) {
        fs.copyFileSync(
          path.join(srcDir, file),
          path.join(destDir, file)
        );
      }
    });
    console.log('✅ Copied i18n JSON files to dist/assets/');
  }

  return {
    name: 'i18n-hot-reload',

    // Copy files after build
    closeBundle() {
      copyFiles();
    },

    // Watch files in dev mode
    configureServer(server) {
      fs.watch(srcDir, (eventType, filename) => {
        if (filename && filename.endsWith('.json')) {
          const filePath = path.join(srcDir, filename);
          const fileUrl = `/assets/${filename}`;

          // Copy to dist/assets in case someone checks static files
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
          }
          fs.copyFileSync(filePath, path.join(destDir, filename));

          // Trigger HMR only for the changed file
          server.ws.send({
            type: 'update',
            updates: [
              {
                type: 'js-update',
                path: fileUrl,
                acceptedPath: fileUrl,
                timestamp: Date.now()
              }
            ]
          });

          console.log(`♻️ Updated i18n file: ${filename}`);
        }
      });
    }
  };
}

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [i18nHotReloadPlugin()],
});
