# Migration from Vite to esbuild

## ✅ What's Changed

### Removed
- `vite` and `@vitejs/plugin-react`
- `rollup-plugin-visualizer`
- `vite.config.ts`

### Added
- `esbuild` - Fast JavaScript bundler
- `esbuild.config.js` - Build configuration
- `esbuild.dev.js` - Development server
- `esbuild.analyze.js` - Bundle analysis script

## 📦 Installation

Run the following command to install the new dependencies:

```bash
npm install
```

## 🚀 Usage

### Development Server
```bash
npm run dev
```
Runs on `http://localhost:5173` (same port as Vite)

### Production Build
```bash
npm run build
```
Compiles TypeScript and bundles with esbuild into `dist/`

### Bundle Analysis
```bash
npm run build:analyze
```

This will:
1. Build your app with metafile generation
2. Save `dist/metafile.json`
3. Display instructions to visualize at [https://esbuild.github.io/analyze/](https://esbuild.github.io/analyze/)

### Preview Production Build
```bash
npm run preview
```
Serves the `dist/` folder for testing

## 📊 Bundle Analysis

After running `npm run build:analyze`:

1. Visit [https://esbuild.github.io/analyze/](https://esbuild.github.io/analyze/)
2. Click "Import your metafile..."
3. Select `dist/metafile.json`

The official esbuild analyzer provides:
- **Treemap** - Visual representation of bundle size
- **Sunburst Chart** - Hierarchical view of dependencies
- **Flame Chart** - Performance-oriented visualization
- **Detailed Breakdown** - Module-by-module analysis

## ⚡ Performance Benefits

esbuild is significantly faster than Vite's build process:
- **10-100x faster** builds
- Written in Go (native performance)
- Parallel processing by default
- No bundling needed in development

## 🔧 Configuration

### Build Config (`esbuild.config.js`)
- Handles CSS with PostCSS (Tailwind + Autoprefixer)
- Generates production-ready bundles
- Creates HTML with proper asset references
- Supports TypeScript and JSX/TSX

### Dev Server (`esbuild.dev.js`)
- Hot reload via watch mode
- Serves from project root
- Falls back to `index.html` for SPA routing
- Development sourcemaps

## 📝 Notes

- Dev server behavior is similar to Vite
- Build output structure remains in `dist/`
- TypeScript compilation still runs before build
- All existing imports and code work unchanged

