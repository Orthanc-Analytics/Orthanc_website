import { contactList } from './components.mjs';

// Inline logo mark (same geometry as src/assets/brand/orthanc-mark.svg).
export function mark(className = '') {
  return `<svg class="${className}" viewBox="0 0 200 200" aria-hidden="true" focusable="false"><path fill="currentColor" fill-rule="evenodd" d="M54 77Q32.66 41.39 8 8Q41.39 32.66 77 54L123 54Q158.61 32.66 192 8Q167.34 41.39 146 77L146 123Q167.34 158.61 192 192Q158.61 167.34 123 146L77 146Q41.39 167.34 8 192Q32.66 158.61 54 123ZM81 68H119L132 81V119L119 132H81L68 119V81Z"/><circle cx="100" cy="100" r="14" fill="currentColor"/></svg>`;
}

export function lockup(c, { tag = 'span' } = {}) {
  return `<${tag} class="lockup">${mark('lockup__mark')}<span class="lockup__text"><span class="lockup__word">Orthanc</span><span class="lockup__sub">${c.t('common.brandSub')}</span></span></${tag}>`;
}

function langSwitch(c, where) {
  return `<ul class="lang" aria-label="${c.attr(c.t('common.langSwitch'))}">
    ${c.langs.map(l => {
      const cur = l === c.lang;
      return `<li><a href="${c.href(c.page.id, { lang: l })}" hreflang="${l}" lang="${l}"${cur ? ' aria-current="true"' : ''} data-lang-link="${where}"><span aria-hidden="true">${l.toUpperCase()}</span><span class="sr">${c.dicts[l].meta.langName}</span></a></li>`;
    }).join('')}
  </ul>`;
}

function header(c) {
  const items = ['polis', 'investors', 'company', 'contact'];
  return `<header class="hdr" data-hdr>
  <div class="hdr__in wrap">
    <a class="hdr__brand" href="${c.href('home')}"><span aria-hidden="true">${lockup(c)}</span><span class="sr">${c.t('common.homeLabel')}</span></a>
    <nav class="nav" id="site-nav" aria-label="${c.attr(c.t('common.nav.label'))}">
      <ul class="nav__list">
        ${items.map(id => `<li><a class="nav__link" href="${c.href(id)}"${c.page.id === id ? ' aria-current="page"' : ''}>${c.t(`common.nav.${id}`)}</a></li>`).join('')}
      </ul>
      ${langSwitch(c, 'nav')}
    </nav>
    <a class="btn btn--sm hdr__cta" href="${c.href('contact', { hash: 'demo' })}"><span class="hdr__cta-long">${c.t('common.cta.demo')}</span><span class="hdr__cta-short">${c.t('common.cta.demoShort')}</span></a>
    <button class="menu-btn" type="button" aria-controls="site-nav" aria-expanded="false" data-label-open="${c.attr(c.t('common.nav.menu'))}" data-label-close="${c.attr(c.t('common.nav.close'))}">
      <span class="menu-btn__bars" aria-hidden="true"></span><span class="menu-btn__label">${c.t('common.nav.menu')}</span>
    </button>
  </div>
</header>`;
}

function footer(c) {
  const f = k => c.t(`common.footer.${k}`);
  const col = (title, links) => `<div class="ftr__col">
      <h2 class="ftr__h mono">${title}</h2>
      <ul>${links.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul>
    </div>`;
  const co = c.site.company;
  const year = new Date().getUTCFullYear();
  const social = Object.entries(c.site.social).filter(([, v]) => v);
  return `<footer class="ftr">
  <div class="wrap">
    <div class="ftr__top">
      <div class="ftr__brand">
        <a href="${c.href('home')}"><span aria-hidden="true">${lockup(c)}</span><span class="sr">${c.t('common.homeLabel')}</span></a>
        <p class="ftr__claim">${f('claim')}</p>
        ${social.length ? `<ul class="ftr__social">${social.map(([k, v]) => `<li><a href="${c.esc(v)}" rel="noopener">${c.t(`common.social.${k}`)}</a></li>`).join('')}</ul>` : ''}
      </div>
      <div class="ftr__contact">
        <h2 class="ftr__h mono">${f('contactTitle')}</h2>
        ${contactList(c)}
      </div>
      <nav class="ftr__nav" aria-label="${c.attr(f('navLabel'))}">
        ${col(f('platform'), [
          [c.href('polis'), f('polisOverview')],
          [c.href('polis', { hash: 'modules' }), f('polisModules')],
          [c.href('polis', { hash: 'trust' }), f('trust')],
          [c.href('polis', { hash: 'faq' }), f('faq')],
        ])}
        ${col(f('companyTitle'), [
          [c.href('company'), f('about')],
          [c.href('company', { hash: 'milestones' }), f('milestones')],
          [c.href('investors'), f('investors')],
          [c.href('contact'), f('contact')],
        ])}
        ${col(f('legal'), [
          [c.href('privacy'), f('privacy')],
          [c.href('cookies'), f('cookies')],
          [c.href('terms'), f('terms')],
          [c.href('accessibility'), f('accessibility')],
        ])}
      </nav>
    </div>
    <div class="ftr__bottom">
      <p>© ${year} ${c.ph(co.legalName)}${co.vatNumber ? ` · ${c.t('common.contact.vat')} ${c.esc(co.vatNumber)}` : ''}</p>
      <p><a href="${c.href('cookies')}">${f('noCookies')}</a> · ${f('mapData')}</p>
      ${langSwitch(c, 'footer')}
    </div>
  </div>
</footer>`;
}

function jsonLd(objs) {
  if (!objs.length) return '';
  const data = objs.length === 1 ? objs[0] : { '@context': 'https://schema.org', '@graph': objs.map(o => { const { '@context': _, ...rest } = o; return rest; }) };
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

export function organizationLd(c) {
  const co = c.site.company;
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${c.site.siteUrl}/#organization`,
    name: c.site.brandName,
    url: `${c.site.siteUrl}/`,
    logo: `${c.site.siteUrl}/assets/brand/orthanc-logo-512.png`,
    email: co.email,
    contactPoint: [{
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: co.email,
      ...(co.phone ? { telephone: co.phone } : {}),
      availableLanguage: ['en', 'it'],
    }],
  };
  if (co.legalName) org.legalName = co.legalName;
  if (co.phone) org.telephone = co.phone;
  if (co.vatNumber) org.vatID = co.vatNumber;
  if (co.registeredOffice) org.address = co.registeredOffice;
  const sameAs = Object.values(c.site.social).filter(Boolean);
  if (sameAs.length) org.sameAs = sameAs;
  return org;
}

export function layout(c, { title, description, body, jsonld = [], breadcrumb = true, ogImageAlt }) {
  const alt = c.langs.map(l => `<link rel="alternate" hreflang="${l}" href="${c.abs(c.page.id, l)}">`).join('\n  ');
  const crumbs = breadcrumb && c.page.id !== 'home' ? [{
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: c.t('common.breadcrumbHome'), item: c.abs('home') },
      { '@type': 'ListItem', position: 2, name: c.strip(c.t(`${c.page.key}.navTitle`)), item: c.abs(c.page.id) },
    ],
  }] : [];
  const ld = [
    ...(c.page.id === 'home' ? [organizationLd(c), {
      '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${c.site.siteUrl}/#website`,
      name: c.site.brandName, url: `${c.site.siteUrl}/`, inLanguage: c.langs, publisher: { '@id': `${c.site.siteUrl}/#organization` },
    }] : []),
    ...crumbs,
    ...jsonld,
  ];
  const og = `${c.site.siteUrl}/assets/img/og-${c.lang}.png`;
  return `<!doctype html>
<html lang="${c.lang}" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${c.attr(title)}</title>
  <meta name="description" content="${c.attr(description)}">
  <link rel="canonical" href="${c.abs(c.page.id)}">
  ${alt}
  <link rel="alternate" hreflang="x-default" href="${c.abs(c.page.id, c.defaultLang)}">
  <meta name="theme-color" content="#000000">
  <meta name="color-scheme" content="dark">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${c.attr(c.site.brandName)}">
  <meta property="og:title" content="${c.attr(title)}">
  <meta property="og:description" content="${c.attr(description)}">
  <meta property="og:url" content="${c.abs(c.page.id)}">
  <meta property="og:image" content="${og}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${c.attr(ogImageAlt ?? c.t('common.ogAlt'))}">
  <meta property="og:locale" content="${c.t('meta.locale')}">
  ${c.langs.filter(l => l !== c.lang).map(l => `<meta property="og:locale:alternate" content="${c.dicts[l].meta.locale}">`).join('')}
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${c.asset('brand/favicon.svg')}" type="image/svg+xml">
  <link rel="apple-touch-icon" href="${c.asset('brand/apple-touch-icon.png')}">
  <link rel="preload" href="${c.asset('fonts/inter-tight-latin-wght-normal.woff2', false)}" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${c.asset('css/styles.css')}">
  <script>document.documentElement.classList.replace('no-js','js')</script>
  <script src="${c.asset('js/main.js')}" defer></script>
  ${jsonLd(ld)}
</head>
<body class="page-${c.page.id}">
<a class="skip" href="#main">${c.t('common.skip')}</a>
${header(c)}
<main id="main" tabindex="-1">
${body}
</main>
${footer(c)}
</body>
</html>
`;
}
