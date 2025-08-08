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

console.log('HTML file has been minified and saved to dist/index.html');