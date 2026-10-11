/* ==========================================================================
   Nestiique — main.js
   ========================================================================== */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Header: height + scroll state ---------- */
  const header = $("#siteHeader");

  function setHeaderHeight() {
    if (!header) return;
    document.documentElement.style.setProperty("--headerH", header.offsetHeight + "px");
  }

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }

  setHeaderHeight();
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", setHeaderHeight);

  /* ---------- Mobile menu ---------- */
  const navToggle = $("#navToggle");
  const mobileMenu = $("#mobileMenu");

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.hidden = true;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    header.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function openMenu() {
    mobileMenu.hidden = false;
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    header.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", () => {
      navToggle.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu();
    });
    $$("a", mobileMenu).forEach((a) => a.addEventListener("click", closeMenu));
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = [
    ".split__media", ".split__copy",
    ".menu__media", ".menu__copy",
    ".feature__media", ".feature__copy",
    ".location__col", ".explore__head",
    ".newsletter__inner", ".quote__inner",
  ];
  const revealEls = revealTargets.flatMap((s) => $$(s));
  revealEls.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Dish carousel ---------- */
  const slides = $$(".dish-carousel__slide");
  const dishIndexEl = $("#dishIndex");
  let dishIdx = 0;
  let dishTimer = null;

  function showDish(next) {
    if (!slides.length) return;
    dishIdx = (next + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("is-active", i === dishIdx));
    if (dishIndexEl) dishIndexEl.textContent = String(dishIdx + 1);
  }

  function startDishAutoplay() {
    if (slides.length < 2) return;
    stopDishAutoplay();
    dishTimer = window.setInterval(() => showDish(dishIdx + 1), 5200);
  }
  function stopDishAutoplay() {
    if (dishTimer) window.clearInterval(dishTimer);
    dishTimer = null;
  }

  const dishCarousel = $("#dishCarousel");
  if (dishCarousel) {
    $$(".carousel-arrow", dishCarousel.parentElement).forEach((btn) => {
      btn.addEventListener("click", () => {
        showDish(dishIdx + Number(btn.dataset.dir));
        startDishAutoplay();
      });
    });
    dishCarousel.addEventListener("mouseenter", stopDishAutoplay);
    dishCarousel.addEventListener("mouseleave", startDishAutoplay);
    startDishAutoplay();
  }

  /* ---------- Menu tabs ---------- */
  const tabs = $$(".menu-tab");
  const panels = $$(".menu-panel");

  function activateMenu(id) {
    tabs.forEach((t) => {
      const on = t.dataset.menu === id;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    panels.forEach((p) => {
      const on = p.id === "panel-" + id;
      p.classList.toggle("is-active", on);
      p.hidden = !on;
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateMenu(tab.dataset.menu));
    tab.addEventListener("keydown", (e) => {
      const i = tabs.indexOf(tab);
      if (e.key === "ArrowRight") { tabs[(i + 1) % tabs.length].focus(); tabs[(i + 1) % tabs.length].click(); }
      if (e.key === "ArrowLeft") { const j = (i - 1 + tabs.length) % tabs.length; tabs[j].focus(); tabs[j].click(); }
    });
  });

  /* ---------- Reservation modal ---------- */
  const modal = $("#reserveModal");
  let lastFocused = null;

  function openModal() {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    const first = $("input, select, textarea, button", modal);
    if (first) first.focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  $$(".js-reserve").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenu();
      openModal();
    });
  });

  if (modal) {
    $$("[data-close]", modal).forEach((el) => el.addEventListener("click", closeModal));
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });

    const reserveForm = $("#reserveForm");
    const reserveStatus = $("#reserveStatus");
    reserveForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = reserveForm.name.value.trim();
      const email = reserveForm.email.value.trim();
      const date = reserveForm.date.value;
      const time = reserveForm.time.value;
      if (!name || !email || !date || !time) {
        reserveStatus.textContent = "Please complete your name, email, date and time.";
        return;
      }
      reserveStatus.textContent = `Thank you, ${name}. We have your request for ${date} at ${time} and will confirm by email shortly.`;
      reserveForm.reset();
    });
  }

  /* ---------- Newsletter ---------- */
  const nlForm = $("#newsletterForm");
  const nlStatus = $("#newsletterStatus");
  if (nlForm) {
    nlForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("#email").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        nlStatus.textContent = "Please enter a valid email address.";
        return;
      }
      nlStatus.textContent = "Thank you — you are on the list. Watch your inbox for our next menu.";
      nlForm.reset();
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Smooth anchor offset for sticky header ---------- */
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 0) - 8;
      window.scrollTo({ top, behavior: "smooth" });
      history.replaceState(null, "", id);
    });
  });
})();
