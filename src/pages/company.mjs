import { linkArrow, secHead, milestones, teamGrid, europeMap, ctaBand, subHero } from '../components.mjs';

export default function company(c) {
  const t = c.t;

  const hero = subHero(c, {
    eyebrow: t('company.hero.eyebrow'),
    title: t('company.hero.title'),
    lead: t('company.hero.lead'),
  });

  const principles = `<section class="sec" id="principles" aria-labelledby="principles-title">
    <div class="wrap">
      ${secHead({ idx: '01', label: t('company.principles.label'), title: t('company.principles.title'), lead: t('company.principles.lead'), id: 'principles-title' })}
      <ul class="tenets">
        ${t('company.principles.items').map((x, i) => `<li class="tenet"><p class="tenet__n mono">${String(i + 1).padStart(2, '0')}</p><h3 class="tenet__title">${x.title}</h3><p>${x.body}</p></li>`).join('')}
      </ul>
    </div>
  </section>`;

  const europe = `<section class="sec" id="europe" aria-labelledby="europe-title">
    <div class="wrap split split--visual">
      <div>
        ${secHead({ idx: '02', label: t('company.europe.label'), title: t('company.europe.title'), lead: t('company.europe.lead'), id: 'europe-title' })}
        ${t('company.europe.body').map(p => `<p>${p}</p>`).join('')}
      </div>
      ${europeMap(c, { pins: false })}
    </div>
  </section>`;

  const timeline = `<section class="sec" id="milestones" aria-labelledby="milestones-title">
    <div class="wrap split">
      ${secHead({ idx: '03', label: t('company.milestones.label'), title: t('company.milestones.title'), lead: t('company.milestones.lead'), id: 'milestones-title' })}
      ${milestones(c)}
    </div>
  </section>`;

  const team = c.content.team.length ? `<section class="sec" id="team" aria-labelledby="team-title">
    <div class="wrap">
      ${secHead({ idx: '04', label: t('company.team.label'), title: t('company.team.title'), lead: t('company.team.lead'), id: 'team-title' })}
      ${teamGrid(c)}
    </div>
  </section>` : '';

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
    title: t('company.meta.title'),
    description: t('company.meta.description'),
    body: [hero, principles, europe, timeline, team, investorBand, ctaBand(c)].join('\n'),
  };
}
