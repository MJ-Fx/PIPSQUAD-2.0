/* ==========================================================
   PIPSQUAD — MAIN JS
   Handles: mobile nav, dropdowns, header scroll, reveals,
            typing effect, stat counters
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initDropdowns();
  initHeaderScroll();
  initScrollReveal();
  initTypingEffect();
  initStatCounters();
  initSmoothAnchors();
});

/* ---------- MOBILE MENU ---------- */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggle || !navMenu) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.toggle('active');
    toggle.classList.toggle('active');
    toggle.setAttribute(
      'aria-expanded',
      navMenu.classList.contains('active') ? 'true' : 'false'
    );
  });

  // Close on link click (mobile)
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900 && !link.closest('.dropdown')?.querySelector('.caret')) {
        navMenu.classList.remove('active');
        toggle.classList.remove('active');
      }
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (
      window.innerWidth <= 900 &&
      !e.target.closest('.nav-menu') &&
      !e.target.closest('.mobile-menu-toggle')
    ) {
      navMenu.classList.remove('active');
      toggle.classList.remove('active');
    }
  });

  // Reset on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      navMenu.classList.remove('active');
      toggle.classList.remove('active');
    }
  });
}

/* ---------- DROPDOWNS (mobile tap support) ---------- */
function initDropdowns() {
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach((drop) => {
    const trigger = drop.querySelector(':scope > a');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        drop.classList.toggle('open');
      }
    });
  });

  // Submenus on mobile
  document.querySelectorAll('.dropdown-submenu').forEach((sub) => {
    const trigger = sub.querySelector(':scope > a');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        sub.classList.toggle('open');
      }
    });
  });
}

/* ---------- HEADER SCROLL SHADOW ---------- */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- SCROLL REVEAL ---------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.feature-card, .value-card, .step-card, .stat-item, .founder-content, .founder-image, .mission-statement, .cta-content, .about-cta .container'
  );

  if (!targets.length) return;

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  });

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ---------- TYPING EFFECT (hero) ---------- */
function initTypingEffect() {
  const el = document.querySelector('.typing-text');
  if (!el) return;

  const text = el.textContent.trim();
  const fullText = text || 'Master the Markets with';
  el.textContent = '';
  el.style.minHeight = '1.2em';

  let i = 0;
  const type = () => {
    if (i <= fullText.length) {
      el.textContent = fullText.slice(0, i);
      i++;
      setTimeout(type, 45);
    }
  };

  // start after small delay
  setTimeout(type, 250);
}

/* ---------- STAT COUNTERS ---------- */
function initStatCounters() {
  const stats = document.querySelectorAll('.stat-number[data-count]');
  if (!stats.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  stats.forEach((el) => observer.observe(el));
}

function animateCount(el) {
  const raw = el.getAttribute('data-count');
  const suffix = raw.replace(/[\d.]/g, ''); // %, +, etc.
  const target = parseFloat(raw.replace(/[^\d.]/g, '')) || 0;
  const duration = 1400;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);

    // Format thousands
    const formatted =
      target >= 1000
        ? value.toLocaleString('en-US')
        : value.toString();

    el.textContent = formatted + suffix;

    if (progress < 1) requestAnimationFrame(step);
    else {
      // Final exact value
      el.textContent =
        (target >= 1000 ? target.toLocaleString('en-US') : target) + suffix;
    }
  };

  requestAnimationFrame(step);
}

/* ---------- SMOOTH ANCHOR SCROLL ---------- */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    link.addEventListener('click', (e) => {
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}