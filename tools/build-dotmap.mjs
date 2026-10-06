// Generates the dot-matrix maps used on the site.
//
//   npm install            (installs the devDependencies: world-atlas, topojson-client, d3-geo)
//   npm run map            (= node tools/build-dotmap.mjs)
//
// Outputs (committed, so the site build never needs these dependencies):
//   src/assets/img/europe-dots.svg   Europe, Italy highlighted
//   src/assets/img/italy-dots.svg    Italy only
//   src/content/maps.json            marker positions (percent of the map box)
//
// Map data: Natural Earth via world-atlas (public domain).

import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { feature } from 'topojson-client';
import { geoAzimuthalEqualArea, geoBounds, geoContains, geoPath } from 'd3-geo';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const topo = require('world-atlas/countries-50m.json');
const countries = feature(topo, topo.objects.countries).features;

const LIVE = new Set(['Italy']);
const EUROPE = new Set([
  'France', 'Spain', 'Portugal', 'Germany', 'Austria', 'Switzerland', 'Belgium', 'Netherlands',
  'Luxembourg', 'Denmark', 'Norway', 'Sweden', 'Finland', 'Åland', 'Iceland', 'Ireland',
  'United Kingdom', 'Jersey', 'Guernsey', 'Isle of Man', 'Faeroe Is.', 'Poland', 'Czechia',
  'Slovakia', 'Hungary', 'Slovenia', 'Croatia', 'Bosnia and Herz.', 'Serbia', 'Montenegro',
  'Kosovo', 'Albania', 'Macedonia', 'Greece', 'Bulgaria', 'Romania', 'Moldova', 'Ukraine',
  'Lithuania', 'Latvia', 'Estonia', 'Malta', 'Cyprus', 'N. Cyprus', 'Liechtenstein', 'Andorra',
  'Monaco', 'San Marino', 'Vatican',
]);

const EU_CAPITALS = {
  roma: [12.4964, 41.9028], madrid: [-3.7038, 40.4168], lisboa: [-9.1393, 38.7223],
  paris: [2.3522, 48.8566], bruxelles: [4.3517, 50.8503], berlin: [13.405, 52.52],
  wien: [16.3738, 48.2082], praha: [14.4378, 50.0755], warszawa: [21.0122, 52.2297],
  budapest: [19.0402, 47.4979], athina: [23.7275, 37.9838], stockholm: [18.0686, 59.3293],
};
// Regional capitals: one per region (Polis keeps a hand-verified municipal archive for each).
const IT_CAPITALS = {
  aosta: [7.3201, 45.737], torino: [7.6869, 45.0703], genova: [8.9463, 44.4056],
  milano: [9.19, 45.4642], trento: [11.1211, 46.0679], venezia: [12.3155, 45.4408],
  trieste: [13.7768, 45.6495], bologna: [11.3426, 44.4949], firenze: [11.2558, 43.7696],
  perugia: [12.3908, 43.1107], ancona: [13.5189, 43.6158], roma: [12.4964, 41.9028],
  laquila: [13.3995, 42.3498], campobasso: [14.6627, 41.5603], napoli: [14.2681, 40.8518],
  bari: [16.8719, 41.1171], potenza: [15.8056, 40.6404], catanzaro: [16.5877, 38.9098],
  palermo: [13.3615, 38.1157], cagliari: [9.1217, 39.2238],
};

const withBounds = countries.map(f => ({ f, name: f.properties.name, b: geoBounds(f) }));
function countryAt(lonlat) {
  const [lon, lat] = lonlat;
  for (const c of withBounds) {
    const [[w, s], [e, n]] = c.b;
    if (lat < s || lat > n) continue;
    if (w <= e ? (lon < w || lon > e) : (lon < w && lon > e)) continue;
    if (geoContains(c.f, lonlat)) return c.name;
  }
  return null;
}

const r1 = n => Math.round(n * 10) / 10;

function dotPath(points, step) {
  // Rows of dots as "M x y h0 m step 0 h0 ...", drawn with round caps.
  const rows = new Map();
  for (const [x, y] of points) {
    if (!rows.has(y)) rows.set(y, []);
    rows.get(y).push(x);
  }
  let d = '';
  for (const [y, xs] of [...rows.entries()].sort((a, b) => a[0] - b[0])) {
    xs.sort((a, b) => a - b);
    d += `M${r1(xs[0])} ${r1(y)}h0`;
    for (let i = 1; i < xs.length; i++) d += `m${r1(xs[i] - xs[i - 1])} 0h0`;
  }
  return d;
}

function build({ projection, width, height, step, dot, tiers, markers, title }) {
  // Sample a regular grid inside the projected rectangle [0,width] x [0,height].
  const pts = { live: [], europe: [], other: [] };
  for (let y = step / 2; y < height; y += step) {
    for (let x = step / 2; x < width; x += step) {
      const ll = projection.invert([x, y]);
      if (!ll) continue;
      const name = countryAt(ll);
      if (!name) continue;
      const tier = LIVE.has(name) ? 'live' : EUROPE.has(name) ? 'europe' : 'other';
      if (tiers.includes(tier)) pts[tier].push([x, y]);
    }
  }
  const colors = { live: '#ffffff', europe: '#5a606b', other: '#2a2e35' };
  // Land outside Europe is context only: it fades out towards the edges of the frame.
  const defs = pts.other.length
    ? `<defs><radialGradient id="f" cx=".42" cy=".56" r=".6"><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient><mask id="m"><rect width="${width}" height="${height}" fill="url(#f)"/></mask></defs>`
    : '';
  const groups = tiers.filter(t => pts[t].length).map(t =>
    `<path d="${dotPath(pts[t], step)}" stroke="${colors[t]}" stroke-width="${dot}" stroke-linecap="round" fill="none"${t === 'other' ? ' mask="url(#m)"' : ''}/>`
  ).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}">${defs}${groups}</svg>\n`;
  const pos = {};
  for (const [k, ll] of Object.entries(markers)) {
    const [x, y] = projection(ll);
    pos[k] = { x: +(x / width * 100).toFixed(2), y: +(y / height * 100).toFixed(2) };
  }
  return { svg, width, height, markers: pos, counts: Object.fromEntries(Object.entries(pts).map(([k, v]) => [k, v.length])) };
}

// Europe: Lambert azimuthal equal-area centred on 10°E 52°N (the EU's own map projection, EPSG:3035).
const europeExtent = { type: 'MultiPoint', coordinates: [[-24.6, 63.3], [-24.6, 66.6], [-9.7, 36.9], [-10.3, 43.6], [34.7, 34.6], [41, 48], [31.6, 70.4], [25.8, 71.25], [14.4, 35.4], [26, 34.9]] };
const pe = geoAzimuthalEqualArea().rotate([-10, -52]).fitWidth(1000, europeExtent);
const [[, ey0], [, ey1]] = geoPath(pe).bounds(europeExtent);
const europe = build({
  projection: pe, width: 1000, height: Math.ceil(ey1 - ey0), step: 9, dot: 5.4, tiers: ['other', 'europe', 'live'],
  markers: EU_CAPITALS, title: 'Map of Europe with Italy highlighted',
});

// Italy alone, fitted with a margin.
const italy = countries.find(f => f.properties.name === 'Italy');
const pi = geoAzimuthalEqualArea().rotate([-12.5, -42]).fitExtent([[24, 24], [576, 676]], italy);
const italyMap = build({
  projection: pi, width: 600, height: 700, step: 8, dot: 4.6, tiers: ['live'], markers: IT_CAPITALS, title: 'Map of Italy',
});

writeFileSync(join(root, 'src/assets/img/europe-dots.svg'), europe.svg);
writeFileSync(join(root, 'src/assets/img/italy-dots.svg'), italyMap.svg);
writeFileSync(join(root, 'src/content/maps.json'), JSON.stringify({
  _note: 'Generated by tools/build-dotmap.mjs. Marker positions are percentages of the map box.',
  europe: { width: europe.width, height: europe.height, markers: europe.markers },
  italy: { width: italyMap.width, height: italyMap.height, markers: italyMap.markers },
}, null, 2) + '\n');
console.log('europe', europe.width + 'x' + europe.height, europe.counts, Math.round(europe.svg.length / 1024) + 'KB');
console.log('italy', italyMap.width + 'x' + italyMap.height, italyMap.counts, Math.round(italyMap.svg.length / 1024) + 'KB');
