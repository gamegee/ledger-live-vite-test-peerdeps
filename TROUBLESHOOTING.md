# Troubleshooting Guide

## esbuild Commands Failing in Cursor

### Problem

When running `npm run dev` or `npm run build` in Cursor's integrated terminal, you may encounter this error:

```
Error:   × Main thread panicked.
  ├─▶ at /Users/runner/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/
  │   system-configuration-0.6.1/src/dynamic_store.rs:154:1
  ╰─▶ Attempted to create a NULL object.
```

### Root Cause

This is a known issue on macOS where esbuild's native binary tries to access macOS system configuration APIs, which are restricted in Cursor's sandbox environment. The esbuild binary uses the `system-configuration` Rust crate to detect network interfaces when starting the dev server or bundling, which fails in sandboxed environments.

### Solutions

You have three options to work around this issue:

#### Option 1: Use an External Terminal (Recommended)

Run the commands in a terminal outside of Cursor (iTerm, Terminal.app, Warp, etc.):

```bash
cd /path/to/vite-project
npm run dev
```

or

```bash
cd /path/to/vite-project
npm run build
```

#### Option 2: Use the Provided Shell Scripts

Run the wrapper scripts directly:

```bash
./dev.sh      # Start dev server
./build.sh    # Build for production
```

These scripts work the same as the npm commands but can be run more easily in external terminals.

#### Option 3: Allow Full Permissions in Cursor

When running commands in Cursor's terminal, you may be prompted to allow "all" permissions. Accepting this will allow the commands to run without sandboxing restrictions.

### Verification

To verify everything is working:

1. **Test the build**:
   ```bash
   npm run build
   ```
   You should see output like:
   ```
   dist/assets/index.js       176.2kb
   dist/assets/index.css      127.6kb
   ✅ Build completed successfully!
   ```

2. **Test the dev server**:
   ```bash
   npm run dev
   ```
   You should see:
   ```
   🚀 Dev server running at http://127.0.0.1:5173
   👀 Watching for changes...
   ```

### Port Already in Use

If you see an error like:

```
Error: listen tcp4 0.0.0.0:5173: bind: address already in use
```

This means another dev server is already running. Kill it first:

```bash
lsof -ti:5173 | xargs kill -9
```

Then try starting the dev server again.

### Other Issues

If you continue to have issues:

1. **Clear the dist folder**:
   ```bash
   rm -rf dist
   ```

2. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check Node.js version**:
   ```bash
   node --version  # Should be v18 or higher
   ```

### Why Not Just Fix the Code?

This is not a code issue but an environmental restriction. The esbuild binary is a compiled Rust program that needs to access system APIs for network operations. These APIs are restricted in sandboxed environments for security reasons. The solutions above work around these restrictions without modifying your code.

