// Renders the raster brand images from the SVG mark, the fonts and the dot map:
//   src/assets/brand/apple-touch-icon.png   180×180
//   src/assets/brand/orthanc-logo-512.png   512×512 (used in structured data)
//   src/assets/img/og-en.png, og-it.png      1200×630 social preview images
//
//   npm install && CHROMIUM_PATH=/path/to/chromium npm run images
//
// Needs playwright-core (devDependency) and a Chromium/Chrome binary. Run it again
// whenever the logo, the headline or the map changes.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const A = p => pathToFileURL(path.join(ROOT, 'src/assets', p)).href;
const mark = fs.readFileSync(path.join(ROOT, 'src/assets/brand/orthanc-mark.svg'), 'utf8');
const dict = l => JSON.parse(fs.readFileSync(path.join(ROOT, `src/i18n/${l}.json`), 'utf8'));

const fonts = `
@font-face{font-family:'Inter Tight';src:url(${A('fonts/inter-tight-latin-wght-normal.woff2')}) format('woff2');font-weight:100 900}
@font-face{font-family:'IBM Plex Mono';src:url(${A('fonts/ibm-plex-mono-latin-400-normal.woff2')}) format('woff2');font-weight:400}
html,body{margin:0;background:#000}`;

const icon = size => `<!doctype html><meta charset="utf-8"><style>${fonts}
body{width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;color:#fff}
svg{width:${Math.round(size * 0.74)}px;height:${Math.round(size * 0.74)}px}</style>${mark}`;

const og = l => {
  const t = dict(l);
  return `<!doctype html><meta charset="utf-8"><style>${fonts}
  body{width:1200px;height:630px;position:relative;overflow:hidden;color:#fff;font-family:'Inter Tight'}
  .grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:60px 60px}
  .map{position:absolute;right:-40px;top:40px;width:560px;opacity:.95}
  .copy{position:absolute;left:72px;top:72px;width:620px}
  .lockup{display:flex;align-items:center;gap:20px}
  .lockup svg{width:64px;height:64px}
  .word{font-weight:700;font-size:30px;letter-spacing:.38em}
  .sub{font-family:'IBM Plex Mono';font-size:13px;letter-spacing:.42em;color:#8b93a1;margin-top:8px}
  h1{font-weight:400;font-size:58px;line-height:1.04;letter-spacing:-.035em;margin:84px 0 0}
  .eyebrow{position:absolute;left:72px;bottom:64px;font-family:'IBM Plex Mono';font-size:15px;letter-spacing:.14em;text-transform:uppercase;color:#8b93a1}
  </style>
  <div class="grid"></div>
  <img class="map" src="${A('img/europe-dots.svg')}">
  <div class="copy">
    <div class="lockup">${mark}<div><div class="word">ORTHANC</div><div class="sub">ANALYTICS</div></div></div>
    <h1>${t.home.hero.title}</h1>
  </div>
  <div class="eyebrow">${t.home.hero.eyebrow}</div>`;
};

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
async function shot(html, w, h, out) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const tmp = path.join(ROOT, 'tools', `.render-${Date.now()}.html`);
  fs.writeFileSync(tmp, html);
  try {
    await page.goto(pathToFileURL(tmp).href);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(ROOT, out) });
    console.log('wrote', out);
  } finally {
    fs.rmSync(tmp, { force: true });
    await page.close();
  }
}
await shot(icon(180), 180, 180, 'src/assets/brand/apple-touch-icon.png');
await shot(icon(512), 512, 512, 'src/assets/brand/orthanc-logo-512.png');
for (const l of ['en', 'it']) await shot(og(l), 1200, 630, `src/assets/img/og-${l}.png`);
await browser.close();
