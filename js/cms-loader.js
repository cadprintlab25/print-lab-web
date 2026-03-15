/**
 * PRINT LAB — CMS Loader
 * Načítá data ze settings.json a hero.json
 * a dynamicky aplikuje obsah do všech stránek.
 */

(function () {
  'use strict';

  // ── Pomocné: fetch JSON bezpečně ──────────────────────────
  async function fetchJSON(path) {
    try {
      const res = await fetch(path + '?v=' + Date.now());
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  // ── Pomocné: nastav text v elementu ──────────────────────
  function setText(selector, value) {
    if (!value) return;
    document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
  }

  // ── Pomocné: nastav href/src ──────────────────────────────
  function setAttr(selector, attr, value) {
    if (!value) return;
    document.querySelectorAll(selector).forEach(el => { el.setAttribute(attr, value); });
  }

  // ── Aplikuj nastavení (settings.json) ─────────────────────
  function applySettings(s) {
    if (!s) return;

    // Název firmy v logu
    setText('[data-cms="site-name"]', s.site_name);
    setText('[data-cms="site-subtitle"]', s.site_subtitle);
    setText('[data-cms="owner-name"]', s.owner_name);

    // Logo obrázek — pokud je nahráno, nahradí text "PL"
    if (s.logo_image) {
      document.querySelectorAll('.logo-icon').forEach(el => {
        el.innerHTML = `<img src="${s.logo_image}" alt="${s.site_name || 'Logo'}" style="height:40px;width:auto;display:block;">`;
        el.style.background = 'transparent';
        el.style.padding = '0';
      });
    }

    // Kontaktní údaje
    if (s.contact) {
      const c = s.contact;
      setText('[data-cms="phone"]', c.phone);
      setAttr('[data-cms="phone-link"]', 'href', c.phone ? 'tel:' + c.phone.replace(/\s/g, '') : null);
      setText('[data-cms="email"]', c.email);
      setAttr('[data-cms="email-link"]', 'href', c.email ? 'mailto:' + c.email : null);
      setText('[data-cms="address-street"]', c.address_street);
      setText('[data-cms="address-city"]', c.address_city);

      // Kombinovaná adresa
      if (c.address_street || c.address_city) {
        setText('[data-cms="address-full"]', [c.address_street, c.address_city].filter(Boolean).join(', '));
      }
    }

    // Sociální sítě
    if (s.social) {
      const socMap = { facebook: '.social-facebook', instagram: '.social-instagram', linkedin: '.social-linkedin', youtube: '.social-youtube' };
      Object.entries(socMap).forEach(([key, sel]) => {
        const url = s.social[key];
        if (url) {
          document.querySelectorAll(sel).forEach(el => {
            el.href = url;
            el.style.display = '';
          });
        } else {
          document.querySelectorAll(sel).forEach(el => { el.style.display = 'none'; });
        }
      });
    }

    // Titulek stránky (tab)
    if (s.site_name) {
      const currentTitle = document.title;
      if (currentTitle.includes('PRINT LAB')) {
        document.title = currentTitle.replace('PRINT LAB', s.site_name);
      }
    }
  }

  // ── Aplikuj hero obsah (hero.json) ─────────────────────────
  function applyHero(h) {
    if (!h) return;

    setText('[data-cms="hero-headline1"]', h.headline1);
    setText('[data-cms="hero-headline2"]', h.headline2);
    setText('[data-cms="hero-description"]', h.description);
    setText('[data-cms="cta-primary"]', h.cta_primary);
    setText('[data-cms="cta-secondary"]', h.cta_secondary);

    // Hero pozadí
    if (h.hero_image) {
      const heroBg = document.querySelector('.hero-bg');
      if (heroBg) {
        heroBg.style.backgroundImage = `url(${h.hero_image})`;
        heroBg.style.backgroundSize = 'cover';
        heroBg.style.backgroundPosition = 'center';
      }
    }

    // Statistiky
    if (h.stats && Array.isArray(h.stats)) {
      const statEls = document.querySelectorAll('[data-cms="stat-item"]');
      statEls.forEach((el, i) => {
        if (h.stats[i]) {
          const valEl = el.querySelector('[data-cms="stat-value"]');
          const lblEl = el.querySelector('[data-cms="stat-label"]');
          if (valEl) valEl.textContent = h.stats[i].value;
          if (lblEl) lblEl.textContent = h.stats[i].label;
        }
      });
    }
  }

  // ── Načti galerii z JSON souborů ───────────────────────────
  async function loadGallery() {
    const gallery = document.querySelector('[data-cms="gallery-grid"]');
    if (!gallery) return;

    // Načti manifest galerie (seznam JSON souborů)
    const manifest = await fetchJSON('/data/gallery-manifest.json');
    if (!manifest || !manifest.files) return;

    const items = [];
    for (const file of manifest.files) {
      const item = await fetchJSON('/data/gallery/' + file);
      if (item) items.push(item);
    }

    if (items.length === 0) return;

    // Vyrenderuj galerii
    gallery.innerHTML = items.map(item => `
      <div class="gallery-item" data-category="${item.category || 'ostatni'}">
        <div class="gallery-img-wrap">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
          <div class="gallery-overlay">
            <span class="gallery-zoom">🔍</span>
          </div>
        </div>
        <div class="gallery-info">
          <h3>${item.title}</h3>
          ${item.description ? `<p>${item.description}</p>` : ''}
        </div>
      </div>
    `).join('');
  }

  // ── Inicializace při DOM ready ─────────────────────────────
  async function init() {
    const basePath = '/data';

    // Paralelní načtení dat
    const [settings, hero] = await Promise.all([
      fetchJSON(basePath + '/settings.json'),
      fetchJSON(basePath + '/hero.json')
    ]);

    applySettings(settings);
    applyHero(hero);
    await loadGallery();
  }

  // Spusť po načtení DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
