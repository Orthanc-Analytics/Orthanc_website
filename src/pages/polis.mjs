import { btn, linkArrow, secHead, stats, rows, italyMap, ctaBand, subHero } from '../components.mjs';

// Abstract, number-free drawings of each module (decorative: aria-hidden).
function schematic(c, id) {
  switch (id) {
    case 'dashboard': {
      const cells = Array.from({ length: 147 }, (_, i) => `<i${[3, 17, 29, 44, 58, 61, 77, 90, 103, 118, 126, 139].includes(i) ? ' class="on"' : ''}></i>`).join('');
      return `<div class="schem schem--grid">${cells}</div>`;
    }
    case 'territorial':
      return `<div class="schem schem--map">${italyMap(c, { pins: true, alt: '' })}</div>`;
    case 'media':
      return `<div class="schem schem--feed">${[86, 64, 92, 58].map((w, i) => `<div class="feed"><span class="chip mono">${i % 2 ? 'SOURCE' : 'AI-GENERATED'}</span><i style="width:${w}%"></i><i style="width:${w - 22}%"></i></div>`).join('')}</div>`;
    case 'trends':
      return `<div class="schem schem--chart"><svg viewBox="0 0 300 160" preserveAspectRatio="none"><g class="grid"><path d="M0 40H300M0 80H300M0 120H300"/></g><path class="l1" d="M0 112 L30 104 L60 108 L90 92 L120 96 L150 80 L180 84 L210 70 L240 74 L270 62 L300 58"/><path class="l2" d="M0 70 L30 76 L60 72 L90 84 L120 82 L150 92 L180 88 L210 98 L240 94 L270 104 L300 102"/></svg></div>`;
    case 'scenarios':
      return `<div class="schem schem--seats"><div class="seats"><i style="flex:46"></i><i style="flex:31"></i><i style="flex:15"></i><i style="flex:8"></i><span class="seats__maj"></span></div><p class="mono seats__label">MAJORITY</p><div class="seats seats--alt"><i style="flex:52"></i><i style="flex:28"></i><i style="flex:13"></i><i style="flex:7"></i><span class="seats__maj"></span></div><p class="mono seats__label">STABILICUM · PREVIEW · NOT IN FORCE</p></div>`;
    case 'calendar':
      return `<div class="schem schem--time"><div class="time">${Array.from({ length: 9 }, (_, i) => `<i class="${i > 5 ? 'proj' : ''}"></i>`).join('')}</div><p class="mono time__labels"><span>PAST</span><span>PROJECTED</span></p></div>`;
    case 'audit':
      return `<div class="schem schem--audit">${['APPROVED', 'APPROVED', 'PENDING', 'APPROVED'].map(s => `<div class="audit"><span class="mono">sha256 · ••••••••••••</span><span class="chip mono${s === 'PENDING' ? ' chip--hollow' : ''}">${s}</span></div>`).join('')}</div>`;
    default:
      return '';
  }
}

export default function polis(c) {
  const t = c.t;
  const demo = c.href('contact', { hash: 'demo' });
  const modules = t('polis.modules.items');

  const consoleFig = `<figure class="console">
    <div class="console__bar mono"><span>ORTHANC POLIS</span><span>${t('polis.console.schematic')}</span></div>
    <div class="console__body">
      <div class="console__map">${italyMap(c, { pins: true, alt: t('polis.console.mapAlt') })}</div>
      <ul class="console__list mono">
        ${modules.map(m => `<li><span class="dot" aria-hidden="true"></span>${m.name}</li>`).join('')}
      </ul>
    </div>
    <ul class="console__layers mono">${t('polis.trust.layers').map(l => `<li>${l.tag}</li>`).join('')}</ul>
    <figcaption class="fig">${t('polis.console.caption')}</figcaption>
  </figure>`;

  const hero = subHero(c, {
    eyebrow: t('polis.hero.eyebrow'),
    title: t('polis.hero.title'),
    lead: t('polis.hero.lead'),
    actions: `${btn(demo, t('common.cta.demoPolis'))}${btn('#modules', t('polis.hero.secondary'), 'ghost')}`,
    visual: consoleFig,
  });

  const data = `<section class="sec sec--evidence" aria-labelledby="data-title">
    <div class="wrap">
      <h2 class="label mono" id="data-title">${t('polis.data.title')}</h2>
      ${stats(t('polis.data.items').map(s => ({ ...s, srcLabel: t('common.sourceLabel') })), 3)}
    </div>
  </section>`;

  const tabs = `<section class="sec" id="modules" aria-labelledby="modules-title">
    <div class="wrap">
      ${secHead({ idx: '01', label: t('polis.modules.label'), title: t('polis.modules.title'), lead: t('polis.modules.lead'), id: 'modules-title' })}
      <div class="tabs" data-tabs data-tabs-label="${c.attr(t('polis.modules.tablistLabel'))}">
        <div class="tabs__list">
          ${modules.map((m, i) => `<button type="button" class="tabs__tab" id="tab-${m.id}" data-panel="panel-${m.id}"><span class="tabs__n mono">${String(i + 1).padStart(2, '0')}</span><span class="tabs__name">${m.name}</span><span class="tabs__gloss">${m.gloss}</span></button>`).join('')}
        </div>
        ${modules.map(m => `<section class="tabs__panel" id="panel-${m.id}" aria-labelledby="panel-${m.id}-h">
          <div class="panel__text">
            <h3 class="h3" id="panel-${m.id}-h">${m.name} <span class="gloss">${m.gloss}</span></h3>
            ${m.body.map(p => `<p>${p}</p>`).join('')}
            ${m.points?.length ? `<ul class="ticks">${m.points.map(p => `<li>${p}</li>`).join('')}</ul>` : ''}
            <p class="panel__data"><span class="mono">${t('polis.modules.dataLabel')}</span> ${m.data}</p>
          </div>
          <div class="panel__schem" aria-hidden="true">${schematic(c, m.id)}<p class="fig">${t('polis.modules.schematicLabel')}</p></div>
        </section>`).join('')}
      </div>
    </div>
  </section>`;

  const pipeline = `<section class="sec" id="pipeline" aria-labelledby="pipeline-title">
    <div class="wrap">
      ${secHead({ idx: '02', label: t('polis.pipeline.label'), title: t('polis.pipeline.title'), lead: t('polis.pipeline.lead'), id: 'pipeline-title' })}
      <ol class="pipe">
        ${t('polis.pipeline.steps').map((s, i) => `<li class="pipe__step">
          <p class="pipe__n mono">${String(i + 1).padStart(2, '0')} · ${s.label}</p>
          <h3 class="pipe__title">${s.title}</h3>
          <ul class="pipe__items">${s.items.map(x => `<li>${x}</li>`).join('')}</ul>
        </li>`).join('')}
      </ol>
    </div>
  </section>`;

  const trust = `<section class="sec sec--inv" id="trust" aria-labelledby="trust-title">
    <div class="wrap">
      ${secHead({ idx: '03', label: t('polis.trust.label'), title: t('polis.trust.title'), lead: t('polis.trust.lead'), id: 'trust-title' })}
      <ul class="layers">
        ${t('polis.trust.layers').map(l => `<li class="layer"><span class="layer__tag mono">${l.tag}</span><p>${l.body}</p></li>`).join('')}
      </ul>
      <div class="trust">
        <figure class="empty-state">
          <p class="empty-state__label mono">${t('polis.trust.emptyLabel')}</p>
          <blockquote lang="it"><p>«Nessun dato in cache. In attesa di ripristino connessione ISTAT.»</p></blockquote>
          <figcaption>${t('polis.trust.emptyCaption')}</figcaption>
        </figure>
        <ul class="tenets tenets--2">
          ${t('polis.trust.points').map(x => `<li class="tenet"><h3 class="tenet__title">${x.title}</h3><p>${x.body}</p></li>`).join('')}
        </ul>
      </div>
    </div>
  </section>`;

  const security = `<section class="sec" id="security" aria-labelledby="security-title">
    <div class="wrap split">
      ${secHead({ idx: '04', label: t('polis.security.label'), title: t('polis.security.title'), lead: t('polis.security.lead'), id: 'security-title' })}
      <ul class="checks">
        ${t('polis.security.items').map(x => `<li class="check"><h3 class="check__title">${x.title}</h3><p>${x.body}</p></li>`).join('')}
      </ul>
    </div>
  </section>`;

  const roadmap = `<section class="sec" id="roadmap" aria-labelledby="roadmap-title">
    <div class="wrap split">
      ${secHead({ idx: '05', label: t('polis.roadmap.label'), title: t('polis.roadmap.title'), lead: t('polis.roadmap.lead'), id: 'roadmap-title' })}
      <ul class="soon">
        ${t('polis.roadmap.items').map(x => `<li class="soon__item"><span class="chip chip--hollow mono">${t('polis.roadmap.tag')}</span><span>${x}</span></li>`).join('')}
      </ul>
    </div>
  </section>`;

  const faqItems = t('polis.faq.items');
  const faq = `<section class="sec" id="faq" aria-labelledby="faq-title">
    <div class="wrap split">
      <div>
        ${secHead({ idx: '06', label: t('polis.faq.label'), title: t('polis.faq.title'), lead: t('polis.faq.lead'), id: 'faq-title' })}
        <p class="sec__more">${linkArrow(demo, t('polis.faq.link'))}</p>
      </div>
      ${rows(faqItems.map(f => ({ title: f.q, body: f.a })), { numbered: false })}
    </div>
  </section>`;

  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Orthanc Polis',
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: c.strip(t('polis.meta.category')),
      operatingSystem: 'Web',
      description: c.strip(t('polis.meta.description')),
      url: c.abs('polis'),
      inLanguage: 'it',
      publisher: { '@type': 'Organization', name: c.site.brandName, url: `${c.site.siteUrl}/` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map(f => ({ '@type': 'Question', name: c.strip(f.q), acceptedAnswer: { '@type': 'Answer', text: c.strip(f.a) } })),
    },
  ];

  return {
    title: t('polis.meta.title'),
    description: t('polis.meta.description'),
    body: [hero, data, tabs, pipeline, trust, security, roadmap, faq, ctaBand(c)].join('\n'),
    jsonld,
  };
}
