// Orthanc Analytics: progressive enhancements. The site works without this file:
// the menu links stay visible, every module panel is shown and nothing animates.
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

  // ---------------------------------------------------------------- tabs (Polis modules)
  d.querySelectorAll('[data-tabs]').forEach((root) => {
    const list = root.querySelector('.tabs__list');
    const tabs = Array.from(root.querySelectorAll('.tabs__tab'));
    const panels = tabs.map((t) => d.getElementById(t.dataset.panel));
    if (!list || !tabs.length || panels.some((p) => !p)) return;

    list.setAttribute('role', 'tablist');
    if (root.dataset.tabsLabel) list.setAttribute('aria-label', root.dataset.tabsLabel);
    tabs.forEach((tab, i) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panels[i].id);
      panels[i].setAttribute('role', 'tabpanel');
      panels[i].setAttribute('aria-labelledby', tab.id);
      panels[i].tabIndex = 0;
    });

    const select = (index, focus) => {
      tabs.forEach((tab, i) => {
        const on = i === index;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (focus) {
        tabs[index].focus();
        tabs[index].scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i, false));
      tab.addEventListener('keydown', (e) => {
        let next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = tabs.length - 1;
        if (next !== null) {
          e.preventDefault();
          select(next, true);
        }
      });
    });

    const fromHash = panels.findIndex((p) => `#${p.id}` === window.location.hash);
    select(fromHash >= 0 ? fromHash : 0, false);
  });

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
      toggle.setAttribute('aria-pressed', 'false');
    };
    const pause = () => {
      window.clearInterval(timer);
      timer = null;
      toggle.textContent = toggle.dataset.labelPlay;
      toggle.setAttribute('aria-pressed', 'true');
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
    const items = d.querySelectorAll('.sec__head, .stat, .point, .tenet, .card, .pipe__step, .layer, .fact, .route, .tl, .audience__item, .check, .row, .band__in, .band__row');
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
