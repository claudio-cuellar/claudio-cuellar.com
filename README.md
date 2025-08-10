# Claudio Cuellar - Personal Website

This is the repository for my personal website.

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

```bash
npm install
```

## Development

Edit the `index.html` file directly. The site uses Tailwind CSS via CDN for styling.

To start the development server with hot reload:

```bash
npm run dev
```

This will start a development server at http://localhost:3000 with hot reloading enabled. Any changes to HTML, CSS, or JavaScript files will automatically refresh the browser.

## Building

To build and minify the HTML file:

```bash
npm run build
```

This will create a minified version of the HTML file in the `dist` directory.

## Serving

To serve the built files locally:

```bash
npm run serve
```

This will start a local server at http://localhost:8080 serving the minified files.

## Technologies Used

- HTML5
- Tailwind CSS
- JavaScript
- Babel
- HTML Minifier
- Browser-Sync (for hot reloading)