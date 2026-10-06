import { btn, linkArrow, mailto, secHead, milestones, teamGrid, fmtMonth, subHero } from '../components.mjs';

export default function investors(c) {
  const t = c.t;
  const inv = c.content.investors;
  const L = v => (v && typeof v === 'object' ? v[c.lang] : v);
  const roomEmail = inv.dataRoomEmail || c.site.company.email;
  const roomHref = mailto(roomEmail, t('investors.dataRoom.mailSubject'), t('investors.dataRoom.mailBody'));
  const deck = inv.deckUrl
    ? (/^https?:/.test(inv.deckUrl) ? inv.deckUrl : `${c.lang === c.defaultLang ? '' : '../'}${inv.deckUrl}`)
    : null;

  const hero = subHero(c, {
    eyebrow: t('investors.hero.eyebrow'),
    title: t('investors.hero.title'),
    lead: t('investors.hero.lead'),
    actions: `${btn(roomHref, t('investors.dataRoom.cta'))}${btn(c.href('polis'), t('investors.hero.secondary'), 'ghost')}`,
  });

  const problem = `<section class="sec" id="problem" aria-labelledby="problem-title">
    <div class="wrap split">
      ${secHead({ idx: '01', label: t('investors.problem.label'), title: t('investors.problem.title'), lead: t('investors.problem.lead'), id: 'problem-title' })}
      <ol class="points">
        ${t('investors.problem.points').map(p => `<li class="point"><h3 class="point__title">${p.title}</h3><p>${p.body}</p></li>`).join('')}
      </ol>
    </div>
  </section>`;

  const solution = `<section class="sec" id="solution" aria-labelledby="solution-title">
    <div class="wrap">
      ${secHead({ idx: '02', label: t('investors.solution.label'), title: t('investors.solution.title'), lead: t('investors.solution.lead'), id: 'solution-title' })}
      <ul class="tenets tenets--3">
        ${t('investors.solution.pillars').map((x, i) => `<li class="tenet"><p class="tenet__n mono">${String(i + 1).padStart(2, '0')}</p><h3 class="tenet__title">${x.title}</h3><p>${x.body}</p></li>`).join('')}
      </ul>
      <p class="sec__more">${linkArrow(c.href('polis'), t('investors.solution.link'))}</p>
    </div>
  </section>`;

  const whyNow = `<section class="sec sec--inv" id="why-now" aria-labelledby="why-title">
    <div class="wrap">
      ${secHead({ idx: '03', label: t('investors.whyNow.label'), title: t('investors.whyNow.title'), lead: t('investors.whyNow.lead'), id: 'why-title' })}
      <ol class="facts">
        ${t('investors.whyNow.items').map(x => `<li class="fact">
          <p class="fact__when mono">${x.when}</p>
          <h3 class="fact__title">${x.title}</h3>
          <p>${x.body}</p>
          <p class="fact__src"><span class="mono">${t('common.sourceLabel')}</span> <a href="${x.sourceUrl}" rel="noopener">${x.source}</a></p>
        </li>`).join('')}
      </ol>
      <p class="note">${t('investors.whyNow.checked', { date: c.esc(new Intl.DateTimeFormat(c.lang === 'it' ? 'it-IT' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${c.site.dates.factsCheckedOn}T00:00:00Z`))) })}</p>
    </div>
  </section>`;

  const metrics = c.content.traction;
  const traction = `<section class="sec" id="traction" aria-labelledby="traction-title">
    <div class="wrap split">
      ${secHead({ idx: '04', label: t('investors.traction.label'), title: t('investors.traction.title'), lead: t('investors.traction.lead'), id: 'traction-title' })}
      <div>
        ${metrics.length ? `<ul class="metrics">
          ${metrics.map(m => `<li class="metric">
            <p class="metric__num">${c.esc(L(m.metric))}</p>
            <p>${c.esc(L(m.context))}</p>
            <p class="metric__src mono">${m.date ? `<time datetime="${m.date}">${fmtMonth(c, m.date)}</time> · ` : ''}${c.esc(L(m.source) ?? '')}</p>
          </li>`).join('')}
        </ul>` : ''}
        <h3 class="h4">${t('investors.traction.milestonesTitle')}</h3>
        ${milestones(c)}
        ${metrics.length ? '' : `<p class="note">${t('investors.traction.commercialNote')}</p>`}
      </div>
    </div>
  </section>`;

  const team = c.content.team.length ? `<section class="sec" id="team" aria-labelledby="team-title">
    <div class="wrap">
      ${secHead({ idx: '05', label: t('investors.team.label'), title: t('investors.team.title'), lead: t('investors.team.lead'), id: 'team-title' })}
      ${teamGrid(c)}
    </div>
  </section>` : '';

  const model = (L(inv.businessModel) || L(inv.round)) ? `<section class="sec" id="model" aria-labelledby="model-title">
    <div class="wrap split">
      ${secHead({ idx: c.content.team.length ? '06' : '05', label: t('investors.model.label'), title: t('investors.model.title'), id: 'model-title' })}
      <div class="prose">
        ${L(inv.businessModel) ? `<h3>${t('investors.model.businessModel')}</h3><p>${c.esc(L(inv.businessModel))}</p>` : ''}
        ${L(inv.round) ? `<h3>${t('investors.model.round')}</h3><p>${c.esc(L(inv.round))}</p>` : ''}
      </div>
    </div>
  </section>` : '';

  const dataRoom = `<section class="band band--cta" aria-labelledby="room-title">
    <div class="band__bg" aria-hidden="true"></div>
    <div class="wrap band__in">
      <p class="idx mono">${t('investors.dataRoom.label')}</p>
      <h2 class="h2" id="room-title">${t('investors.dataRoom.title')}</h2>
      <p class="lead">${t('investors.dataRoom.body')}</p>
      <div class="actions">
        ${btn(roomHref, t('investors.dataRoom.cta'))}
        ${deck ? btn(c.esc(deck), t('investors.dataRoom.deck'), 'ghost') : ''}
      </div>
    </div>
  </section>`;

  return {
    title: t('investors.meta.title'),
    description: t('investors.meta.description'),
    body: [hero, problem, solution, whyNow, traction, team, model, dataRoom].join('\n'),
  };
}
