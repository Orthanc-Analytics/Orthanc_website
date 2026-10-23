import { btn, linkArrow, mailto, privacyNote, secHead, europeMap, italyMap } from '../components.mjs';

const CITIES = [
  ['roma', 'Roma', '41.9028° N', '12.4964° E'], ['madrid', 'Madrid', '40.4168° N', '3.7038° W'],
  ['paris', 'Paris', '48.8566° N', '2.3522° E'], ['berlin', 'Berlin', '52.5200° N', '13.4050° E'],
  ['warszawa', 'Warszawa', '52.2297° N', '21.0122° E'], ['budapest', 'Budapest', '47.4979° N', '19.0402° E'],
  ['wien', 'Wien', '48.2082° N', '16.3738° E'], ['lisboa', 'Lisboa', '38.7223° N', '9.1393° W'],
  ['bruxelles', 'Bruxelles', '50.8503° N', '4.3517° E'], ['praha', 'Praha', '50.0755° N', '14.4378° E'],
  ['athina', 'Athína', '37.9838° N', '23.7275° E'], ['stockholm', 'Stockholm', '59.3293° N', '18.0686° E'],
];

// The one page: what Orthanc does (hero), who it is built for, the three products and their features, contact.
export default function home(c) {
  const t = c.t;
  const h = k => t(`home.${k}`);
  const email = c.site.company.email;
  const [first] = CITIES;

  const hero = `<section class="hero hero--home" aria-labelledby="hero-title">
    <div class="wrap hero__grid">
      <div class="hero__copy">
        <p class="eyebrow mono">${h('hero.eyebrow')}</p>
        <h1 class="h1" id="hero-title">${h('hero.title')}</h1>
        <p class="lead hero__lead">${h('hero.lead')}</p>
        <div class="actions">${btn('#contact', t('common.cta.demo'))}</div>
      </div>
      <div class="hero__visual">
        ${europeMap(c, { className: 'map--hero' })}
        <div class="ticker" data-ticker='${JSON.stringify(CITIES.map(([k, n, la, lo]) => [k, n.toUpperCase(), `${la} · ${lo}`]))}'>
          <p class="ticker__text mono" aria-hidden="true"><span class="ticker__dot"></span><span class="ticker__city" data-ticker-city>${first[1].toUpperCase()}</span><span class="ticker__coord" data-ticker-coord>${first[2]} · ${first[3]}</span></p>
          <button type="button" class="ticker__btn mono" data-ticker-toggle hidden data-label-pause="${c.attr(h('hero.tickerPause'))}" data-label-play="${c.attr(h('hero.tickerPlay'))}" data-aria-pause="${c.attr(h('hero.tickerPauseLabel'))}" data-aria-play="${c.attr(h('hero.tickerPlayLabel'))}" aria-label="${c.attr(h('hero.tickerPauseLabel'))}">${h('hero.tickerPause')}</button>
        </div>
      </div>
    </div>
  </section>`;

  const builtFor = `<section class="sec" id="built-for" aria-labelledby="built-title">
    <div class="wrap split">
      ${secHead({ idx: '01', label: h('builtFor.label'), title: h('builtFor.title'), id: 'built-title' })}
      <div>
        <ul class="audience">
          ${h('builtFor.audience').map(a => `<li class="audience__item"><h3 class="audience__title">${a.title}</h3><p>${a.body}</p></li>`).join('')}
        </ul>
        <p class="note">${h('builtFor.principle')}</p>
      </div>
    </div>
  </section>`;

  // Product visuals are shown at most 320 CSS px wide (280 px below 960 px).
  const img = (src, w, h2, alt, { srcset = '', pos = 'center' } = {}) => `<img src="${c.asset(`img/${src}`)}"${srcset ? ` srcset="${srcset}" sizes="(min-width: 960px) 320px, 280px"` : ''} width="${w}" height="${h2}" alt="${c.attr(alt)}" loading="lazy" decoding="async" style="object-position:${pos}">`;

  // One full-width row per product: name, status, purpose, link and visual on the left; features on the right.
  const product = (id, name, { media, map = false, live = false, cta, caption = '' }) => {
    const p = k => h(`${id}.${k}`);
    return `<article class="mod" id="${id}" aria-labelledby="${id}-title">
        <div class="mod__head">
          <p class="mod__tag mono">${live ? '<span class="dot dot--live" aria-hidden="true"></span>' : ''}${p('tag')}</p>
          <h3 class="mod__name" id="${id}-title">${name}</h3>
          <p class="mod__purpose">${p('purpose')}</p>
          <div class="mod__cta">${cta}</div>
          <div class="mod__visual">
            <div class="frame${map ? ' frame--map' : ''}">${media}</div>
            ${caption ? `<p class="fig">${caption}</p>` : ''}
          </div>
        </div>
        <div class="mod__body">
          <ul class="feats" aria-label="${c.attr(`${h('software.featuresLabel')}: ${name}`)}">
            ${p('features').map(f => `<li class="feat"><h4 class="feat__title">${f.title}</h4><p>${f.body}</p></li>`).join('')}
          </ul>
        </div>
      </article>`;
  };

  const software = `<section class="sec sec--software" id="software" aria-labelledby="software-title">
    <div class="wrap">
      ${secHead({ idx: '02', label: h('software.label'), title: h('software.title'), id: 'software-title' })}
      <div class="mods">
        ${product('polis', 'Orthanc Polis', {
          live: true,
          map: true,
          media: italyMap(c, { pins: false, alt: h('polis.alt') }),
          cta: linkArrow('#contact', h('polis.link')),
        })}
        ${product('solo', 'Orthanc Solo', {
          media: img('solo-wards-656.webp', 656, 492, h('solo.alt')),
          caption: h('solo.caption'),
          cta: linkArrow('#contact', h('solo.link')),
        })}
        ${product('logos', 'Orthanc Logos', {
          media: img('logos-teaser-640.webp', 1024, 1024, h('logos.alt'), { pos: 'center 38%', srcset: `${c.asset('img/logos-teaser-640.webp')} 640w, ${c.asset('img/logos-teaser-1024.webp')} 1024w` }),
          cta: `${linkArrow(mailto(email, h('logos.mailSubject')), h('logos.link'))}${privacyNote(c)}`,
        })}
      </div>
    </div>
  </section>`;

  const k = key => h(`contact.${key}`);
  const contact = `<section class="band band--cta" id="contact" aria-labelledby="contact-title">
    <div class="band__bg" aria-hidden="true"></div>
    <div class="wrap band__in">
      <p class="idx mono"><span class="idx__n">[03]</span> ${k('label')}</p>
      <h2 class="h2" id="contact-title">${k('title')}</h2>
      <p class="lead">${k('lead')}</p>
      <div class="actions">
        ${btn(mailto(email, k('demoSubject'), k('demoBody')), k('demo'))}
        ${btn(mailto(email, k('emailSubject')), k('email'), 'ghost')}
      </div>
      <p class="note">${k('fallback').replace('{email}', `<a href="mailto:${email}">${c.esc(email)}</a>`)}</p>
      ${privacyNote(c)}
    </div>
  </section>`;

  const jsonld = [{
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Orthanc Polis',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: c.strip(h('polis.purpose')),
    url: `${c.abs('home')}#polis`,
    inLanguage: 'it',
    publisher: { '@id': `${c.site.siteUrl}/#organization` },
  }];

  return {
    title: h('meta.title'),
    description: h('meta.description'),
    body: [hero, builtFor, software, contact].join('\n'),
    jsonld,
  };
}
