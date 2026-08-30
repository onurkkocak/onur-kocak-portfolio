/* ==========================================================================
   i18n.js — TR / EN language switch
   --------------------------------------------------------------------------
   Turkish is the source text written directly in the HTML. English lives
   beside it in data-attributes, so translations stay next to the markup
   they belong to and there is no dictionary to keep in sync:

     <h2 data-en="Apps">Uygulamalar</h2>
     <p data-en-html="Built with <b>Flutter</b>">Geliştirildi: <b>Flutter</b></p>
     <img data-en-alt="App screen" alt="Uygulama ekranı">
     <a data-en-href="/en/privacy/">/gizlilik/</a>
     <meta data-en-content="Portfolio" content="Portfolyo">

   Supported: data-en, data-en-html, and data-en-<attr> for any attribute.
   ========================================================================== */
(function () {
  "use strict";

  var STORE_KEY = "ok-lang";
  var ATTR_PREFIX = "data-en-";
  var root = document.documentElement;

  /* Read the saved choice; fall back to the browser language. */
  function initialLang() {
    var saved;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) { saved = null; }
    if (saved === "tr" || saved === "en") return saved;
    var nav = (navigator.language || "tr").toLowerCase();
    return nav.indexOf("tr") === 0 ? "tr" : "en";
  }

  /* Stash the Turkish original once, so switching back is lossless. */
  function memorize(el) {
    if (el.hasAttribute("data-en") && !el.hasAttribute("data-tr")) {
      el.setAttribute("data-tr", el.textContent);
    }
    if (el.hasAttribute("data-en-html") && !el.hasAttribute("data-tr-html")) {
      el.setAttribute("data-tr-html", el.innerHTML);
    }
    for (var i = 0; i < el.attributes.length; i++) {
      var name = el.attributes[i].name;
      if (name.indexOf(ATTR_PREFIX) !== 0) continue;
      var target = name.slice(ATTR_PREFIX.length);
      if (target === "html") continue;
      var backup = "data-tr-" + target;
      if (!el.hasAttribute(backup)) {
        el.setAttribute(backup, el.getAttribute(target) || "");
      }
    }
  }

  function applyTo(el, lang) {
    memorize(el);
    var en = lang === "en";

    if (el.hasAttribute("data-en-html")) {
      el.innerHTML = en ? el.getAttribute("data-en-html") : el.getAttribute("data-tr-html");
    } else if (el.hasAttribute("data-en")) {
      el.textContent = en ? el.getAttribute("data-en") : el.getAttribute("data-tr");
    }

    for (var i = 0; i < el.attributes.length; i++) {
      var name = el.attributes[i].name;
      if (name.indexOf(ATTR_PREFIX) !== 0) continue;
      var target = name.slice(ATTR_PREFIX.length);
      if (target === "html") continue;
      var value = en ? el.getAttribute(name) : el.getAttribute("data-tr-" + target);
      if (value !== null) el.setAttribute(target, value);
    }
  }

  function apply(lang) {
    var nodes = document.querySelectorAll("[data-en], [data-en-html], [data-en-content], [data-en-alt], [data-en-href], [data-en-aria-label], [data-en-title], [data-en-placeholder]");
    for (var i = 0; i < nodes.length; i++) applyTo(nodes[i], lang);

    root.setAttribute("lang", lang);
    root.setAttribute("data-lang", lang);

    var buttons = document.querySelectorAll("[data-lang-btn]");
    for (var j = 0; j < buttons.length; j++) {
      buttons[j].setAttribute("aria-pressed", String(buttons[j].getAttribute("data-lang-btn") === lang));
    }
    moveThumb();

    try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* private mode */ }
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  /* Slide the pill behind the active language button. */
  function moveThumb() {
    var groups = document.querySelectorAll(".lang");
    for (var i = 0; i < groups.length; i++) {
      var group = groups[i];
      var thumb = group.querySelector(".lang__thumb");
      var active = group.querySelector('[aria-pressed="true"]');
      if (!thumb || !active) continue;
      thumb.style.left = active.offsetLeft + "px";
      thumb.style.width = active.offsetWidth + "px";
    }
  }

  function bind() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest("[data-lang-btn]") : null;
      if (!btn) return;
      apply(btn.getAttribute("data-lang-btn"));
    });
    window.addEventListener("resize", moveThumb);
  }

  function start() {
    bind();
    apply(initialLang());
    /* Fonts land after first paint and change button widths. */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveThumb);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
