#!/usr/bin/env node
// Local preview of dist/ (run `npm run build` first). No dependencies.
//
//   node tools/serve.mjs [port]      → http://localhost:8080/
//
// The site is also served under the GitHub Pages sub-path from src/config/site.json
// (e.g. /Orthanc_website/), so the 404 page's root-relative links work as in production.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const port = Number(process.argv[2] || process.env.PORT || 8080);
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/config/site.json'), 'utf8'));
const basePath = new URL(site.siteUrl).pathname.replace(/\/+$/, '');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf', '.ico': 'image/x-icon',
};

function resolve(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0]);
  if (basePath && (p === basePath || p.startsWith(`${basePath}/`))) p = p.slice(basePath.length) || '/';
  const file = path.normalize(path.join(DIST, p));
  if (!file.startsWith(DIST)) return null;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!p.endsWith('/')) return { redirect: `${urlPath.split('?')[0]}/` };
    return { file: path.join(file, 'index.html') };
  }
  if (fs.existsSync(file)) return { file };
  if (fs.existsSync(`${file}.html`)) return { file: `${file}.html` };
  return null;
}

http.createServer((req, res) => {
  const r = resolve(req.url);
  if (r?.redirect) { res.writeHead(301, { Location: r.redirect }); return res.end(); }
  const file = r?.file && fs.existsSync(r.file) ? r.file : null;
  const status = file ? 200 : 404;
  const body = fs.readFileSync(file ?? path.join(DIST, '404.html'));
  res.writeHead(status, { 'Content-Type': TYPES[path.extname(file ?? '.html')] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
  res.end(body);
}).listen(port, () => console.log(`Serving dist/ on http://localhost:${port}/ (also under ${basePath || '/'}/)`));
