/* ==========================================================================
   main.js — navigation, scroll reveal, card tilt, small niceties
   ========================================================================== */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky nav + mobile menu ---------- */
  function nav() {
    var el = document.querySelector(".nav");
    if (!el) return;

    var onScroll = function () {
      el.classList.toggle("is-stuck", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var burger = el.querySelector(".nav__burger");
    if (burger) {
      burger.addEventListener("click", function () {
        var open = el.classList.toggle("is-open");
        burger.setAttribute("aria-expanded", String(open));
      });
      /* Close after tapping a link on mobile. */
      el.querySelectorAll(".nav__links a").forEach(function (a) {
        a.addEventListener("click", function () {
          el.classList.remove("is-open");
          burger.setAttribute("aria-expanded", "false");
        });
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") el.classList.remove("is-open");
    });
  }

  /* ---------- Scroll reveal ---------- */
  function reveal() {
    var nodes = document.querySelectorAll("[data-reveal]");
    if (!nodes.length) return;

    if (reduced || !("IntersectionObserver" in window)) {
      nodes.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    nodes.forEach(function (n) { io.observe(n); });

    /* Stagger siblings that share a parent marked data-stagger. */
    document.querySelectorAll("[data-stagger]").forEach(function (group) {
      var step = parseInt(group.getAttribute("data-stagger"), 10) || 90;
      Array.prototype.forEach.call(group.children, function (child, i) {
        if (child.hasAttribute("data-reveal")) child.style.setProperty("--d", i * step + "ms");
      });
    });
  }

  /* ---------- Pointer tilt on app cards ---------- */
  function tilt() {
    if (reduced || window.matchMedia("(hover: none)").matches) return;

    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      var frame = null;

      card.addEventListener("pointermove", function (e) {
        if (frame) return;
        frame = requestAnimationFrame(function () {
          frame = null;
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform =
            "translateY(-6px) perspective(1100px) rotateX(" + (-py * 5).toFixed(2) +
            "deg) rotateY(" + (px * 6).toFixed(2) + "deg)";
        });
      });

      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---------- Count-up stats ---------- */
  function counters() {
    var nodes = document.querySelectorAll("[data-count]");
    if (!nodes.length) return;

    if (reduced || !("IntersectionObserver" in window)) {
      nodes.forEach(function (n) { n.textContent = n.getAttribute("data-count") + (n.getAttribute("data-suffix") || ""); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);

        var target = parseFloat(el.getAttribute("data-count")) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        var start = performance.now();
        var dur = 1100;

        (function tick(now) {
          var t = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: 0.5 });

    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---------- Highlight the section you are reading ---------- */
  function scrollSpy() {
    var links = document.querySelectorAll('.nav__links a[href^="#"]');
    if (!links.length || !("IntersectionObserver" in window)) return;

    var map = {};
    links.forEach(function (a) {
      var section = document.querySelector(a.getAttribute("href"));
      if (section) map[section.id] = a;
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (a) { a.removeAttribute("aria-current"); });
          link.setAttribute("aria-current", "page");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });

    /* Back at the top there is no active section — clear the highlight. */
    window.addEventListener("scroll", function () {
      if (window.scrollY < 120) {
        links.forEach(function (a) { a.removeAttribute("aria-current"); });
      }
    }, { passive: true });
  }

  /* ---------- Drag-to-scroll the screenshot gallery ---------- */
  function galleryDrag() {
    document.querySelectorAll(".gallery").forEach(function (rail) {
      var down = false, startX = 0, startLeft = 0;

      rail.addEventListener("pointerdown", function (e) {
        down = true;
        startX = e.clientX;
        startLeft = rail.scrollLeft;
        rail.style.cursor = "grabbing";
      });
      var stop = function () { down = false; rail.style.cursor = ""; };
      rail.addEventListener("pointerup", stop);
      rail.addEventListener("pointerleave", stop);
      rail.addEventListener("pointermove", function (e) {
        if (!down) return;
        rail.scrollLeft = startLeft - (e.clientX - startX);
      });
    });
  }

  /* ---------- Footer year ---------- */
  function year() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  function start() {
    nav();
    reveal();
    tilt();
    counters();
    scrollSpy();
    galleryDrag();
    year();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
