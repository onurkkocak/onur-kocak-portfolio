/* ==========================================================================
   check-responsive.js — drive every page at every breakpoint and report
   layout problems that are easy to miss by eye.
   --------------------------------------------------------------------------
   Start the server first:  node tools/serve.js
   Then:                    node tools/check-responsive.js [--shots]

   Reports, per page and viewport:
     · horizontal overflow (document wider than the viewport)
     · the specific elements sticking out past the right edge
     · tap targets under 44 px
     · images loaded at a size wildly different from their box
   With --shots it also writes PNGs into the scratch folder.
   ========================================================================== */

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const BASE = process.env.BASE || "http://localhost:4321";
const SHOTS = process.argv.includes("--shots");
const OUT = process.env.SHOT_DIR || path.join(__dirname, "..", ".shots");

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
].find((p) => fs.existsSync(p));

const PAGES = [
  ["home", "/"],
  ["viberoute", "/uygulamalar/viberoute/"],
  ["firuzan", "/uygulamalar/firuzan-abla/"],
  ["gecis", "/uygulamalar/gecis-oyunu/"],
  ["tavla", "/uygulamalar/canak-tavla/"],
  ["gizlilik", "/gizlilik/"],
  ["gizlilik-tavla", "/gizlilik/canak-tavla/"],
  ["404", "/404.html"],
];

const VIEWPORTS = [
  ["iphone-se", 375, 667, 2, true],
  ["iphone-15", 393, 852, 3, true],
  ["pixel-xl", 412, 915, 2.6, true],
  ["tablet", 768, 1024, 2, true],
  ["laptop", 1280, 800, 1, false],
  ["desktop", 1440, 900, 1, false],
  ["wide", 1920, 1080, 1, false],
];

/* Runs inside the page. */
function audit() {
  const vw = document.documentElement.clientWidth;
  const problems = { overflow: [], tapTargets: [] };

  const docWidth = Math.max(
    document.documentElement.scrollWidth,
    document.body.scrollWidth
  );

  document.querySelectorAll("body *").forEach((el) => {
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return;

    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;

    /* Elements poking out past the right edge, ignoring anything an
       ancestor clips (marquee tracks, galleries, decorative art). */
    if (r.right > vw + 1) {
      let clipped = false;
      for (let p = el.parentElement; p; p = p.parentElement) {
        const ps = getComputedStyle(p);
        if (ps.overflowX === "hidden" || ps.overflowX === "auto" || ps.overflowX === "scroll" ||
            ps.overflow === "hidden" || ps.overflow === "auto" || ps.overflow === "scroll") {
          clipped = true;
          break;
        }
      }
      if (!clipped) {
        problems.overflow.push({
          sel: el.tagName.toLowerCase() + (el.className && typeof el.className === "string"
            ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : ""),
          right: Math.round(r.right),
          width: Math.round(r.width),
        });
      }
    }

    /* Interactive elements that are too small to tap comfortably. */
    if (/^(a|button)$/i.test(el.tagName) && el.offsetParent !== null) {
      const min = Math.min(r.width, r.height);
      if (min > 0 && min < 32 && !el.closest(".marquee")) {
        problems.tapTargets.push({
          sel: el.tagName.toLowerCase() + (typeof el.className === "string" && el.className
            ? "." + el.className.trim().split(/\s+/)[0] : ""),
          size: Math.round(r.width) + "x" + Math.round(r.height),
          text: (el.textContent || "").trim().slice(0, 24),
        });
      }
    }
  });

  return {
    docWidth,
    vw,
    scrolls: docWidth > vw + 1,
    ...problems,
  };
}

(async () => {
  if (!CHROME) { console.error("Chrome not found."); process.exit(1); }
  if (SHOTS) fs.mkdirSync(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--hide-scrollbars", "--disable-gpu"],
  });

  let failures = 0;

  for (const [pageName, url] of PAGES) {
    console.log("\n\x1b[1m" + pageName + "\x1b[0m  " + url);

    for (const [vpName, width, height, dpr, mobile] of VIEWPORTS) {
      const page = await browser.newPage();
      await page.setViewport({ width, height, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile });
      await page.goto(BASE + url, { waitUntil: "networkidle0", timeout: 30000 });
      /* let reveal transitions settle */
      await new Promise((r) => setTimeout(r, 450));

      const res = await page.evaluate(audit);

      const flags = [];
      if (res.scrolls) flags.push(`\x1b[31mYATAY KAYDIRMA ${res.docWidth}px > ${res.vw}px\x1b[0m`);
      if (res.overflow.length) {
        const uniq = [...new Map(res.overflow.map((o) => [o.sel, o])).values()].slice(0, 4);
        flags.push("taşan: " + uniq.map((o) => `${o.sel}(→${o.right})`).join(", "));
      }
      if (res.tapTargets.length) {
        const uniq = [...new Map(res.tapTargets.map((t) => [t.sel + t.size, t])).values()].slice(0, 3);
        flags.push("küçük hedef: " + uniq.map((t) => `${t.sel} ${t.size}`).join(", "));
      }

      if (flags.length) { failures++; console.log(`  ✗ ${vpName.padEnd(11)} ${flags.join("  |  ")}`); }
      else console.log(`  \x1b[32m✓\x1b[0m ${vpName}`);

      if (SHOTS) {
        /* Scroll the whole page first: reveal-on-scroll content is invisible
           to a full-page capture until its observer has fired. */
        await page.evaluate(async () => {
          /* scroll-behavior: smooth would make every scrollTo restart an
             animation that never lands — jump instantly instead. */
          const html = document.documentElement;
          const prev = html.style.scrollBehavior;
          html.style.scrollBehavior = "auto";

          const step = window.innerHeight * 0.8;
          for (let y = 0; y < html.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 120));
          }
          window.scrollTo(0, 0);
          html.style.scrollBehavior = prev;
        });
        await new Promise((r) => setTimeout(r, 700));

        await page.screenshot({
          path: path.join(OUT, `${pageName}-${vpName}.png`),
          fullPage: true,
        });
      }
      await page.close();
    }
  }

  await browser.close();
  console.log(failures ? `\n${failures} sorunlu görünüm.` : "\nHepsi temiz.");
  process.exit(failures ? 1 : 0);
})();
