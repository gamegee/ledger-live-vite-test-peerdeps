import autoprefixer from 'autoprefixer';
import * as esbuild from 'esbuild';
import { cp, mkdir, readFile, rm, writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// CSS Plugin to handle CSS imports with PostCSS
const cssPlugin = {
  name: 'css',
  setup(build) {
    const cssContents = new Map();

    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const css = await readFile(args.path, 'utf8');
      
      // Process with PostCSS
      const result = await postcss([
        tailwindcss,
        autoprefixer,
      ]).process(css, { from: args.path });

      cssContents.set(args.path, result.css);
      
      return {
        contents: result.css,
        loader: 'css',
      };
    });
  },
};

// HTML Plugin to generate index.html with correct script references
const htmlPlugin = (options = {}) => ({
  name: 'html',
  setup(build) {
    build.onEnd(async (result) => {
      if (result.errors.length > 0) return;

      const htmlTemplate = await readFile(
        resolve(__dirname, 'index.html'),
        'utf8'
      );

      // Get output files (strip 'dist/' prefix for paths)
      const jsFile = result.metafile?.outputs 
        ? Object.keys(result.metafile.outputs).find(f => f.endsWith('.js'))?.replace('dist/', '')
        : 'assets/index.js';
      
      const cssFile = result.metafile?.outputs
        ? Object.keys(result.metafile.outputs).find(f => f.endsWith('.css'))?.replace('dist/', '')
        : 'assets/index.css';

      // Replace module script with bundled script (use relative paths)
      let html = htmlTemplate
        .replace(
          '<script type="module" src="/src/main.tsx"></script>',
          `<link rel="stylesheet" href="/${cssFile}">
    <script src="/${jsFile}"></script>`
        );

      await writeFile(resolve(__dirname, 'dist/index.html'), html);
      
      // Copy public assets
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
});

export async function build(options = {}) {
  const { analyze = false } = options;

  try {
    // Clean dist folder
    await rm(resolve(__dirname, 'dist'), { recursive: true, force: true });
    await mkdir(resolve(__dirname, 'dist/assets'), { recursive: true });

    const buildOptions = {
      entryPoints: [resolve(__dirname, 'src/main.tsx')],
      bundle: true,
      minify: true,
      sourcemap: true,
      outfile: resolve(__dirname, 'dist/assets/index.js'),
      loader: {
        '.tsx': 'tsx',
        '.ts': 'ts',
        '.jsx': 'jsx',
        '.js': 'jsx',
      },
      jsx: 'automatic',
      define: {
        'process.env.NODE_ENV': '"production"',
      },
      logLevel: 'info',
      metafile: true,
      plugins: [cssPlugin, htmlPlugin()],
      splitting: false,
      format: 'iife',
      target: ['es2020', 'chrome100', 'safari14', 'firefox100'],
    };

    const result = await esbuild.build(buildOptions);

    if (analyze && result.metafile) {
      // Generate analysis
      const analysis = await esbuild.analyzeMetafile(result.metafile, {
        verbose: true,
      });
      console.log('\n📊 Bundle Analysis:\n');
      console.log(analysis);

      // Save metafile for external analyzers
      await writeFile(
        resolve(__dirname, 'dist/metafile.json'),
        JSON.stringify(result.metafile, null, 2)
      );
      
      console.log('\n✅ Metafile saved to dist/metafile.json');
      console.log('   You can analyze it at: https://esbuild.github.io/analyze/');
    }

    console.log('\n✅ Build completed successfully!');
    return result;
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Run build if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const analyze = process.argv.includes('--analyze');
  build({ analyze });
}

