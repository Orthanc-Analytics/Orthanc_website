#!/usr/bin/env node
// Builds the static site into dist/. No dependencies: Node 18+ only.
//
//   node build.mjs          build dist/
//   node build.mjs --strict also fail while a detail (address, email provider) is still a placeholder
//
// English pages are written at the site root, Italian pages under /it/.
// Copy lives in src/i18n/{en,it}.json, who runs the site in src/config/site.json,
// optional sections (team, traction, investor info, milestones) in src/content/.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { layout, lockup } from './src/layout.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'dist');
const LANGS = ['en', 'it'];
const DEFAULT_LANG = 'en';
const STRICT = process.argv.includes('--strict');

const readJSON = p => JSON.parse(fs.readFileSync(path.join(SRC, p), 'utf8'));
const site = readJSON('config/site.json');
site.siteUrl = site.siteUrl.replace(/\/+$/, '');
const basePath = new URL(site.siteUrl).pathname.replace(/\/+$/, '');
const dicts = Object.fromEntries(LANGS.map(l => [l, readJSON(`i18n/${l}.json`)]));
const content = {
  milestones: readJSON('content/milestones.json').items,
  team: readJSON('content/team.json').members,
  traction: readJSON('content/traction.json').items,
  investors: readJSON('content/investors.json'),
  maps: readJSON('content/maps.json'),
};

// Page registry: id, i18n key, file name per language, template.
const PAGES = [
  { id: 'home', key: 'home', slug: { en: 'index.html', it: 'index.html' }, tpl: 'home' },
  { id: 'polis', key: 'polis', slug: { en: 'polis.html', it: 'polis.html' }, tpl: 'polis' },
  { id: 'investors', key: 'investors', slug: { en: 'investors.html', it: 'investitori.html' }, tpl: 'investors' },
  { id: 'company', key: 'company', slug: { en: 'company.html', it: 'azienda.html' }, tpl: 'company' },
  { id: 'contact', key: 'contact', slug: { en: 'contact.html', it: 'contatti.html' }, tpl: 'contact' },
  { id: 'privacy', key: 'legal.privacy', slug: { en: 'privacy.html', it: 'privacy.html' }, tpl: 'legal' },
  { id: 'cookies', key: 'legal.cookies', slug: { en: 'cookies.html', it: 'cookie.html' }, tpl: 'legal' },
  { id: 'terms', key: 'legal.terms', slug: { en: 'terms.html', it: 'termini.html' }, tpl: 'legal' },
  { id: 'accessibility', key: 'legal.accessibility', slug: { en: 'accessibility.html', it: 'accessibilita.html' }, tpl: 'legal' },
  // Draft, not linked from any page until registration as an innovative startup: noindex, not in the sitemap.
  { id: 'startup', key: 'legal.startup', slug: { en: 'innovative-startup.html', it: 'startup-innovativa.html' }, tpl: 'legal', unlisted: true },
];
const byId = Object.fromEntries(PAGES.map(p => [p.id, p]));

// ---------------------------------------------------------------- checks

const errors = [];
const warnings = [];

function shape(v, p = '', out = new Set()) {
  if (Array.isArray(v)) { out.add(`${p}[${v.length}]`); v.forEach((x, i) => shape(x, `${p}[${i}]`, out)); }
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => shape(x, p ? `${p}.${k}` : k, out));
  else out.add(p);
  return out;
}
const shapes = Object.fromEntries(LANGS.map(l => [l, shape(dicts[l])]));
for (const a of LANGS) for (const b of LANGS) {
  if (a === b) continue;
  for (const k of shapes[a]) if (!shapes[b].has(k)) errors.push(`i18n: "${k}" exists in ${a}.json but not in ${b}.json`);
}

const founders = site.company.founders ?? [];
if (!founders.length) errors.push('company.founders is empty: the site must say who runs it');
founders.forEach((n, i) => { if (!n) warnings.push(`company.founders[${i}] is not set: shown as a placeholder on the site`); });
if (!site.company.address) warnings.push('company.address is not set: shown as a placeholder in the footer, contact page, privacy policy and terms');
if (!site.company.email) errors.push('company.email is not set');
if (!site.privacy?.emailProvider) warnings.push('privacy.emailProvider is not set: shown as a placeholder in the privacy policy');

// ---------------------------------------------------------------- assets

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.cpSync(path.join(SRC, 'assets'), path.join(OUT, 'assets'), { recursive: true });

const versions = {};
function version(rel) {
  if (!(rel in versions)) {
    const file = path.join(SRC, 'assets', rel);
    versions[rel] = fs.existsSync(file)
      ? crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 10)
      : null;
    if (!versions[rel]) errors.push(`asset not found: assets/${rel}`);
  }
  return versions[rel];
}

// ---------------------------------------------------------------- context

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = s => String(s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

function lookup(lang, key) {
  let v = dicts[lang];
  for (const part of key.split('.')) {
    if (v == null) break;
    v = v[part];
  }
  if (v === undefined) throw new Error(`Missing i18n key "${key}" in ${lang}.json`);
  return v;
}

function makeContext(page, lang) {
  const up = lang === DEFAULT_LANG ? '' : '../';
  const dirOf = l => (l === DEFAULT_LANG ? '' : `${l}/`);
  const c = {
    page, lang, langs: LANGS, defaultLang: DEFAULT_LANG, site, content, dicts, esc, strip,
    other: LANGS.find(l => l !== lang),
    attr: s => esc(strip(s)),
    t(key, vars) {
      let v = lookup(lang, key);
      if (vars && typeof v === 'string') v = v.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
      return v;
    },
    // Relative link from the current page to page `id` (optionally in another language).
    href(id, { lang: l = lang, hash } = {}) {
      const target = byId[id];
      if (!target) throw new Error(`Unknown page "${id}"`);
      const file = target.slug[l];
      let dir = '';
      if (l !== lang) dir = lang === DEFAULT_LANG ? `${l}/` : (l === DEFAULT_LANG ? '../' : `../${l}/`);
      const url = file === 'index.html' ? (dir || './') : dir + file;
      return url + (hash ? `#${hash}` : '');
    },
    abs(id, l = lang) {
      const file = byId[id].slug[l];
      return `${site.siteUrl}/${dirOf(l)}${file === 'index.html' ? '' : file}`;
    },
    asset(rel, withVersion = true) {
      const v = version(rel);
      return `${up}assets/${rel}${withVersion && v ? `?v=${v}` : ''}`;
    },
    // Escaped value, or a visible placeholder label (default "[TO COMPLETE]") when it is missing.
    ph(value, key = 'common.placeholder', vars = {}) {
      if (value) return esc(value);
      const label = String(lookup(lang, key)).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
      return `<span class="ph">${label}</span>`;
    },
  };
  return c;
}

// ---------------------------------------------------------------- pages

const templates = {};
for (const p of PAGES) {
  if (!templates[p.tpl]) templates[p.tpl] = (await import(pathToFileURL(path.join(SRC, 'pages', `${p.tpl}.mjs`)).href)).default;
}

const built = [];
for (const page of PAGES) {
  for (const lang of LANGS) {
    const c = makeContext(page, lang);
    try {
      const out = templates[page.tpl](c);
      const html = layout(c, out);
      const file = path.join(OUT, lang === DEFAULT_LANG ? '' : lang, page.slug[lang]);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, html);
      built.push({ page, lang, file });
    } catch (e) {
      errors.push(`${lang}/${page.slug[lang]}: ${e.message}`);
    }
  }
}

// 404: served by GitHub Pages for any missing URL, at any depth, so it uses root-relative links.
{
  const c = makeContext(byId.home, DEFAULT_LANG);
  const v = rel => `${basePath}/assets/${rel}?v=${version(rel)}`;
  const nf = l => lookup(l, 'notFound');
  const html = `<!doctype html>
<html lang="en" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(nf('en').title)} · ${esc(nf('it').title)} | ${esc(site.brandName)}</title>
  <meta name="robots" content="noindex">
  <meta name="theme-color" content="#000000">
  <link rel="icon" href="${v('brand/favicon.svg')}" type="image/svg+xml">
  <link rel="stylesheet" href="${v('css/styles.css')}">
</head>
<body class="page-404">
<main id="main" class="nf wrap">
  <a class="nf__brand" href="${basePath}/"><span aria-hidden="true">${lockup(c)}</span><span class="sr">${esc(lookup('en', 'common.homeLabel'))}</span></a>
  <p class="idx mono">[404]</p>
  ${LANGS.map((l, i) => `<section class="nf__lang" lang="${l}">
    <h${i ? 2 : 1} class="h2">${nf(l).title}</h${i ? 2 : 1}>
    <p class="lead">${nf(l).body}</p>
    <a class="link-arrow" href="${basePath}/${l === DEFAULT_LANG ? '' : `${l}/`}"><span class="u">${nf(l).home}</span><span class="arr" aria-hidden="true">→</span></a>
  </section>`).join('')}
</main>
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, '404.html'), html);
}

// ---------------------------------------------------------------- sitemap, robots

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${PAGES.filter(page => !page.unlisted).flatMap(page => LANGS.map(lang => {
  const c = makeContext(page, lang);
  return `  <url>
    <loc>${c.abs(page.id)}</loc>
${LANGS.map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${c.abs(page.id, l)}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${c.abs(page.id, DEFAULT_LANG)}"/>
    <lastmod>${page.tpl === 'legal' ? site.dates.legalUpdated : today}</lastmod>
  </url>`;
})).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.siteUrl}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

// ---------------------------------------------------------------- report

for (const w of warnings) console.warn(`warning: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}
if (STRICT && warnings.length) {
  console.error(`error: ${warnings.length} placeholder warning(s) in --strict mode`);
  process.exit(1);
}
console.log(`Built ${built.length} pages + 404 into ${path.relative(ROOT, OUT)}/ (${LANGS.join(', ')}).`);
