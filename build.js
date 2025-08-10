const fs = require('fs');
const path = require('path');
const minify = require('html-minifier').minify;

// Read the HTML file
const htmlFile = path.join(__dirname, 'index.html');
const html = fs.readFileSync(htmlFile, 'utf8');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Create dist/src/i18n directory structure if it doesn't exist
const i18nDistDir = path.join(distDir, 'src', 'i18n');
if (!fs.existsSync(path.join(distDir, 'src'))) {
  fs.mkdirSync(path.join(distDir, 'src'));
}
if (!fs.existsSync(i18nDistDir)) {
  fs.mkdirSync(i18nDistDir);
}

// Minify the HTML
const minified = minify(html, {
  collapseWhitespace: true,
  removeComments: true,
  minifyCSS: true,
  minifyJS: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true
});

// Write the minified HTML to the dist directory
fs.writeFileSync(path.join(distDir, 'index.html'), minified);

// Copy i18n files to dist directory
const i18nDir = path.join(__dirname, 'src', 'i18n');
if (fs.existsSync(i18nDir)) {
  const files = fs.readdirSync(i18nDir);
  files.forEach(file => {
    const srcFile = path.join(i18nDir, file);
    const destFile = path.join(i18nDistDir, file);
    fs.copyFileSync(srcFile, destFile);
    console.log(`Copied ${file} to dist/src/i18n/`);
  });
}

console.log('HTML file has been minified and saved to dist/index.html');