/* ==========================================
   PRINT LAB — Main JavaScript
   ========================================== */

/* ---- Email obfuscation ---- */
(function () {
  var u = 'cadprintlab' + '\x2E25';
  var d = 'gmail' + '\x2Ecom';
  var e = u + '\x40' + d;
  document.querySelectorAll('[data-email-link]').forEach(function (el) {
    el.href = 'mailto:' + e;
  });
  document.querySelectorAll('[data-email-text]').forEach(function (el) {
    el.textContent = e;
  });
})();

/* ---- Auto noopener na externích odkazech ---- */
document.querySelectorAll('a[href^="http"]').forEach(function (link) {
  var rel = link.getAttribute('rel') || '';
  if (!rel.includes('noopener')) {
    link.setAttribute('rel', (rel ? rel + ' ' : '') + 'noopener noreferrer');
  }
});

/* ---- Navbar scroll effect ---- */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ---- Mobile menu ---- */
const menuToggle = document.querySelector('.menu-toggle');
const navLinks   = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      menuToggle.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}

/* ---- Active nav link ---- */
(function setActiveLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ---- Scroll reveal ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- Counter animation ---- */
function animateCounter(el, target, suffix = '', duration = 1800) {
  const startTime = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function update(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value    = Math.floor(easeOut(progress) * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

/* ---- Skill bars ---- */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar   = entry.target;
      const width = bar.dataset.width;
      setTimeout(() => {
        bar.style.width = width + '%';
      }, 200);
      barObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.spec-bar-fill').forEach(bar => {
  bar.style.width = '0%';
  barObserver.observe(bar);
});

/* ---- Gallery filters ---- */
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems  = document.querySelectorAll('.gallery-item');

if (filterButtons.length > 0) {
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

/* ---- File upload zone ---- */
const fileUploadZone = document.getElementById('fileUploadZone');
const fileInput       = document.getElementById('attachments');
const fileList        = document.getElementById('fileList');
let selectedFiles     = [];

function formatSize(bytes) {
  if (bytes < 1024)       return bytes + ' B';
  if (bytes < 1024*1024)  return (bytes/1024).toFixed(0) + ' KB';
  return (bytes/(1024*1024)).toFixed(1) + ' MB';
}

function renderFileList() {
  if (!fileList) return;
  fileList.innerHTML = '';
  selectedFiles.forEach((file, idx) => {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.innerHTML = `
      <span class="file-item-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
          <polyline points="13 2 13 9 20 9"/>
        </svg>
      </span>
      <span class="file-item-name" title="${file.name}">${file.name}</span>
      <span class="file-item-size">${formatSize(file.size)}</span>
      <button type="button" class="file-item-remove" aria-label="Odebrat soubor"
              onclick="removeFile(${idx})">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>`;
    fileList.appendChild(item);
  });
}

window.removeFile = function(idx) {
  selectedFiles.splice(idx, 1);
  syncFileInput();
  renderFileList();
};

function syncFileInput() {
  if (!fileInput) return;
  const dt = new DataTransfer();
  selectedFiles.forEach(f => dt.items.add(f));
  fileInput.files = dt.files;
}

if (fileInput) {
  fileInput.addEventListener('change', function() {
    Array.from(fileInput.files).forEach(f => {
      if (!selectedFiles.find(s => s.name === f.name && s.size === f.size)) {
        selectedFiles.push(f);
      }
    });
    syncFileInput();
    renderFileList();
  });
}

if (fileUploadZone) {
  ['dragenter','dragover'].forEach(ev => {
    fileUploadZone.addEventListener(ev, e => { e.preventDefault(); fileUploadZone.classList.add('drag-over'); });
  });
  ['dragleave','drop'].forEach(ev => {
    fileUploadZone.addEventListener(ev, e => {
      e.preventDefault();
      fileUploadZone.classList.remove('drag-over');
      if (ev === 'drop') {
        Array.from(e.dataTransfer.files).forEach(f => {
          if (!selectedFiles.find(s => s.name === f.name && s.size === f.size)) selectedFiles.push(f);
        });
        syncFileInput();
        renderFileList();
      }
    });
  });
}

/* ---- Form handling (Web3Forms) ---- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.form-submit');
    const successMsg = document.getElementById('formSuccess');
    const spinSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;animation:spin .8s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>';
    const sendSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';

    submitBtn.disabled = true;
    submitBtn.innerHTML = spinSvg + ' Odesílám…';

    const formData = new FormData(contactForm);

    fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.message || 'Chyba odeslání');
        submitBtn.innerHTML = '✓ Odesláno!';
        submitBtn.style.background = '#10b981';
        if (successMsg) successMsg.style.display = 'block';
        contactForm.reset();
        selectedFiles = [];
        renderFileList();
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = sendSvg + ' Odeslat poptávku';
          submitBtn.style.background = '';
          if (successMsg) successMsg.style.display = 'none';
        }, 5000);
      })
      .catch(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Zkuste to znovu';
        submitBtn.style.background = '#ef4444';
        setTimeout(() => { submitBtn.style.background = ''; submitBtn.innerHTML = sendSvg + ' Odeslat poptávku'; }, 3000);
      });
  });
}

/* ---- Image error handlers (náhrada za inline onerror) ---- */
function handleImgError(img) {
  // Tiskárny — skrýt obrázek při chybě načtení
  if (img.classList.contains('printer-img')) {
    img.style.display = 'none';
    return;
  }
  // Slideshow — zobrazit placeholder při chybě načtení
  const slide = img.closest('.slide');
  if (slide) {
    const placeholder = slide.querySelector('.slide-placeholder');
    if (placeholder) placeholder.style.display = 'flex';
    img.style.display = 'none';
  }
}

// Capture phase — zachytí chyby nových obrázků
document.addEventListener('error', function(e) {
  if (e.target.tagName === 'IMG') handleImgError(e.target);
}, true);

// Fallback — main.js se spouští po parsování DOM, takže ihned zkontrolujeme
// obrázky, jejichž error event již proběhl před registrací capture listeneru
document.querySelectorAll('img').forEach(function(img) {
  if (img.complete && img.naturalWidth === 0) handleImgError(img);
});

/* ---- Smooth anchor scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: 'smooth'
      });
    }
  });
});

/* ---- Typewriter effect for hero ---- */
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

/* ---- Add reveal classes to cards on load ---- */
document.addEventListener('DOMContentLoaded', () => {
  // Stagger card animations
  document.querySelectorAll('.card, .service-card, .value-card, .equipment-card').forEach((el, i) => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 4 * 0.1) + 's';
    }
  });

  // Re-observe new elements
  document.querySelectorAll('.reveal').forEach(el => {
    if (!el.classList.contains('visible')) {
      revealObserver.observe(el);
    }
  });

  // ---- Printer tab switcher + auto-rotate ----
  const tabs = document.querySelectorAll('.printer-tab');
  const specs = document.querySelectorAll('.printer-specs');
  let autoTimer = null;

  function switchPrinter(id) {
    tabs.forEach(t => {
      const isActive = t.dataset.printer === id;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    specs.forEach(s => s.classList.toggle('active', s.id === 'specs-' + id));
  }

  function startAuto() {
    const printers = ['snapmaker', 'flashforge'];
    let idx = 0;
    autoTimer = setInterval(() => {
      idx = (idx + 1) % printers.length;
      switchPrinter(printers[idx]);
    }, 5000);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      clearInterval(autoTimer);
      switchPrinter(tab.dataset.printer);
      startAuto(); // restart timer po manuálním kliknutí
    });
  });

  startAuto();
});
