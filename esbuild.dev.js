import autoprefixer from 'autoprefixer';
import * as esbuild from 'esbuild';
import { cp, readFile, writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// CSS Plugin for development
const cssPlugin = {
  name: 'css',
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const css = await readFile(args.path, 'utf8');
      
      // Process with PostCSS
      const result = await postcss([
        tailwindcss,
        autoprefixer,
      ]).process(css, { from: args.path });

      return {
        contents: result.css,
        loader: 'css',
      };
    });
  },
};

// HTML Plugin for development - generates HTML with correct script references
const htmlDevPlugin = {
  name: 'html-dev',
  setup(build) {
    build.onEnd(async (result) => {
      if (result.errors.length > 0) return;

      const htmlTemplate = await readFile(
        resolve(__dirname, 'index.html'),
        'utf8'
      );

      // Replace module script with bundled script for dev (no /dist prefix since we serve from dist/)
      const html = htmlTemplate.replace(
        '<script type="module" src="/src/main.tsx"></script>',
        '<link rel="stylesheet" href="/main.css">\n    <script src="/main.js"></script>'
      );

      // Write HTML to dist directory
      await writeFile(resolve(__dirname, 'dist/index.html'), html);
      
      // Copy public assets to dist
      try {
        await cp(resolve(__dirname, 'public'), resolve(__dirname, 'dist'), {
          recursive: true,
          filter: (src) => !src.includes('node_modules'),
        });
      } catch (err) {
        // public folder might not exist or be empty
      }
    });
  },
};

async function startDevServer() {
  const ctx = await esbuild.context({
    entryPoints: [resolve(__dirname, 'src/main.tsx')],
    bundle: true,
    outfile: resolve(__dirname, 'dist/main.js'),
    loader: {
      '.tsx': 'tsx',
      '.ts': 'ts',
      '.jsx': 'jsx',
      '.js': 'jsx',
    },
    jsx: 'automatic',
    jsxDev: true,
    define: {
      'process.env.NODE_ENV': '"development"',
    },
    logLevel: 'info',
    plugins: [cssPlugin, htmlDevPlugin],
    sourcemap: true,
    format: 'iife',
    target: ['es2020', 'chrome100', 'safari14', 'firefox100'],
  });

  // Enable watch mode
  await ctx.watch();

  // Start dev server (serve from dist directory)
  const { host, port } = await ctx.serve({
    servedir: resolve(__dirname, 'dist'),
    port: 5173,
  });

  console.log(`\n🚀 Dev server running at http://${host}:${port}`);
  console.log(`📦 Bundle: main.js`);
  console.log(`\n👀 Watching for changes...\n`);
}

startDevServer().catch((error) => {
  console.error('❌ Dev server failed:', error);
  process.exit(1);
});

