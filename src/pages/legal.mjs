import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { crumbs, fmtDate, founderNames, privacyNote } from '../components.mjs';

const LEGAL_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'legal');

// Legal texts live in src/legal/<page>.<lang>.html. Tokens:
//   {{founders}}                 the founders' names, "A and B" / "A e B" (placeholder when missing)
//   {{address}}                  contact address (placeholder when missing)
//   {{emailProvider}}            email provider named in the privacy policy (placeholder when missing)
//   {{email}}                    mailto link
//   {{mailNote}}                 short privacy note, placed after an email address (not in the privacy policy)
//   {{link:<page>}}              relative link to another page, same language
//   {{siteUrl}} {{updated}}
export default function legal(c) {
  const name = c.page.key.split('.')[1];
  const co = c.site.company;
  let html = fs.readFileSync(path.join(LEGAL_DIR, `${name}.${c.lang}.html`), 'utf8');
  const tokens = {
    founders: founderNames(c),
    address: c.ph(co.address, 'common.placeholders.address'),
    emailProvider: c.ph(c.site.privacy?.emailProvider, 'common.placeholders.emailProvider'),
    email: `<a href="mailto:${co.email}">${c.esc(co.email)}</a>`,
    mailNote: privacyNote(c),
    siteUrl: c.esc(c.site.siteUrl),
    updated: fmtDate(c, c.site.dates.legalUpdated),
  };
  html = html
    .replace(/\{\{link:(\w+)\}\}/g, (_, id) => c.href(id))
    .replace(/\{\{(\w+)\}\}/g, (m, k) => {
      if (!(k in tokens)) throw new Error(`Unknown token ${m} in ${name}.${c.lang}.html`);
      return tokens[k];
    });

  // Table of contents from the h2 headings.
  const toc = [...html.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)].map(([, id, text]) => `<li><a href="#${id}">${text}</a></li>`);

  const body = `<section class="hero hero--sub hero--text hero--legal" aria-labelledby="hero-title">
    <div class="wrap">
      ${crumbs(c)}
      <p class="eyebrow mono">${c.t('legal.eyebrow')}</p>
      <h1 class="h1" id="hero-title">${c.t(`${c.page.key}.title`)}</h1>
      <p class="legal__meta mono">${c.t('legal.updated')} <time datetime="${c.site.dates.legalUpdated}">${tokens.updated}</time></p>
    </div>
  </section>
  <section class="sec sec--legal">
    <div class="wrap legal">
      ${toc.length > 2 ? `<nav class="legal__toc" aria-label="${c.attr(c.t('legal.tocLabel'))}"><p class="mono">${c.t('legal.tocLabel')}</p><ol>${toc.join('')}</ol></nav>` : ''}
      <div class="prose">${html}</div>
    </div>
  </section>`;

  return {
    title: `${c.strip(c.t(`${c.page.key}.title`))} | ${c.site.brandName}`,
    description: c.t(`${c.page.key}.description`),
    body,
  };
}
