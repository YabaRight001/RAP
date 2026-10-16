import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initDatabase } from './db.js';
import { handleApiRequest } from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

// Initialize SQLite database
initDatabase();

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // Handle API Requests
  if (parsedUrl.pathname.startsWith('/api/')) {
    let rawBody = '';
    req.on('data', chunk => {
      rawBody += chunk;
    });
    req.on('end', () => {
      let body = {};
      if (rawBody) {
        try {
          body = JSON.parse(rawBody);
        } catch {
          body = {};
        }
      }
      handleApiRequest(req, res, parsedUrl, body);
    });
    return;
  }

  // Handle Static File Serving
  let relativePath = parsedUrl.pathname === '/' ? 'index.html' : parsedUrl.pathname.slice(1);
  let filePath = path.join(publicDir, relativePath);

  // Security check: prevent directory traversal
  if (!filePath.startsWith(publicDir)) {
    res.statusCode = 403;
    res.end('Access Denied');
    return;
  }

  // SPA fallback: if file does not exist, serve index.html
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(publicDir, 'index.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-cache');
    res.statusCode = 200;
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`====================================================`);
  console.log(`🚀 RAP — RISE AND PROSPER PLATFORM RUNNING`);
  console.log(`🏦 "Bank That Helps You Prosper"`);
  console.log(`👉 Local:   http://localhost:${PORT}`);
  console.log(`👉 Network: http://${HOST}:${PORT}`);
  console.log(`====================================================`);
});
