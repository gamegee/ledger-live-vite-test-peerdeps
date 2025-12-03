import * as esbuild from 'esbuild';
import { readFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

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

async function startDevServer() {
  const ctx = await esbuild.context({
    entryPoints: [resolve(__dirname, 'src/main.tsx')],
    bundle: true,
    outdir: resolve(__dirname, 'dist'),
    loader: {
      '.tsx': 'tsx',
      '.ts': 'ts',
      '.jsx': 'jsx',
      '.js': 'jsx',
    },
    define: {
      'process.env.NODE_ENV': '"development"',
    },
    logLevel: 'info',
    plugins: [cssPlugin],
    sourcemap: true,
    splitting: false,
    format: 'iife',
    target: ['es2020', 'chrome100', 'safari14', 'firefox100'],
  });

  // Enable watch mode
  await ctx.watch();

  // Start dev server
  const { host, port } = await ctx.serve({
    servedir: resolve(__dirname),
    port: 5173,
    fallback: resolve(__dirname, 'index.html'),
  });

  console.log(`\n🚀 Dev server running at http://${host}:${port}`);
  console.log(`\n👀 Watching for changes...\n`);
}

startDevServer().catch((error) => {
  console.error('❌ Dev server failed:', error);
  process.exit(1);
});

