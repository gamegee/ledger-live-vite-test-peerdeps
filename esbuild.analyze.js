import { build } from './esbuild.config.js';
import * as esbuild from 'esbuild';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function analyze() {
  console.log('📊 Building and analyzing bundle...\n');
  
  // Run build with analyze flag
  const result = await build({ analyze: true });

  if (result.metafile) {
    const metafilePath = resolve(__dirname, 'dist/metafile.json');
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 Bundle Analysis Complete!');
    console.log('='.repeat(60));
    console.log('\n✅ Metafile saved to: dist/metafile.json');
    console.log('\n📈 To visualize your bundle:');
    console.log('   1. Visit: https://esbuild.github.io/analyze/');
    console.log('   2. Click "Import your metafile..."');
    console.log(`   3. Select: ${metafilePath}`);
    console.log('\n💡 The official esbuild analyzer provides:');
    console.log('   • Treemap visualization');
    console.log('   • Sunburst chart');
    console.log('   • Flame chart');
    console.log('   • Detailed module breakdown');
    console.log('\n' + '='.repeat(60) + '\n');
  }
}

analyze().catch((error) => {
  console.error('❌ Analysis failed:', error);
  process.exit(1);
});

