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

    // Paralelní načtení všech položek najednou (místo jedné za druhou)
    const results = await Promise.all(manifest.files.map(file => fetchJSON('/data/gallery/' + file)));
    const items = results.filter(Boolean);

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
    initGalleryFilters(gallery);
    initLightbox(gallery);
  }

  // ── Filtrování galerie — svázáno až po vložení položek do DOM ──
  function initGalleryFilters(gallery) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = gallery.querySelectorAll('.gallery-item');
    if (filterButtons.length === 0) return;

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const filter = btn.dataset.filter;
        galleryItems.forEach(item => {
          const category = item.dataset.category;
          if (filter === 'all' || category === filter) {
            item.style.display = '';
            setTimeout(() => item.style.opacity = '1', 10);
          } else {
            item.style.opacity = '0';
            setTimeout(() => item.style.display = 'none', 250);
          }
        });
      });
    });
  }

  // ── Lightbox — zvětšení fotky po kliknutí, s navigací ──────
  function initLightbox(gallery) {
    let lb = document.querySelector('.lightbox');
    if (!lb) {
      lb = document.createElement('div');
      lb.className = 'lightbox';
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.innerHTML =
        '<button type="button" class="lightbox-close" aria-label="Zavřít"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
        '<button type="button" class="lightbox-prev" aria-label="Předchozí fotka"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>' +
        '<button type="button" class="lightbox-next" aria-label="Další fotka"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>' +
        '<div class="lightbox-content"><img class="lightbox-img" alt=""><div class="lightbox-caption"></div></div>';
      document.body.appendChild(lb);
    }

    const imgEl = lb.querySelector('.lightbox-img');
    const captionEl = lb.querySelector('.lightbox-caption');
    let currentIdx = 0;

    function visibleItems() {
      return Array.from(gallery.querySelectorAll('.gallery-item')).filter(i => i.style.display !== 'none');
    }

    function show(idx) {
      const items = visibleItems();
      if (items.length === 0) return;
      currentIdx = (idx + items.length) % items.length;
      const item = items[currentIdx];
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-overlay-title');
      imgEl.src = img.src;
      imgEl.alt = img.alt;
      captionEl.textContent = title ? title.textContent : '';
    }

    function open(idx) {
      show(idx);
      lb.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lb.classList.remove('active');
      document.body.style.overflow = '';
    }

    gallery.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      const idx = visibleItems().indexOf(item);
      if (idx !== -1) open(idx);
    });

    lb.querySelector('.lightbox-close').addEventListener('click', close);
    lb.querySelector('.lightbox-prev').addEventListener('click', () => show(currentIdx - 1));
    lb.querySelector('.lightbox-next').addEventListener('click', () => show(currentIdx + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });

    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(currentIdx - 1);
      if (e.key === 'ArrowRight') show(currentIdx + 1);
    });
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

    if (cenik3d && cenik3d.items) {
      renderCenikTable('[data-cms="cenik-3d-table"]', cenik3d.items, 'description');
      initCalculator(cenik3d.items);
    }
    if (cenikGravir && cenikGravir.items) renderCenikTable('[data-cms="cenik-gravir-table"]', cenikGravir.items, 'area');
  }

  // ── Kalkulačka orientační ceny (materiál × hodiny) ─────────
  function initCalculator(items) {
    const wrap = document.querySelector('[data-cms="price-calculator"]');
    if (!wrap || !items || items.length === 0) return;

    const materialSelect = wrap.querySelector('#calcMaterial');
    const hoursInput = wrap.querySelector('#calcHours');
    const resultEl = wrap.querySelector('#calcResult');
    if (!materialSelect || !hoursInput || !resultEl) return;

    materialSelect.innerHTML = '';
    items.forEach((item, idx) => {
      const opt = document.createElement('option');
      opt.value = String(idx);
      opt.textContent = item.name + ' (od ' + item.price_from + ' Kč/h)';
      materialSelect.appendChild(opt);
    });

    function calculate() {
      const item = items[Number(materialSelect.value)];
      const hours = parseFloat(hoursInput.value);
      if (!item || !hours || hours <= 0) {
        resultEl.innerHTML = 'Zadejte odhadovanou dobu tisku v hodinách.';
        return;
      }
      const price = Math.round(item.price_from * hours);
      resultEl.innerHTML = 'Orientační cena materiálu <strong>' + item.name + '</strong> na ' + hours + ' h tisku: ' +
        '<span class="calc-price">od ' + price.toLocaleString('cs-CZ') + ' Kč</span>';
    }

    materialSelect.addEventListener('change', calculate);
    hoursInput.addEventListener('input', calculate);
    calculate();
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

  // ── Reference / recenze zákazníků (reviews.json) ───────────
  function starMarkup(rating) {
    const r = Math.max(0, Math.min(5, Math.round(rating) || 0));
    let out = '';
    for (let i = 0; i < 5; i++) out += i < r ? '★' : '<span class="star-empty">★</span>';
    return out;
  }

  async function loadReviews() {
    const section = document.querySelector('[data-cms="reviews-section"]');
    const grid = document.querySelector('[data-cms="reviews-grid"]');
    if (!section || !grid) return;

    const data = await fetchJSON('/data/reviews.json');
    if (!data || !Array.isArray(data.items) || data.items.length === 0) return; // žádné recenze zatím -> sekce zůstává skrytá

    grid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    data.items.forEach(r => {
      const card = document.createElement('div');
      card.className = 'review-card';

      const stars = document.createElement('div');
      stars.className = 'review-stars';
      stars.innerHTML = starMarkup(r.rating);

      const text = document.createElement('p');
      text.className = 'review-text';
      text.textContent = '„' + (r.text || '') + '“';

      const author = document.createElement('div');
      author.className = 'review-author';

      const name = document.createElement('span');
      name.className = 'review-name';
      name.textContent = r.name || '';
      author.appendChild(name);

      if (r.service) {
        const service = document.createElement('span');
        service.className = 'review-service';
        service.textContent = r.service;
        author.appendChild(service);
      }

      card.appendChild(stars);
      card.appendChild(text);
      card.appendChild(author);
      fragment.appendChild(card);
    });
    grid.appendChild(fragment);

    section.style.display = '';
    section.classList.add('visible');
  }

  // ── Inicializace při DOM ready ─────────────────────────────
  async function init() {
    const basePath = '/data';

    // Nastavení (název, kontakty) se používá na každé stránce (navigace, patička)
    const needsHero = !!document.querySelector('[data-cms="hero-description"], [data-cms="cta-primary"], [data-cms="cta-secondary"]');
    const needsOMne = !!document.querySelector('[data-cms="about-bio"], [data-cms="about-skills"], [data-cms="timeline-list"]');

    // Paralelní načtení dat — jen to, co daná stránka skutečně používá
    const [settings, hero, omne] = await Promise.all([
      fetchJSON(basePath + '/settings.json'),
      needsHero ? fetchJSON(basePath + '/hero.json') : Promise.resolve(null),
      needsOMne ? fetchJSON(basePath + '/o-mne.json') : Promise.resolve(null)
    ]);

    applySettings(settings);
    applyHero(hero);
    applyOMne(omne);
    await Promise.all([loadGallery(), loadCenik(), loadReviews()]);
  }

  // Spusť po načtení DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
