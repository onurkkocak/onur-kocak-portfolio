/* ==========================================================================
   check-i18n.js — switch every page to English and look for leftovers.
   --------------------------------------------------------------------------
   Start the server first:  node tools/serve.js
   Then:                    node tools/check-i18n.js

   Flags visible text that still reads as Turkish after switching to EN,
   plus any element whose markup was lost by a textContent swap.
   ========================================================================== */

const fs = require("fs");
const puppeteer = require("puppeteer-core");

const BASE = process.env.BASE || "http://localhost:4321";
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
].find((p) => fs.existsSync(p));

const PAGES = [
  "/",
  "/uygulamalar/viberoute/",
  "/uygulamalar/firuzan-abla/",
  "/uygulamalar/gecis-oyunu/",
  "/uygulamalar/canak-tavla/",
  "/gizlilik/",
  "/gizlilik/viberoute/",
  "/gizlilik/firuzan-abla/",
  "/gizlilik/gecis-oyunu/",
  "/gizlilik/canak-tavla/",
  "/404.html",
];

/* Proper nouns and brand names that stay Turkish in both languages. */
const ALLOW = [
  "Onur Koçak", "Firuzan Abla", "Geçiş Oyunu", "Çanak Tavla", "VibeRoute",
  "Süper Lig", "Türkiye", "KVKK", "Google Play", "App Store", "GitHub",
  "Ben Kimim", "Kahve", "Tarot", "Sinastri", "Boğa",
];

function scan() {
  /* Turkish-only letters are the cheapest reliable signal. */
  const turkish = /[ıİşŞğĞçÇöÖüÜ]/;
  const hits = [];

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const text = node.nodeValue.trim();
    if (!text || text.length < 3) continue;

    const el = node.parentElement;
    if (!el || el.closest("script, style, noscript")) continue;
    if (!el.offsetParent && el.tagName !== "BODY") continue;

    if (turkish.test(text)) hits.push({ text: text.slice(0, 70), tag: el.tagName.toLowerCase(), cls: (typeof el.className === "string" ? el.className : "").slice(0, 40) });
  }

  return { hits, svgCount: document.querySelectorAll("main svg, footer svg").length, htmlLang: document.documentElement.lang };
}

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });
  let problems = 0;

  for (const url of PAGES) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(BASE + url, { waitUntil: "networkidle0" });

    /* Count icons before switching: a textContent swap on an element that
       wraps an <svg> would silently delete it. */
    const before = await page.evaluate(() => document.querySelectorAll("main svg, footer svg").length);

    await page.click('[data-lang-btn="en"]');
    await new Promise((r) => setTimeout(r, 250));

    const res = await page.evaluate(scan);
    const leftovers = res.hits.filter((h) => !ALLOW.some((a) => h.text.includes(a)));

    console.log("\n\x1b[1m" + url + "\x1b[0m  (lang=" + res.htmlLang + ")");
    if (res.htmlLang !== "en") { problems++; console.log("  ✗ html lang değişmedi"); }
    if (res.svgCount < before) { problems++; console.log(`  ✗ ${before - res.svgCount} ikon dil değişiminde kayboldu`); }

    if (leftovers.length) {
      problems += leftovers.length;
      leftovers.slice(0, 8).forEach((h) => console.log(`  ✗ <${h.tag}${h.cls ? "." + h.cls.split(" ")[0] : ""}> "${h.text}"`));
      if (leftovers.length > 8) console.log(`  … ve ${leftovers.length - 8} tane daha`);
    } else if (res.htmlLang === "en" && res.svgCount >= before) {
      console.log("  \x1b[32m✓\x1b[0m tamamen İngilizce");
    }

    await page.close();
  }

  await browser.close();
  console.log(problems ? `\n${problems} sorun.` : "\nÇeviri eksiksiz.");
  process.exit(problems ? 1 : 0);
})();
