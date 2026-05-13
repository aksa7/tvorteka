/* ============================================================
   TVORTEKA — /apie/ page scripts
   Scroll-triggered reveals, counters, mobile menu
   ============================================================ */

(() => {
  "use strict";

  /* ---------- Scroll reveal (triggered when element enters viewport) ---------- */
  const setupReveals = () => {
    const elements = document.querySelectorAll('.reveal-scroll');
    if (!elements.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const stagger = el.dataset.stagger;
          const delay = stagger ? parseInt(stagger) * 100 : 0;

          setTimeout(() => {
            el.classList.add('is-visible');
          }, delay);

          obs.unobserve(el);
        }
      });
    }, { 
      threshold: 0.15, 
      rootMargin: "0px 0px -50px 0px" 
    });

    elements.forEach(el => obs.observe(el));
  };

  /* ---------- Stats counter animation ---------- */
  const setupCounters = () => {
    const counters = document.querySelectorAll('.about-stat-number[data-target]');
    if (!counters.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target);
          const duration = 2000;
          const start = performance.now();

          function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            el.textContent = Math.floor(ease * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
          }
          requestAnimationFrame(update);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => obs.observe(c));
  };

  /* ---------- FAQ accordion (for process steps) ---------- */
  const setupProcessAccordion = () => {
    const items = document.querySelectorAll('.about-process-steps .faq-item');
    if (!items.length) return;

    items.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        items.forEach(i => {
          i.classList.remove('is-open');
          i.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  };

  /* ---------- Mobile menu (standalone, doesn't depend on main.js) ---------- */
  const setupMobileMenu = () => {
    const burger = document.getElementById('burger');
    const menu = document.getElementById('mobileMenu');
    if (!burger || !menu) return;

    const close = () => {
      menu.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
    };

    const toggle = () => {
      const isOpen = menu.classList.toggle('is-open');
      document.body.classList.toggle('menu-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    };

    burger.addEventListener('click', toggle);
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) close();
    });
  };

  /* ---------- Navbar scroll state ---------- */
  const setupNavbar = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const onScroll = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 32);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  };

  /* ---------- Init ---------- */
  const init = () => {
    setupReveals();
    setupCounters();
    setupProcessAccordion();
    setupMobileMenu();
    setupNavbar();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();