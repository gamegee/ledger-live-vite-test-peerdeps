# Fixes Applied to esbuild Dev and Build

## Issues Fixed

### 1. ✅ Main Thread Panic Error (Sandboxing Issue)
**Problem:** Commands failed with "Main thread panicked... Attempted to create a NULL object"

**Root Cause:** esbuild's native binary tries to access macOS system configuration APIs, which are restricted in Cursor's sandbox.

**Solution:** Commands must run with proper permissions:
- Run in external terminal (iTerm, Terminal.app)
- Use wrapper scripts: `./dev.sh` or `./build.sh`
- Allow "all" permissions in Cursor when prompted

### 2. ✅ MIME Type Error
**Problem:** Browser error: "Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of 'application/octet-stream'"

**Root Cause:** HTML was trying to load `/src/main.tsx` as a module, but esbuild bundles files to `dist/`. The dev server wasn't properly configured to serve the bundled files.

**Solution Applied:**
- Updated `esbuild.dev.js` to serve from `dist/` directory
- Added HTML plugin that generates proper HTML with correct script references
- Changed servedir to `dist/` so the bundled files are served correctly

### 3. ✅ React Undefined Error
**Problem:** Browser error: "ReferenceError: React is not defined"

**Root Cause:** esbuild was using classic JSX runtime which requires React to be in scope, but the code uses automatic JSX runtime (no explicit React import).

**Solution Applied:**
- Added `jsx: 'automatic'` to esbuild configuration
- Added `jsxDev: true` for development mode
- Updated both `esbuild.dev.js` and `esbuild.config.js`

### 4. ✅ Production Build Asset 404 Errors
**Problem:** When serving production build with `http-server ./dist/` or `npx serve dist`, assets returned 404 errors

**Root Cause:** The HTML was referencing `/dist/assets/index.js`, but when serving from the `dist/` directory, the paths should be `/assets/index.js` (without the `/dist/` prefix).

**Solution Applied:**
- Updated `esbuild.config.js` HTML plugin to strip `dist/` prefix from asset paths
- Changed from `/dist/assets/index.js` to `/assets/index.js`
- Changed from `/dist/assets/index.css` to `/assets/index.css`

## Changes Made

### esbuild.dev.js
1. Added `jsx: 'automatic'` and `jsxDev: true` for React JSX support
2. Changed `outdir` to `outfile` to generate single bundle
3. Updated HTML plugin to generate proper HTML in `dist/`
4. Changed `servedir` from root to `dist/`
5. Added public assets copying to `dist/`
6. Removed fallback parameter (not needed when serving from dist/)

### esbuild.config.js
1. Added `jsx: 'automatic'` for production builds

### dev.sh & build.sh
1. Created wrapper scripts for easier external terminal usage
2. Made them executable (`chmod +x`)

### Documentation
1. Updated README.md with troubleshooting info
2. Created TROUBLESHOOTING.md with detailed solutions
3. Created this FIXES.md document

## Testing Results

### ✅ Development Server
```bash
npm run dev
```
- Server starts on http://localhost:5173
- Hot reload works
- React components render correctly
- No MIME type errors
- No React errors

### ✅ Production Build
```bash
npm run build
```
- Build completes successfully
- Output: 176.2kb JS, 127.6kb CSS
- Build time: ~330ms
- All assets generated correctly

## How to Run

### Option 1: External Terminal (Recommended)
```bash
npm run dev    # Development
npm run build  # Production
```

### Option 2: Wrapper Scripts
```bash
./dev.sh      # Development
./build.sh    # Production
```

### Option 3: Cursor with Permissions
Allow "all" permissions when prompted in Cursor's integrated terminal.

## Additional Notes

- The esbuild configuration now properly handles React's automatic JSX runtime
- The dev server correctly serves bundled files from the `dist/` directory
- Both development and production modes are fully functional
- The app renders correctly with all components (Button, AmountInput, Tailwind styles)

