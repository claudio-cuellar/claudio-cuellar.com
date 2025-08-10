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

### Internationalization (i18n)

The website supports multiple languages through a custom i18n implementation. Translation files are located in the `src/i18n` directory:

- `en.json` - English translations
- `es.json` - Spanish translations

To add a new language:

1. Create a new JSON file in the `src/i18n` directory (e.g., `fr.json`)
2. Copy the structure from an existing translation file
3. Translate all the strings
4. Add the new language code to the `supportedLanguages` array in `src/i18n/i18n.js`

The language selector appears in the top-right corner of the website, allowing users to switch between available languages.

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
- Custom i18n implementation for multilingual support