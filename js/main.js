/* ==========================================================================
   NESTIIQUE — main.js
   Intro video · nav · reveal · menu tabs · forms · portal · catalogue · cart
   ========================================================================== */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ======================================================================
     Intro video — plays once, then fades away and is fully detached.
     ====================================================================== */
  (function introVideo() {
    const intro = $("#intro");
    const video = $("#introVideo");
    if (!intro || !video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let gone = false;
    let safetyTimer = null;

    function armTimer() {
      if (safetyTimer) clearTimeout(safetyTimer);
      if (isFinite(video.duration) && video.duration > 0) {
        safetyTimer = setTimeout(dismiss, (video.duration + 1) * 1000);
      }
    }
    function dismiss() {
      if (gone) return;
      gone = true;
      if (safetyTimer) clearTimeout(safetyTimer);
      intro.classList.add("is-gone");
      try { video.pause(); } catch (e) {}
      window.setTimeout(function () { intro.hidden = true; }, 1300);
    }

    if (reduced.matches) { dismiss(); return; }

    video.addEventListener("ended", dismiss);
    video.addEventListener("error", dismiss);
    video.addEventListener("loadedmetadata", armTimer);
    armTimer();

    const skip = document.createElement("button");
    skip.type = "button";
    skip.className = "intro__skip";
    skip.textContent = "Skip intro";
    skip.addEventListener("click", dismiss);
    intro.appendChild(skip);

    const play = video.play();
    if (play && typeof play.catch === "function") play.catch(dismiss);

    reduced.addEventListener("change", function (e) { if (e.matches) dismiss(); });
  })();

  /* ======================================================================
     Header + mobile navigation
     ====================================================================== */
  (function chrome() {
    const header = $("#siteHeader");

    function setHeaderHeight() {
      if (header) {
        document.documentElement.style.setProperty("--headerH", header.offsetHeight + "px");
      }
    }
    function onScroll() {
      if (header) header.classList.toggle("is-scrolled", window.scrollY > 40);
    }
    setHeaderHeight();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", setHeaderHeight);

    const toggle = $("#navToggle");
    const menu = $("#mobileMenu");
    if (!toggle || !menu) return;

    function setMenu(open) {
      menu.hidden = !open;
      document.body.classList.toggle("is-locked", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    toggle.addEventListener("click", function () {
      setMenu(menu.hidden);
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) { setMenu(false); toggle.focus(); }
    });
  })();

  /* ======================================================================
     Scroll reveal
     ====================================================================== */
  (function reveal() {
    const items = $$(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* ======================================================================
     Menu tabs
     ====================================================================== */
  (function menuTabs() {
    const tabs = $$(".menu-tab");
    const panels = $$(".menu-panel");
    if (!tabs.length || !panels.length) return;

    function activate(id) {
      tabs.forEach(function (t) {
        const on = t.dataset.menu === id;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p) {
        const on = p.id === "panel-" + id;
        p.classList.toggle("is-active", on);
        p.hidden = !on;
      });
    }
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () { activate(tab.dataset.menu); });
      tab.addEventListener("keydown", function (e) {
        const i = tabs.indexOf(tab);
        let j = null;
        if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft")  j = (i - 1 + tabs.length) % tabs.length;
        if (j === null) return;
        e.preventDefault();
        tabs[j].focus();
        activate(tabs[j].dataset.menu);
      });
    });
    const hash = (window.location.hash || "").replace("#", "");
    const fromHash = hash && document.getElementById("panel-" + hash) ? hash : null;
    activate(fromHash || tabs[0].dataset.menu);

    window.addEventListener("hashchange", function () {
      const h = (window.location.hash || "").replace("#", "");
      if (h && document.getElementById("panel-" + h)) activate(h);
    });
  })();

  /* ======================================================================
     Reservation modal — injected once, opened by any .js-reserve control
     ====================================================================== */
  (function reservation() {
    const triggers = $$(".js-reserve");
    if (!triggers.length || $("#reserveDialog")) return;

    const dialog = document.createElement("dialog");
    dialog.id = "reserveDialog";
    dialog.className = "modal";
    dialog.innerHTML = [
      '<form method="dialog" class="modal__form" id="reserveForm" novalidate>',
      '  <button type="button" class="modal__close" data-modal-close aria-label="Close reservation form">&times;</button>',
      '  <span class="eyebrow">Reservations</span>',
      '  <h2 class="display display--md">Secure Your Table</h2>',
      '  <p class="body-text" style="margin-top:12px">Tell us when you are coming and we will hold a table.</p>',
      '  <div class="form-grid" style="margin-top:26px">',
      '    <div class="field"><label for="r-name">Full name</label><input id="r-name" name="name" required autocomplete="name" /></div>',
      '    <div class="field"><label for="r-phone">Phone</label><input id="r-phone" name="phone" required type="tel" autocomplete="tel" /></div>',
      '    <div class="field"><label for="r-date">Date</label><input id="r-date" name="date" required type="date" /></div>',
      '    <div class="field"><label for="r-time">Time</label><input id="r-time" name="time" required type="time" /></div>',
      '    <div class="field"><label for="r-guests">Guests</label>',
      '      <select id="r-guests" name="guests">',
      '        <option>1</option><option>2</option><option selected>3</option><option>4</option>',
      '        <option>5</option><option>6</option><option>7</option><option>8+</option>',
      '      </select></div>',
      '    <div class="field"><label for="r-area">Seating</label>',
      '      <select id="r-area" name="area"><option>Any available</option><option>Coffee House</option><option>Chicken House</option><option>Private Events</option></select></div>',
      '    <div class="field field--full"><label for="r-notes">Notes</label><textarea id="r-notes" name="notes" placeholder="Allergies, occasion, accessibility needs…"></textarea></div>',
      '  </div>',
      '  <div class="btn-row" style="margin-top:26px">',
      '    <button type="submit" class="btn btn--primary">Request Table</button>',
      '    <button type="button" class="btn btn--outline" data-modal-close>Cancel</button>',
      '  </div>',
      '  <p class="form-status" hidden role="status"></p>',
      '</form>'
    ].join("\n");
    document.body.appendChild(dialog);

    function open() { if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", ""); }
    function close() { if (typeof dialog.close === "function") dialog.close(); else dialog.removeAttribute("open"); }

    triggers.forEach(function (t) {
      t.addEventListener("click", function (e) { e.preventDefault(); open(); });
    });
    $$("[data-modal-close]", dialog).forEach(function (b) {
      b.addEventListener("click", close);
    });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) close(); });

    const form = $("#reserveForm", dialog);
    const status = $(".form-status", dialog);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const data = new FormData(form);
      status.textContent =
        "Thank you, " + data.get("name") + " — we have your request for " +
        data.get("guests") + " on " + data.get("date") + " at " + data.get("time") +
        ". The concierge will confirm by phone.";
      status.hidden = false;
      form.reset();
    });
  })();

  /* ======================================================================
     Generic forms — cake inquiry, catering, newsletter, contact
     Static site: no backend, so we confirm locally and say so.
     ====================================================================== */
  (function forms() {
    $$("form[data-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const status = $(".form-status", form);
        if (!status) return;
        status.textContent = form.dataset.success ||
          "Received. Our concierge will reply within one business day.";
        status.hidden = false;
        form.reset();
        $$(".file-drop__preview", form).forEach(function (p) { p.style.display = "none"; });
      });
    });
  })();

  /* ======================================================================
     Reference-image upload — local preview only, nothing is uploaded
     ====================================================================== */
  (function filePreview() {
    $$(".file-drop").forEach(function (drop) {
      const input = $("input[type=file]", drop);
      const preview = $(".file-drop__preview", drop);
      const name = $(".file-drop__name", drop);
      const label = $(".file-drop__label", drop);
      if (!input || !preview) return;

      ["dragenter", "dragover"].forEach(function (ev) {
        drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("is-over"); });
      });
      ["dragleave", "drop"].forEach(function (ev) {
        drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("is-over"); });
      });
      drop.addEventListener("drop", function (e) {
        if (e.dataTransfer && e.dataTransfer.files.length) handle(e.dataTransfer.files[0]);
      });
      drop.addEventListener("click", function (e) {
        if (e.target !== input) input.click();
      });
      input.addEventListener("change", function () { if (input.files.length) handle(input.files[0]); });

      function handle(file) {
        if (!file.type.startsWith("image/")) return;
        const kb = file.size / 1024;
        const size = kb < 1 ? "<1 KB" : kb < 10 ? kb.toFixed(1) + " KB" : Math.round(kb) + " KB";
        if (name) name.textContent = file.name + " — " + size + " (preview only)";
        let img = $("img", preview);
        if (!img) {
          img = document.createElement("img");
          img.alt = "Selected reference image preview";
          preview.appendChild(img);
        }
        img.src = URL.createObjectURL(file);
        preview.style.display = "block";
        if (label) label.textContent = "Replace reference image";
      }
    });
  })();

  /* ======================================================================
     Portal tabs (page 10)
     ====================================================================== */
  (function portalTabs() {
    const tabs = $$(".portal__tab");
    const panels = $$(".portal__panel");
    if (!tabs.length) return;

    function activate(id) {
      tabs.forEach(function (t) {
        const on = t.dataset.ptab === id;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
      });
      panels.forEach(function (p) {
        const on = p.id === "ppanel-" + id;
        p.classList.toggle("is-active", on);
        p.hidden = !on;
      });
    }
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () { activate(tab.dataset.ptab); });
    });
    activate(tabs[0].dataset.ptab);
  })();

  /* ======================================================================
     Catalogue filters + cart (page 8) — localStorage, no payments
     ====================================================================== */
  (function shop() {
    const catalog = $(".catalog");
    if (!catalog) return;

    /* ---- filters ---- */
    const filters = $$(".filter");
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filters.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        const want = btn.dataset.filter;
        $$(".product", catalog).forEach(function (card) {
          card.hidden = want !== "all" && card.dataset.category !== want;
        });
      });
    });

    /* ---- cart shell ---- */
    const dialog = document.createElement("dialog");
    dialog.id = "cartDialog";
    dialog.className = "cart";
    dialog.innerHTML = [
      '<div class="cart__head">',
      '  <h2 class="cart__title">Your Selection</h2>',
      '  <button type="button" class="cart__close" data-cart-close aria-label="Close cart">&times;</button>',
      '</div>',
      '<div class="cart__body"><ul class="cart__items"></ul></div>',
      '<div class="cart__foot">',
      '  <div class="cart__total"><span>Total</span><span data-cart-total>0 Br</span></div>',
      '  <a class="btn btn--primary btn--block" href="events.html#inquiry">Request Order</a>',
      '  <button type="button" class="btn btn--outline btn--block" style="margin-top:10px" data-cart-close>Continue Browsing</button>',
      '</div>'
    ].join("\n");

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "cart-toggle";
    toggle.innerHTML = 'Cart <span class="count" data-cart-count>0</span>';
    document.body.appendChild(toggle);
    document.body.appendChild(dialog);

    const itemsEl = $(".cart__items", dialog);
    const totalEl = $("[data-cart-total]", dialog);
    const countEl = $("[data-cart-count]", toggle);
    const KEY = "nestiique-cart-v1";

    let cart = [];
    try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { cart = []; }
    if (!Array.isArray(cart)) cart = [];

    function save() {
      try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {}
    }
    function total() { return cart.reduce(function (s, i) { return s + i.price * i.qty; }, 0); }
    function count() { return cart.reduce(function (s, i) { return s + i.qty; }, 0); }

    function render() {
      itemsEl.innerHTML = "";
      if (!cart.length) {
        const li = document.createElement("li");
        li.className = "cart__empty";
        li.style.border = "0";
        li.textContent = "Your selection is empty.";
        itemsEl.appendChild(li);
      } else {
        cart.forEach(function (item, idx) {
          const li = document.createElement("li");
          li.innerHTML =
            '<span class="cart__name"></span>' +
            '<span class="cart__price">' + item.price.toLocaleString("en-US") + " Br</span>" +
            '<span class="cart__qty">' +
              '<button type="button" data-dec aria-label="Decrease quantity">&minus;</button>' +
              '<span>' + item.qty + "</span>" +
              '<button type="button" data-inc aria-label="Increase quantity">+</button>' +
              '<button type="button" class="cart__remove" data-rm>Remove</button>' +
            "</span>";
          $(".cart__name", li).textContent = item.name;
          $("[data-dec]", li).addEventListener("click", function () { change(idx, -1); });
          $("[data-inc]", li).addEventListener("click", function () { change(idx, 1); });
          $("[data-rm]", li).addEventListener("click", function () { cart.splice(idx, 1); save(); render(); });
          itemsEl.appendChild(li);
        });
      }
      totalEl.textContent = total().toLocaleString("en-US") + " Br";
      countEl.textContent = String(count());
    }

    function change(idx, delta) {
      cart[idx].qty += delta;
      if (cart[idx].qty <= 0) cart.splice(idx, 1);
      save();
      render();
    }

    catalog.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-add]");
      if (!btn) return;
      const card = btn.closest(".product");
      const id = card.dataset.id;
      const existing = cart.findIndex(function (i) { return i.id === id; });
      if (existing > -1) cart[existing].qty += 1;
      else cart.push({ id: id, name: card.dataset.name, price: Number(card.dataset.price), qty: 1 });
      save();
      render();
      btn.textContent = "Added ✓";
      window.setTimeout(function () { btn.textContent = "Add to Cart"; }, 1400);
    });

    function openCart() { if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", ""); }
    function closeCart() { if (typeof dialog.close === "function") dialog.close(); else dialog.removeAttribute("open"); }

    toggle.addEventListener("click", openCart);
    $$("[data-cart-close]", dialog).forEach(function (b) { b.addEventListener("click", closeCart); });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) closeCart(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && dialog.open) closeCart();
    });

    render();
  })();
})();