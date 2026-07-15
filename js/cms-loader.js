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

  // ── Popisky kategorií v přehledovém štítku ─────────────────
  const GALLERY_CATEGORY_LABELS = {
    print: '3D Tisk',
    laser: 'Gravírování',
    cad: 'CAD',
    ostatni: 'Ostatní'
  };

  // ── Načti galerii z JSON souborů ───────────────────────────
  async function loadGallery() {
    const gallery = document.querySelector('[data-cms="gallery-grid"]');
    if (!gallery) return;

    // Načti manifest galerie (seznam JSON souborů)
    const manifest = await fetchJSON('/data/gallery-manifest.json');
    if (!manifest || !manifest.files || manifest.files.length === 0) return;

    const items = [];
    for (const file of manifest.files) {
      const item = await fetchJSON('/data/gallery/' + file);
      if (item) items.push(item);
    }

    if (items.length === 0) return;

    // Vyrenderuj galerii — bezpečně přes DOM API (prevence XSS)
    gallery.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (const item of items) {
      const category = item.category || 'ostatni';

      const card = document.createElement('div');
      card.className = 'gallery-item';
      card.dataset.category = category;

      const img = document.createElement('img');
      img.src = item.image || '';
      img.alt = item.title || '';
      img.loading = 'lazy';

      const overlay = document.createElement('div');
      overlay.className = 'gallery-overlay';

      const overlayContent = document.createElement('div');
      overlayContent.className = 'gallery-overlay-content';

      const tag = document.createElement('div');
      tag.className = 'gallery-overlay-tag';
      tag.textContent = GALLERY_CATEGORY_LABELS[category] || category;

      const title = document.createElement('div');
      title.className = 'gallery-overlay-title';
      title.textContent = item.title || '';

      overlayContent.appendChild(tag);
      overlayContent.appendChild(title);
      overlay.appendChild(overlayContent);

      card.appendChild(img);
      card.appendChild(overlay);
      fragment.appendChild(card);
    }
    gallery.appendChild(fragment);
  }

  // ── Ceník — vzhled štítku typu materiálu ───────────────────
  const CENIK_TYPE_STYLES = {
    standard:   { label: 'Standard',   style: 'background:var(--blue-subtle);color:var(--blue);border:1px solid rgba(59,130,246,0.2);' },
    technicky:  { label: 'Technický',  style: 'background:var(--accent-subtle);color:var(--accent);border:1px solid var(--accent-border);' },
    flexibilni: { label: 'Flexibilní', style: 'background:rgba(16,185,129,0.1);color:var(--success);border:1px solid rgba(16,185,129,0.3);' }
  };
  const BADGE_BASE = 'padding:3px 10px;border-radius:999px;font-size:0.7rem;font-weight:600;';

  function buildCenikRow(item, lastColValue) {
    const tr = document.createElement('tr');

    const tdName = document.createElement('td');
    const name = document.createElement('span');
    name.className = 'material-name';
    name.textContent = item.name || '';
    tdName.appendChild(name);

    const tdType = document.createElement('td');
    const typeInfo = CENIK_TYPE_STYLES[item.type] || CENIK_TYPE_STYLES.standard;
    const type = document.createElement('span');
    type.className = 'material-type';
    type.setAttribute('style', BADGE_BASE + typeInfo.style);
    type.textContent = typeInfo.label;
    tdType.appendChild(type);

    const tdPrice = document.createElement('td');
    const priceVal = document.createElement('span');
    priceVal.className = 'price-val';
    priceVal.textContent = 'od ' + (item.price_from != null ? item.price_from : '') + ' Kč';
    const priceUnit = document.createElement('span');
    priceUnit.className = 'price-unit';
    priceUnit.textContent = ' / h';
    tdPrice.appendChild(priceVal);
    tdPrice.appendChild(priceUnit);

    const tdLast = document.createElement('td');
    tdLast.setAttribute('style', 'font-size:0.8rem;color:var(--text-muted);');
    tdLast.textContent = lastColValue || '';

    tr.appendChild(tdName);
    tr.appendChild(tdType);
    tr.appendChild(tdPrice);
    tr.appendChild(tdLast);
    return tr;
  }

  function renderCenikTable(selector, items, lastColKey) {
    const tbody = document.querySelector(selector);
    if (!tbody || !items || items.length === 0) return;
    tbody.innerHTML = '';
    const fragment = document.createDocumentFragment();
    items.forEach(item => fragment.appendChild(buildCenikRow(item, item[lastColKey])));
    tbody.appendChild(fragment);
  }

  // ── Načti ceník z JSON souborů (pokud je na stránce) ───────
  async function loadCenik() {
    const has3d = document.querySelector('[data-cms="cenik-3d-table"]');
    const hasGravir = document.querySelector('[data-cms="cenik-gravir-table"]');
    if (!has3d && !hasGravir) return;

    const [cenik3d, cenikGravir] = await Promise.all([
      has3d ? fetchJSON('/data/cenik-3d.json') : Promise.resolve(null),
      hasGravir ? fetchJSON('/data/cenik-gravir.json') : Promise.resolve(null)
    ]);

    if (cenik3d && cenik3d.items) renderCenikTable('[data-cms="cenik-3d-table"]', cenik3d.items, 'description');
    if (cenikGravir && cenikGravir.items) renderCenikTable('[data-cms="cenik-gravir-table"]', cenikGravir.items, 'area');
  }

  // ── Aplikuj obsah stránky O mně (o-mne.json) ───────────────
  function applyOMne(o) {
    if (!o) return;

    if (Array.isArray(o.bio) && o.bio.length) {
      document.querySelectorAll('[data-cms="about-bio"]').forEach(el => {
        el.innerHTML = '';
        o.bio.forEach(paragraph => {
          const p = document.createElement('p');
          p.textContent = paragraph;
          el.appendChild(p);
        });
      });
    }

    if (Array.isArray(o.skills) && o.skills.length) {
      document.querySelectorAll('[data-cms="about-skills"]').forEach(el => {
        el.innerHTML = '';
        o.skills.forEach(skill => {
          const span = document.createElement('span');
          span.className = 'skill-tag';
          span.textContent = skill;
          el.appendChild(span);
        });
      });
    }

    if (Array.isArray(o.timeline) && o.timeline.length) {
      document.querySelectorAll('[data-cms="timeline-list"]').forEach(el => {
        el.innerHTML = '';
        let lastCategory = null;
        o.timeline.forEach(item => {
          if (item.category && item.category !== lastCategory) {
            const cat = document.createElement('div');
            cat.className = 'timeline-category';
            cat.textContent = item.category;
            el.appendChild(cat);
            lastCategory = item.category;
          }
          const wrap = document.createElement('div');
          wrap.className = 'timeline-item';

          const year = document.createElement('div');
          year.className = 'timeline-year';
          year.textContent = item.year || '';

          const title = document.createElement('div');
          title.className = 'timeline-title';
          title.textContent = item.title || '';

          const desc = document.createElement('div');
          desc.className = 'timeline-desc';
          desc.textContent = item.desc || '';

          wrap.appendChild(year);
          wrap.appendChild(title);
          wrap.appendChild(desc);
          el.appendChild(wrap);
        });
      });
    }
  }

  // ── Inicializace při DOM ready ─────────────────────────────
  async function init() {
    const basePath = '/data';

    // Paralelní načtení dat
    const [settings, hero, omne] = await Promise.all([
      fetchJSON(basePath + '/settings.json'),
      fetchJSON(basePath + '/hero.json'),
      fetchJSON(basePath + '/o-mne.json')
    ]);

    applySettings(settings);
    applyHero(hero);
    applyOMne(omne);
    await Promise.all([loadGallery(), loadCenik()]);
  }

  // Spusť po načtení DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
