import { build } from 'esbuild';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const distDir = path.join(projectRoot, 'public', 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

console.log('⚡ Bundling RAP React App with esbuild...');
const startTime = Date.now();

try {
  await build({
    entryPoints: [path.join(projectRoot, 'client', 'src', 'index.jsx')],
    bundle: true,
    outfile: path.join(distDir, 'app.bundle.js'),
    format: 'esm',
    loader: { '.js': 'jsx', '.jsx': 'jsx' },
    define: { 'process.env.NODE_ENV': '"production"' },
    minify: false,
    logLevel: 'info'
  });

  const duration = Date.now() - startTime;
  console.log(`✅ Build completed in ${duration}ms! Output: public/dist/app.bundle.js`);
} catch (err) {
  console.error('❌ Build failed:', err.message);
  process.exit(1);
}
