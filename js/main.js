/* ============================================================
   TVORTEKA — Main scripts (v3)
   ============================================================ */

(() => {
  "use strict";

  /* ---------- Mobile menu (burger toggles to X, no separate close) ---------- */
  const setupMobileMenu = () => {
    const burger = document.getElementById("burger");
    const menu   = document.getElementById("mobileMenu");

    if (!burger || !menu) return;

    const close = () => {
      menu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      burger.setAttribute("aria-expanded", "false");
    };

    const toggle = () => {
      const isOpen = menu.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
    };

    burger.addEventListener("click", toggle);

    // Close on link click
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", close));

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) close();
    });
  };


  /* ---------- Navbar scroll state + adaptive theme ---------- */
  const setupNavbar = () => {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    const sections = document.querySelectorAll("[data-nav-theme]");

    const onScroll = () => {
      navbar.classList.toggle("is-scrolled", window.scrollY > 32);

      // Determine theme based on what section the navbar is over
      if (sections.length === 0) return;
      const navHeight = navbar.offsetHeight;
      const probe = navHeight / 2;
      let activeTheme = navbar.dataset.theme || "dark";

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= probe && rect.bottom > probe) {
          activeTheme = section.dataset.navTheme || activeTheme;
        }
      });

      if (navbar.dataset.theme !== activeTheme) {
        navbar.dataset.theme = activeTheme;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  };


  /* ---------- Scroll reveal ---------- */
  const setupReveals = () => {
    const elements = document.querySelectorAll(".reveal-scroll");
    if (elements.length === 0) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    elements.forEach(el => obs.observe(el));
  };


  /* ---------- Process line draw ---------- */
  const setupProcessLine = () => {
    const line = document.querySelector(".process-line");
    const steps = document.querySelector(".process-steps");
    if (!line || !steps) return;

    const markers = steps.querySelectorAll(".process-step-marker");
    if (markers.length < 2) return;

    const positionLine = () => {
      if (window.innerWidth < 1024) return;
      const first = markers[0].getBoundingClientRect();
      const last = markers[markers.length - 1].getBoundingClientRect();
      const container = steps.getBoundingClientRect();
      const startX = first.left + first.width / 2 - container.left;
      const endX = last.left + last.width / 2 - container.left;
      line.style.left = `${startX}px`;
      line.style.width = `${Math.max(0, endX - startX)}px`;
    };

    positionLine();
    window.addEventListener("resize", positionLine);

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          positionLine();
          line.classList.add("is-drawn");
          obs.unobserve(line);
        }
      });
    }, { threshold: 0.4 });

    obs.observe(line);
  };


  /* ---------- FAQ accordion ---------- */
  const setupFaq = () => {
    const items = document.querySelectorAll(".faq-item");
    if (items.length === 0) return;

    items.forEach(item => {
      const trigger = item.querySelector(".faq-trigger");
      if (!trigger) return;

      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        items.forEach(i => i.classList.remove("is-open"));
        if (!isOpen) item.classList.add("is-open");
      });
    });
  };


  /* ---------- Fence carousel — side arrows, exact 3 cards ---------- */
  const setupFenceCarousel = () => {
    const section = document.querySelector(".fences-section");
    if (!section) return;

    const viewport = section.querySelector(".fences-viewport");
    const track    = section.querySelector(".fences-track");
    const prevBtn  = section.querySelector(".fences-arrow-prev");
    const nextBtn  = section.querySelector(".fences-arrow-next");

    if (!viewport || !track) return;

    const cards = track.querySelectorAll(".fence-card");
    if (cards.length === 0) return;

    /* Update arrow visibility based on scroll position */
    const updateArrows = () => {
      const scrollLeft = viewport.scrollLeft;
      const maxScroll  = viewport.scrollWidth - viewport.clientWidth;

      // Hide PREV when at start
      if (prevBtn) {
        prevBtn.classList.toggle("is-hidden", scrollLeft <= 4);
      }

      // Hide NEXT when at end
      if (nextBtn) {
        nextBtn.classList.toggle("is-hidden", scrollLeft >= maxScroll - 4);
      }
    };

    /* Compute scroll step (one card width + gap) */
    const getScrollStep = () => {
      const cardW = cards[0].getBoundingClientRect().width;
      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.gap) || 16;
      return cardW + gap;
    };

    /* Click handlers */
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        viewport.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        viewport.scrollBy({ left: getScrollStep(), behavior: "smooth" });
      });
    }

    /* Listen for scroll */
    viewport.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);

    /* Initial state */
    requestAnimationFrame(updateArrows);
  };


  /* ---------- Product detail page: auto-swiping image carousel ---------- */
  const setupProductGallery = () => {
    const galleries = document.querySelectorAll(".product-gallery");
    if (galleries.length === 0) return;

    galleries.forEach(gallery => {
      const track = gallery.querySelector(".product-gallery-track");
      const slides = gallery.querySelectorAll(".product-gallery-slide");
      const dots = gallery.querySelectorAll(".product-gallery-dot");

      if (!track || slides.length === 0) return;

      // Vienas slide — be karuselės
      if (slides.length === 1) {
        const dotsBox = gallery.querySelector(".product-gallery-dots");
        if (dotsBox) dotsBox.style.display = "none";
        return;
      }

      let currentIdx = 0;
      let intervalId = null;
      const AUTO_DELAY = 3000; // 3 sek

      const goTo = (idx) => {
        currentIdx = (idx + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentIdx * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle("is-active", i === currentIdx));
      };

      const next = () => goTo(currentIdx + 1);

      const stop = () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      };

      const start = () => {
        stop();
        intervalId = setInterval(next, AUTO_DELAY);
      };

      // Dot mygtukai
      dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
          goTo(i);
          start(); // reset timer
        });
      });

      // Pause hover'iui (desktop'e)
      gallery.addEventListener("mouseenter", stop);
      gallery.addEventListener("mouseleave", start);

      // Init — paleisti iš karto
      goTo(0);
      start();
    });
  };


  /* ---------- Catalog tabs ---------- */
  const setupCatalogTabs = () => {
    const tabs = document.querySelectorAll(".catalog-tab");
    const panels = document.querySelectorAll(".catalog-panel");
    if (tabs.length === 0) return;

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.target;
        if (!target) return;

        tabs.forEach(t => t.classList.toggle("is-active", t === tab));
        panels.forEach(p => p.classList.toggle("is-active", p.dataset.panel === target));
      });
    });
  };


  /* ---------- Partners marquee — constant speed across viewports ---------- */
  const setupPartnersMarquee = () => {
    const track = document.querySelector(".partners-track");
    if (!track) return;

    const mobileMq = window.matchMedia("(max-width: 768px)");

    const updateDuration = () => {
      if (!mobileMq.matches) {
        track.style.removeProperty("--marquee-duration");
        return;
      }
      const trackWidth = track.scrollWidth / 2;
      const duration = trackWidth / 60;
      track.style.setProperty("--marquee-duration", `${duration}s`);
    };

    updateDuration();
    mobileMq.addEventListener("change", updateDuration);
    window.addEventListener("load", updateDuration);
    window.addEventListener("resize", updateDuration);
  };


  /* ---------- Init ---------- */
  const init = () => {
    setupMobileMenu();
    setupNavbar();
    setupReveals();
    setupProcessLine();
    setupFaq();
    setupFenceCarousel();
    setupProductGallery();
    setupCatalogTabs();
    setupPartnersMarquee();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
