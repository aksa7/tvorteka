/* ============================================================
   TVORTEKA - /straipsniai/ page scripts
   Scroll-triggered reveals
   ============================================================ */

(() => {
  "use strict";

  const setupReveals = () => {
    const elements = document.querySelectorAll(".reveal-scroll");
    if (!elements.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const stagger = el.dataset.stagger;
          const delay = stagger ? parseInt(stagger, 10) * 100 : 0;

          setTimeout(() => {
            el.classList.add("is-visible");
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

  const init = () => {
    setupReveals();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
