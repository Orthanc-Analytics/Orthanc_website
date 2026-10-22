// Orthanc Analytics: progressive enhancements. The site works without this file:
// the menu links stay visible, the hero map stays still and nothing animates.
(() => {
  const d = document;
  const html = d.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ---------------------------------------------------------------- mobile menu
  const hdr = d.querySelector('[data-hdr]');
  const menuBtn = hdr && hdr.querySelector('.menu-btn');
  const nav = d.getElementById('site-nav');
  if (hdr && menuBtn && nav) {
    const label = menuBtn.querySelector('.menu-btn__label');
    const outside = [d.querySelector('main'), d.querySelector('footer')].filter(Boolean);
    const setOpen = (open) => {
      hdr.classList.toggle('is-open', open);
      html.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? menuBtn.dataset.labelClose : menuBtn.dataset.labelOpen;
      outside.forEach((el) => { el.inert = open; });
      if (open) {
        const first = nav.querySelector('a');
        if (first) first.focus();
      }
    };
    menuBtn.addEventListener('click', () => setOpen(menuBtn.getAttribute('aria-expanded') !== 'true'));
    d.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && hdr.classList.contains('is-open')) {
        setOpen(false);
        menuBtn.focus();
      }
    });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    window.matchMedia('(min-width: 960px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
  }

  // ---------------------------------------------------------------- hero ticker (European capitals)
  const ticker = d.querySelector('[data-ticker]');
  if (ticker) {
    let cities = [];
    try { cities = JSON.parse(ticker.dataset.ticker); } catch (e) { cities = []; }
    const cityEl = ticker.querySelector('[data-ticker-city]');
    const coordEl = ticker.querySelector('[data-ticker-coord]');
    const toggle = ticker.querySelector('[data-ticker-toggle]');
    const pins = Array.from(d.querySelectorAll('.map--hero .pin'));
    let i = 0;
    let timer = null;

    const show = () => {
      const [key, name, coord] = cities[i];
      cityEl.textContent = name;
      coordEl.textContent = coord;
      pins.forEach((p) => p.classList.toggle('is-on', p.dataset.city === key));
    };
    const play = () => {
      if (timer || cities.length < 2) return;
      timer = window.setInterval(() => { i = (i + 1) % cities.length; show(); }, 2800);
      toggle.textContent = toggle.dataset.labelPause;
      toggle.setAttribute('aria-label', toggle.dataset.ariaPause);
    };
    const pause = () => {
      window.clearInterval(timer);
      timer = null;
      toggle.textContent = toggle.dataset.labelPlay;
      toggle.setAttribute('aria-label', toggle.dataset.ariaPlay);
    };

    if (cities.length && cityEl && coordEl && toggle) {
      show();
      toggle.hidden = false;
      toggle.addEventListener('click', () => (timer ? pause() : play()));
      if (reduceMotion.matches) pause(); else play();
      d.addEventListener('visibilitychange', () => {
        if (d.hidden && timer) { window.clearInterval(timer); timer = null; ticker.dataset.wasPlaying = '1'; }
        else if (!d.hidden && ticker.dataset.wasPlaying) { delete ticker.dataset.wasPlaying; play(); }
      });
    }
  }

  // ---------------------------------------------------------------- reveal on scroll
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const items = d.querySelectorAll('.sec__head, .audience__item, .mod, .band__in');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    items.forEach((el) => { el.classList.add('reveal'); io.observe(el); });
    html.classList.add('reveal-ready');
  }
})();
