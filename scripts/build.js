import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const esbuildBin = '/home/idealz/.npm/_npx/fd45a72a545557e9/node_modules/@esbuild/linux-x64/bin/esbuild';
const distDir = path.join(projectRoot, 'public', 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

console.log('⚡ Bundling RAP React App with esbuild...');
const startTime = Date.now();

try {
  execFileSync(esbuildBin, [
    path.join(projectRoot, 'client', 'src', 'index.jsx'),
    '--bundle',
    '--outfile=' + path.join(distDir, 'app.bundle.js'),
    '--format=esm',
    '--loader:.js=jsx',
    '--loader:.jsx=jsx',
    '--define:process.env.NODE_ENV="production"',
    '--minify=false'
  ], { stdio: 'inherit' });

  const duration = Date.now() - startTime;
  console.log(`✅ Build completed in ${duration}ms! Output: public/dist/app.bundle.js`);
} catch (err) {
  console.error('❌ Build failed:', err);
  process.exit(1);
}
