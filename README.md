# Claudio Cuellar Portfolio Website

This is the source code for Claudio Cuellar's personal portfolio website.

## Technologies Used

- HTML5
- CSS3 (with Tailwind CSS)
- JavaScript (ES6+)
- Vite (for build and development)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/claudio252/claudio-cuellar.com.git
   cd claudio-cuellar.com
   ```

2. Install dependencies
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm run dev
```

This will start a development server at http://localhost:3000 with hot module replacement enabled.

### Building for Production

To build the site for production:

```bash
npm run build
```

This will generate optimized files in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

- `index.html` - Main HTML file
- `src/` - Source files
  - `main.js` - Main JavaScript entry point
  - `i18n/` - Internationalization files
    - `i18n.js` - Internationalization utility
    - `en.json` - English translations
    - `es.json` - Spanish translations
- `dist/` - Production build output (generated)
- `vite.config.js` - Vite configuration

## Deployment

The site is automatically deployed via GitHub Actions when changes are pushed to the main branch.