// Shared markup helpers. Every function takes the page context `c` (see build.mjs → makeContext).

export const arrow = '<span class="arr" aria-hidden="true">→</span>';

export function btn(href, text, variant = '') {
  return `<a class="btn${variant ? ` btn--${variant}` : ''}" href="${href}">${text}${arrow}</a>`;
}

export function linkArrow(href, text, attrs = '') {
  return `<a class="link-arrow" href="${href}"${attrs}><span class="u">${text}</span>${arrow}</a>`;
}

// Link to a section of the home page: a plain fragment on the home page itself, so the browser scrolls
// without reloading; a relative link to the home page from the legal pages.
export function section(c, hash) {
  return c.page.id === 'home' ? `#${hash}` : c.href('home', { hash });
}

// The three products, in the order of the home page. Product names are the same in both languages.
export const PRODUCTS = [['polis', 'Orthanc Polis', 'Polis'], ['solo', 'Orthanc Solo', 'Solo'], ['logos', 'Orthanc Logos', 'Logos']];

export function mailto(email, subject, body = '') {
  const q = [`subject=${encodeURIComponent(subject)}`];
  if (body) q.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${email}?${q.join('&')}`;
}

export function secHead({ idx, label, title, lead, id, level = 2 }) {
  return `<header class="sec__head">
    ${idx ? `<p class="idx mono"><span class="idx__n">[${idx}]</span> ${label}</p>` : ''}
    <h${level} class="h2" id="${id}">${title}</h${level}>
    ${lead ? `<p class="lead">${lead}</p>` : ''}
  </header>`;
}

export function europeMap(c, { pins = true, caption = true, className = '' } = {}) {
  const m = c.content.maps.europe;
  const pinHtml = pins
    ? Object.entries(m.markers).map(([k, p]) =>
        `<span class="pin" data-city="${k}" style="--x:${p.x}%;--y:${p.y}%"></span>`).join('')
    : '';
  return `<figure class="map ${className}">
    <div class="map__box" style="aspect-ratio:${m.width}/${m.height}">
      <img src="${c.asset('img/europe-dots.svg')}" width="${m.width}" height="${m.height}" alt="${c.attr(c.t('maps.europeAlt'))}" decoding="async">
      ${pinHtml}
    </div>
    ${caption ? `<figcaption class="fig">${c.t('maps.europeCaption')}</figcaption>` : ''}
  </figure>`;
}

export function italyMap(c, { pins = true, caption = '', className = '', alt } = {}) {
  const m = c.content.maps.italy;
  const pinHtml = pins
    ? Object.entries(m.markers).map(([k, p]) =>
        `<span class="pin pin--static" data-city="${k}" style="--x:${p.x}%;--y:${p.y}%"></span>`).join('')
    : '';
  return `<figure class="map ${className}">
    <div class="map__box" style="aspect-ratio:${m.width}/${m.height}">
      <img src="${c.asset('img/italy-dots.svg')}" width="${m.width}" height="${m.height}" alt="${c.attr(alt ?? c.t('maps.italyAlt'))}" loading="lazy" decoding="async">
      ${pinHtml}
    </div>
    ${caption ? `<figcaption class="fig">${caption}</figcaption>` : ''}
  </figure>`;
}

export function fmtDate(c, ymd) {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Intl.DateTimeFormat(c.lang === 'it' ? 'it-IT' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(y, m - 1, d)));
}

// The founders' names: "A and B" / "A e B" in prose, "A, B" for the copyright line.
// A missing name shows as a placeholder ([NAME 1] / [NOME 1]).
export function founderNames(c, { list = false } = {}) {
  const names = c.site.company.founders.map((n, i) => c.ph(n, 'common.placeholders.founder', { n: i + 1 }));
  if (list) return names.join(', ');
  return new Intl.ListFormat(c.lang === 'it' ? 'it' : 'en-GB', { style: 'long', type: 'conjunction' }).format(names);
}

// Short privacy note, shown next to every mailto link (except inside the privacy policy itself).
export function privacyNote(c) {
  const link = `<a href="${c.href('privacy')}">${c.t('common.mailNoteLink')}</a>`;
  return `<p class="mailnote">${c.t('common.mailNote', { link })}</p>`;
}

// Who runs the site before incorporation (footer of every page): founders, address, email.
export function operatorBlock(c) {
  const co = c.site.company;
  const email = `<a href="mailto:${co.email}">${c.esc(co.email)}</a>`;
  return `<div class="who">
    <p class="who__line">${c.t('common.operator.who', { founders: founderNames(c) })}</p>
    <p class="who__addr">${c.t('common.operator.address', { address: c.ph(co.address, 'common.placeholders.address'), email })}</p>
    ${privacyNote(c)}
  </div>`;
}

// Visible breadcrumb for the legal pages.
export function crumbs(c) {
  return `<nav class="crumbs mono" aria-label="${c.attr(c.t('common.breadcrumbLabel'))}">
    <ol><li><a href="${c.href('home')}">${c.t('common.breadcrumbHome')}</a></li><li aria-current="page">${c.t(`${c.page.key}.navTitle`)}</li></ol>
  </nav>`;
}

