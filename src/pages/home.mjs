import { btn, linkArrow, mailto, privacyNote, secHead, stats, rows, europeMap, italyMap, ctaBand } from '../components.mjs';

const CITIES = [
  ['roma', 'Roma', '41.9028° N', '12.4964° E'], ['madrid', 'Madrid', '40.4168° N', '3.7038° W'],
  ['paris', 'Paris', '48.8566° N', '2.3522° E'], ['berlin', 'Berlin', '52.5200° N', '13.4050° E'],
  ['warszawa', 'Warszawa', '52.2297° N', '21.0122° E'], ['budapest', 'Budapest', '47.4979° N', '19.0402° E'],
  ['wien', 'Wien', '48.2082° N', '16.3738° E'], ['lisboa', 'Lisboa', '38.7223° N', '9.1393° W'],
  ['bruxelles', 'Bruxelles', '50.8503° N', '4.3517° E'], ['praha', 'Praha', '50.0755° N', '14.4378° E'],
  ['athina', 'Athína', '37.9838° N', '23.7275° E'], ['stockholm', 'Stockholm', '59.3293° N', '18.0686° E'],
];

export default function home(c) {
  const t = c.t;
  const demo = c.href('contact', { hash: 'demo' });
  const [first] = CITIES;

  const hero = `<section class="hero hero--home" aria-labelledby="hero-title">
    <div class="wrap hero__grid">
      <div class="hero__copy">
        <p class="eyebrow mono">${t('home.hero.eyebrow')}</p>
        <h1 class="h1" id="hero-title">${t('home.hero.title')}</h1>
        <p class="lead hero__lead">${t('home.hero.lead')}</p>
        <div class="actions">
          ${btn(demo, t('common.cta.demoPolis'))}
          ${btn(c.href('polis'), t('home.hero.secondary'), 'ghost')}
        </div>
      </div>
      <div class="hero__visual">
        ${europeMap(c, { className: 'map--hero' })}
        <div class="ticker" data-ticker='${JSON.stringify(CITIES.map(([k, n, la, lo]) => [k, n.toUpperCase(), `${la} · ${lo}`]))}'>
          <p class="ticker__text mono" aria-hidden="true"><span class="ticker__dot"></span><span class="ticker__city" data-ticker-city>${first[1].toUpperCase()}</span><span class="ticker__coord" data-ticker-coord>${first[2]} · ${first[3]}</span></p>
          <button type="button" class="ticker__btn mono" data-ticker-toggle hidden data-label-pause="${c.attr(t('home.hero.tickerPause'))}" data-label-play="${c.attr(t('home.hero.tickerPlay'))}">${t('home.hero.tickerPause')}</button>
        </div>
      </div>
    </div>
  </section>`;

  const evidence = `<section class="sec sec--evidence" aria-labelledby="evidence-title">
    <div class="wrap">
      <h2 class="label mono" id="evidence-title">${t('home.evidence.title')}</h2>
      ${stats(t('home.evidence.items').map(s => ({ ...s, srcLabel: t('common.sourceLabel') })), 4)}
    </div>
  </section>`;

  const problem = `<section class="sec" id="problem" aria-labelledby="problem-title">
    <div class="wrap split">
      ${secHead({ idx: '01', label: t('home.problem.label'), title: t('home.problem.title'), lead: t('home.problem.lead'), id: 'problem-title' })}
      <div>
        <ol class="points">
          ${t('home.problem.points').map(p => `<li class="point"><h3 class="point__title">${p.title}</h3><p>${p.body}</p></li>`).join('')}
        </ol>
        <p class="answer">${t('home.problem.answer')}</p>
      </div>
    </div>
  </section>`;

  const capabilities = `<section class="sec" id="capabilities" aria-labelledby="cap-title">
    <div class="wrap split">
      <div>
        ${secHead({ idx: '02', label: t('home.capabilities.label'), title: t('home.capabilities.title'), lead: t('home.capabilities.lead'), id: 'cap-title' })}
        <p class="sec__more">${linkArrow(c.href('polis', { hash: 'modules' }), t('home.capabilities.link'))}</p>
      </div>
      ${rows(t('home.capabilities.items'), { openFirst: true })}
    </div>
  </section>`;

  const method = `<section class="sec sec--inv" id="method" aria-labelledby="method-title">
    <div class="wrap">
      ${secHead({ idx: '03', label: t('home.method.label'), title: t('home.method.title'), lead: t('home.method.lead'), id: 'method-title' })}
      <ul class="tenets">
        ${t('home.method.tenets').map((x, i) => `<li class="tenet"><p class="tenet__n mono">${String(i + 1).padStart(2, '0')}</p><h3 class="tenet__title">${x.title}</h3><p>${x.body}</p></li>`).join('')}
      </ul>
      <p class="sec__more">${linkArrow(c.href('polis', { hash: 'trust' }), t('home.method.link'))}</p>
    </div>
  </section>`;

  const audience = `<section class="sec" id="europe" aria-labelledby="europe-title">
    <div class="wrap split">
      ${secHead({ idx: '04', label: t('home.europe.label'), title: t('home.europe.title'), lead: t('home.europe.lead'), id: 'europe-title' })}
      <div>
        <h3 class="h4">${t('home.europe.audienceTitle')}</h3>
        <ul class="audience">
          ${t('home.europe.audience').map(a => `<li class="audience__item"><h4 class="audience__title">${a.title}</h4><p>${a.body}</p></li>`).join('')}
        </ul>
        <p class="note">${t('home.europe.note')} ${linkArrow(c.href('contact', { hash: 'demo' }), t('home.europe.noteLink'))}</p>
      </div>
    </div>
  </section>`;

  const img = (name, alt, pos = 'center') => `<img src="${c.asset(`img/${name}-640.webp`)}" srcset="${c.asset(`img/${name}-640.webp`)} 640w, ${c.asset(`img/${name}-1024.webp`)} 1024w" sizes="(min-width: 900px) 30vw, (min-width: 600px) 45vw, 100vw" width="1024" height="1024" alt="${c.attr(alt)}" loading="lazy" decoding="async" style="object-position:${pos}">`;
  const p = k => t(`home.platforms.${k}`);
  const platforms = `<section class="sec" id="platforms" aria-labelledby="platforms-title">
    <div class="wrap">
      ${secHead({ idx: '05', label: p('label'), title: p('title'), lead: p('lead'), id: 'platforms-title' })}
      <ul class="cards">
        <li class="card">
          <div class="card__media card__media--map">${italyMap(c, { pins: false, alt: p('polis.alt') })}</div>
          <p class="card__tag mono"><span class="dot dot--live" aria-hidden="true"></span>${p('polis.tag')}</p>
          <h3 class="card__title">Orthanc Polis</h3>
          <p>${p('polis.body')}</p>
          ${linkArrow(c.href('polis'), p('polis.link'))}
        </li>
        <li class="card">
          <div class="card__media">${img('solo-dashboard', p('solo.alt'))}</div>
          <p class="card__tag mono">${p('solo.tag')}</p>
          <h3 class="card__title">Orthanc Solo</h3>
          <p>${p('solo.body')}</p>
          ${linkArrow(demo, p('solo.link'))}
        </li>
        <li class="card">
          <div class="card__media">${img('logos-teaser', p('logos.alt'), 'center 38%')}</div>
          <p class="card__tag mono">${p('logos.tag')}</p>
          <h3 class="card__title">Orthanc Logos</h3>
          <p>${p('logos.body')}</p>
          ${privacyNote(c)}
          ${linkArrow(mailto(c.site.company.email, p('logos.mailSubject')), p('logos.link'))}
        </li>
      </ul>
    </div>
  </section>`;

  // How the products fit together: Polis and Solo feed Logos.
  const sys = k => t(`home.system.${k}`);
  const node = (name, tag, role, live = false) => `<li class="system__node">
          <p class="card__tag mono">${live ? '<span class="dot dot--live" aria-hidden="true"></span>' : ''}${tag}</p>
          <h3 class="system__name">${name}</h3>
          <p>${role}</p>
        </li>`;
  const system = `<section class="sec" id="system" aria-labelledby="system-title">
    <div class="wrap">
      ${secHead({ idx: '06', label: sys('label'), title: sys('title'), lead: sys('lead'), id: 'system-title' })}
      <div class="system">
        <ul class="system__in">
          ${node('Orthanc Polis', p('polis.tag'), sys('polis'), true)}
          ${node('Orthanc Solo', p('solo.tag'), sys('solo'))}
        </ul>
        <p class="system__flow mono" aria-hidden="true"><span>${sys('feeds')}</span><span class="system__arrow system__arrow--h">→</span><span class="system__arrow system__arrow--v">↓</span></p>
        <div class="system__out">
          <p class="card__tag mono">${p('logos.tag')}</p>
          <h3 class="system__name">Orthanc Logos</h3>
          <p>${sys('logos')}</p>
          <ul class="system__decide">${sys('decide').map(x => `<li class="chip chip--hollow mono">${x}</li>`).join('')}</ul>
        </div>
      </div>
    </div>
  </section>`;

  const investorBand = `<section class="band band--line" aria-labelledby="inv-title">
    <div class="wrap band__row">
      <div>
        <p class="idx mono">${t('home.investorBand.label')}</p>
        <h2 class="h3" id="inv-title">${t('home.investorBand.title')}</h2>
      </div>
      <p>${t('home.investorBand.body')}</p>
      ${linkArrow(c.href('investors'), t('home.investorBand.link'))}
    </div>
  </section>`;

  return {
    title: t('home.meta.title'),
    description: t('home.meta.description'),
    body: [hero, evidence, problem, capabilities, method, audience, platforms, system, investorBand, ctaBand(c)].join('\n'),
  };
}
