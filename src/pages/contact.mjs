import { btn, linkArrow, mailto, operatorBlock, privacyNote, subHero } from '../components.mjs';

export default function contact(c) {
  const t = c.t;
  const email = c.site.company.email;
  const inv = c.content.investors;

  const hero = subHero(c, {
    eyebrow: t('contact.hero.eyebrow'),
    title: t('contact.hero.title'),
    lead: t('contact.hero.lead'),
  });

  const routes = t('contact.routes').map(r => {
    const to = r.id === 'investors' && inv.dataRoomEmail ? inv.dataRoomEmail : email;
    return `<li class="route" id="${r.id}">
      <p class="route__label mono">${r.label}</p>
      <h2 class="h3 route__title">${r.title}</h2>
      <p>${r.body}</p>
      ${r.include?.length ? `<p class="route__inc mono">${t('contact.includeLabel')}</p><ul class="ticks">${r.include.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}
      <div class="route__cta">${btn(mailto(to, r.mailSubject, r.mailBody), r.cta, r.id === 'demo' ? '' : 'ghost')}${privacyNote(c)}</div>
    </li>`;
  }).join('');

  const body = `${hero}
  <section class="sec sec--routes" aria-label="${c.attr(t('contact.routesLabel'))}">
    <div class="wrap">
      <ul class="routes">${routes}</ul>
      <p class="note">${t('contact.mailNote', { email: `<a href="mailto:${email}">${c.esc(email)}</a>` })}</p>
      ${privacyNote(c)}
    </div>
  </section>
  <section class="sec" id="details" aria-labelledby="details-title">
    <div class="wrap split">
      <header class="sec__head">
        <h2 class="h2" id="details-title">${t('contact.details.title')}</h2>
      </header>
      ${operatorBlock(c)}
    </div>
  </section>
  <section class="sec sec--inv" id="privacy-note" aria-labelledby="pn-title">
    <div class="wrap split">
      <header class="sec__head"><h2 class="h3" id="pn-title">${t('contact.privacy.title')}</h2></header>
      <div>
        <p>${t('contact.privacy.body')}</p>
        <p>${linkArrow(c.href('privacy'), t('contact.privacy.link'))}</p>
      </div>
    </div>
  </section>`;

  return {
    title: t('contact.meta.title'),
    description: t('contact.meta.description'),
    body,
  };
}
