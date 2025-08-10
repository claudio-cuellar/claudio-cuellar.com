const browserSync = require('browser-sync').create();
const fs = require('fs');
const path = require('path');

// Source directory
const sourceDir = __dirname;

// Start BrowserSync server
browserSync.init({
  server: {
    baseDir: sourceDir,
    index: 'index.html'
  },
  files: [
    path.join(sourceDir, '*.html'),
    path.join(sourceDir, '*.css'),
    path.join(sourceDir, '*.js'),
    path.join(sourceDir, 'src/i18n/**/*.js'),
    path.join(sourceDir, 'src/i18n/**/*.json')
  ],
  open: true,
  notify: false,
  port: 3000
});

console.log('Development server started at http://localhost:3000');
console.log('Hot reloading is active - changes to HTML, CSS, and JS files will automatically refresh the browser.');