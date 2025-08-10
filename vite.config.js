import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

function i18nHMRPlugin() {
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
    name: 'vite-i18n-hmr',

    // Copy files after build
    closeBundle() {
      copyFiles();
    },

    // Watch files in dev and trigger HMR
    configureServer(server) {
      fs.watch(srcDir, (eventType, filename) => {
        if (filename && filename.endsWith('.json')) {
          const filePath = path.join(srcDir, filename);

          // Copy updated file to dist/assets
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
          }
          fs.copyFileSync(filePath, path.join(destDir, filename));

          // Let Vite know file changed → triggers HMR
          const modulePath = `/src/i18n/${filename}`;
          const mod = server.moduleGraph.getModuleById(modulePath);
          if (mod) {
            server.moduleGraph.invalidateModule(mod);
            server.ws.send({
              type: 'update',
              updates: [
                {
                  type: 'js-update',
                  path: modulePath,
                  acceptedPath: modulePath,
                  timestamp: Date.now()
                }
              ]
            });
          }

          console.log(`♻️ Hot reloaded i18n file: ${filename}`);
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
  plugins: [i18nHMRPlugin()],
});
