// Shared markup helpers. Every function takes the page context `c` (see build.mjs → makeContext).

export const arrow = '<span class="arr" aria-hidden="true">→</span>';

export function btn(href, text, variant = '') {
  return `<a class="btn${variant ? ` btn--${variant}` : ''}" href="${href}">${text}${arrow}</a>`;
}

export function linkArrow(href, text, attrs = '') {
  return `<a class="link-arrow" href="${href}"${attrs}><span class="u">${text}</span>${arrow}</a>`;
}

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

export function stats(items, cols = 4) {
  return `<dl class="stats stats--${cols}">
    ${items.map(s => `<div class="stat">
      <dt class="stat__label">${s.label}</dt>
      <dd class="stat__num">${s.num}</dd>
      <dd class="stat__src"><span class="mono">${s.srcLabel}</span> ${s.src}</dd>
    </div>`).join('')}
  </dl>`;
}

export function rows(items, { numbered = true, name, openFirst = false } = {}) {
  return `<div class="rows${numbered ? ' rows--num' : ''}">
    ${items.map((r, i) => `<details class="row"${name ? ` name="${name}"` : ''}${openFirst && i === 0 ? ' open' : ''}>
      <summary class="row__sum">
        ${numbered ? `<span class="row__n mono">${String(i + 1).padStart(2, '0')}</span>` : ''}
        <span class="row__title">${r.title}</span>
        <span class="row__icon" aria-hidden="true"></span>
      </summary>
      <div class="row__body">${r.body.startsWith('<') ? r.body : `<p>${r.body}</p>`}</div>
    </details>`).join('')}
  </div>`;
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

export function fmtMonth(c, ym) {
  const [y, m] = ym.split('-').map(Number);
  return new Intl.DateTimeFormat(c.lang === 'it' ? 'it-IT' : 'en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(y, m - 1, 1)));
}

export function fmtDate(c, ymd) {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Intl.DateTimeFormat(c.lang === 'it' ? 'it-IT' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(y, m - 1, d)));
}

export function milestones(c) {
  const items = c.content.milestones;
  if (!items.length) return '';
  return `<ol class="timeline">
    ${items.map(m => `<li class="tl">
      <p class="tl__date mono"><time datetime="${m.date}">${fmtMonth(c, m.date)}</time></p>
      <h3 class="tl__title">${c.esc(m.title[c.lang])}</h3>
      <p class="tl__ctx">${c.esc(m.context[c.lang])}</p>
    </li>`).join('')}
  </ol>`;
}

export function teamGrid(c) {
  const members = c.content.team;
  if (!members.length) return '';
  return `<ul class="team">
    ${members.map(p => `<li class="person">
      ${p.photo ? `<img class="person__photo" src="${c.asset(`img/team/${p.photo}`)}" alt="" width="400" height="400" loading="lazy" decoding="async">` : ''}
      <h3 class="person__name">${c.esc(p.name)}</h3>
      <p class="person__role mono">${c.esc(p.role?.[c.lang] ?? '')}</p>
      ${p.background?.[c.lang] ? `<p>${c.esc(p.background[c.lang])}</p>` : ''}
      ${p.whyUs?.[c.lang] ? `<p class="person__why">${c.esc(p.whyUs[c.lang])}</p>` : ''}
      ${p.linkedin ? linkArrow(c.esc(p.linkedin), c.t('common.linkedinOf', { name: c.esc(p.name) }), ' rel="noopener"') : ''}
    </li>`).join('')}
  </ul>`;
}

// Contact details block, used in the footer and on the Contact page.
export function contactList(c, { withPec = false } = {}) {
  const co = c.site.company;
  const tel = co.phone ? `<a href="tel:${co.phone.replace(/[^+\d]/g, '')}">${c.esc(co.phone)}</a>` : c.ph();
  const lines = [
    [c.t('common.contact.email'), `<a href="mailto:${co.email}">${c.esc(co.email)}</a>`],
    [c.t('common.contact.phone'), tel],
    [c.t('common.contact.office'), c.ph(co.registeredOffice)],
    [c.t('common.contact.vat'), c.ph(co.vatNumber)],
  ];
  if (co.companyRegister) lines.push([c.t('common.contact.register'), c.esc(co.companyRegister)]);
  if (co.shareCapital) lines.push([c.t('common.contact.capital'), c.esc(co.shareCapital)]);
  if (withPec && co.pec) lines.push([c.t('common.contact.pec'), `<a href="mailto:${co.pec}">${c.esc(co.pec)}</a>`]);
  return `<dl class="clist">
    ${lines.map(([k, v]) => `<div class="clist__row"><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
  </dl>`;
}

// Closing call-to-action band, shared by several pages.
export function ctaBand(c, { titleKey = 'common.ctaBand.title', bodyKey = 'common.ctaBand.body' } = {}) {
  return `<section class="band band--cta" aria-labelledby="cta-title">
    <div class="band__bg" aria-hidden="true"></div>
    <div class="wrap band__in">
      <p class="idx mono">${c.t('common.ctaBand.label')}</p>
      <h2 class="h2" id="cta-title">${c.t(titleKey)}</h2>
      <p class="lead">${c.t(bodyKey)}</p>
      <div class="actions">${btn(c.href('contact', { hash: 'demo' }), c.t('common.cta.demoPolis'))}</div>
    </div>
  </section>`;
}

// Visible breadcrumb for sub-pages.
export function crumbs(c) {
  return `<nav class="crumbs mono" aria-label="${c.attr(c.t('common.breadcrumbLabel'))}">
    <ol><li><a href="${c.href('home')}">${c.t('common.breadcrumbHome')}</a></li><li aria-current="page">${c.t(`${c.page.key}.navTitle`)}</li></ol>
  </nav>`;
}

export function subHero(c, { eyebrow, title, lead, actions = '', visual = '' }) {
  return `<section class="hero hero--sub${visual ? '' : ' hero--text'}" aria-labelledby="hero-title">
    <div class="wrap hero__grid">
      <div class="hero__copy">
        ${crumbs(c)}
        <p class="eyebrow mono">${eyebrow}</p>
        <h1 class="h1" id="hero-title">${title}</h1>
        ${lead ? `<p class="lead hero__lead">${lead}</p>` : ''}
        ${actions ? `<div class="actions">${actions}</div>` : ''}
      </div>
      ${visual ? `<div class="hero__visual">${visual}</div>` : ''}
    </div>
  </section>`;
}
