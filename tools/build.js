/* ==========================================================================
   build.js — renders the repetitive pages from tools/content.js
   --------------------------------------------------------------------------
   Run:  node tools/build.js

   Generates (overwrites) :
     uygulamalar/SLUG/index.html      app detail pages
     gizlilik/SLUG/index.html         per-app privacy policies
     gizlilik/index.html              privacy index
     404.html
     sitemap.xml
     robots.txt

   Screenshots come from tools/media.json, produced by tools/prepare-images.js.
   index.html is hand-authored and is NOT touched by this script.
   ========================================================================== */

const fs = require("fs");
const path = require("path");
const { site, apps } = require("./content");

const ROOT = path.join(__dirname, "..");

let MEDIA = {};
try {
  MEDIA = JSON.parse(fs.readFileSync(path.join(__dirname, "media.json"), "utf8"));
} catch (e) {
  console.warn("! tools/media.json not found — run node tools/prepare-images.js first.");
}

/* ---------- helpers ---------- */

/** Escape text that goes into an element body. */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Escape text that goes inside a double-quoted attribute. */
const escA = (s) => esc(s).replace(/"/g, "&quot;");

/** `data-en="…"` for a [tr, en] pair. */
const EN = (pair) => `data-en="${escA(pair[1])}"`;

/** `data-en-<attr>="…"` for a [tr, en] pair. */
const ENA = (attr, pair) => `data-en-${attr}="${escA(pair[1])}"`;

/** Turkish body text of a pair. */
const TR = (pair) => esc(pair[0]);

const media = (slug) => (MEDIA[slug] && MEDIA[slug].media) || [];
const appIcon = (slug) => (MEDIA[slug] && MEDIA[slug].icon) || null;

const write = (rel, html) => {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html.trimStart() + "\n", "utf8");
  console.log("  ✓ " + rel.replace(/\\/g, "/"));
};

/* ---------- icons ---------- */

const ARROW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
const ARROW_BACK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>`;

const APPLE_LOGO = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.05 12.04c-.03-2.9 2.37-4.3 2.48-4.36-1.35-1.98-3.46-2.25-4.21-2.28-1.79-.18-3.5 1.05-4.41 1.05-.91 0-2.31-1.03-3.8-1-1.96.03-3.77 1.14-4.78 2.89-2.04 3.54-.52 8.78 1.46 11.65.97 1.4 2.12 2.98 3.63 2.92 1.46-.06 2.01-.94 3.77-.94 1.76 0 2.26.94 3.8.91 1.57-.03 2.56-1.43 3.52-2.84 1.11-1.63 1.56-3.21 1.59-3.29-.03-.02-3.05-1.17-3.05-4.71zM14.2 3.9c.8-.97 1.34-2.32 1.19-3.66-1.15.05-2.55.77-3.38 1.73-.74.86-1.39 2.23-1.21 3.55 1.29.1 2.6-.65 3.4-1.62z"/></svg>`;

const PLAY_LOGO = `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#00A0FF" d="M3.6 2.3c-.31.33-.49.83-.49 1.48v16.44c0 .65.18 1.15.49 1.48l.06.05 9.2-9.2v-.11L3.66 2.24l-.06.06z"/>
      <path fill="#FFBC00" d="M16.43 15.62l-3.07-3.07v-.11l3.07-3.07.07.04 3.63 2.07c1.04.59 1.04 1.55 0 2.14l-3.63 2.06-.07.04z"/>
      <path fill="#FF3A44" d="M16.5 15.58l-3.14-3.14-9.76 9.79c.34.36.9.4 1.54.04l11.36-6.69z"/>
      <path fill="#00C853" d="M16.5 8.86L5.14 2.17c-.64-.37-1.2-.32-1.54.04l9.76 9.76 3.14-3.11z"/>
    </svg>`;

/* ---------- shared partials ---------- */

function head({ title, desc, canonical, css, bodyApp }) {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title[0])}</title>
<meta name="description" ${ENA("content", desc)} content="${escA(desc[0])}">
<meta name="author" content="${escA(site.author)}">
<meta name="theme-color" content="#06060c">
<link rel="canonical" href="${site.origin}${canonical}">

<meta property="og:type" content="website">
<meta property="og:url" content="${site.origin}${canonical}">
<meta property="og:site_name" content="${escA(site.author)}">
<meta property="og:title" ${ENA("content", title)} content="${escA(title[0])}">
<meta property="og:description" ${ENA("content", desc)} content="${escA(desc[0])}">
<meta property="og:image" content="${site.origin}/assets/img/og/og-cover.png">
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/icons/apple-touch-icon.png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

<link rel="stylesheet" href="/assets/css/base.css">
<link rel="stylesheet" href="/assets/css/components.css">
${css.map((c) => `<link rel="stylesheet" href="/assets/css/${c}">`).join("\n")}
<noscript><style>[data-reveal]{opacity:1!important;transform:none!important}</style></noscript>
</head>

<body${bodyApp ? ` data-app="${bodyApp}"` : ""}>
<a class="skip" href="#main" data-en="Skip to content">İçeriğe atla</a>`;
}

function nav() {
  return `
<header class="nav">
  <div class="nav__inner">
    <a class="brand" href="/">
      <span class="brand__mark">OK</span>
      <span>Onur Koçak</span>
    </a>

    <nav class="nav__links" id="nav-links" aria-label="Ana menü" data-en-aria-label="Main menu">
      <a href="/#uygulamalar" data-en="Apps">Uygulamalar</a>
      <a href="/#hakkimda" data-en="About">Hakkımda</a>
      <a href="/#iletisim" data-en="Contact">İletişim</a>
    </nav>

    <div class="nav__actions">
      <div class="lang" role="group" aria-label="Dil seçimi" data-en-aria-label="Language">
        <span class="lang__thumb" aria-hidden="true"></span>
        <button type="button" data-lang-btn="tr" aria-pressed="true">TR</button>
        <button type="button" data-lang-btn="en" aria-pressed="false">EN</button>
      </div>
      <button class="nav__burger" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Menü" data-en-aria-label="Menu"><i></i></button>
    </div>
  </div>
</header>`;
}

function footer() {
  const links = apps.map((a) => `          <li><a href="/uygulamalar/${a.slug}/">${esc(a.name)}</a></li>`).join("\n");
  return `
<footer class="footer">
  <div class="shell">
    <div class="footer__grid">
      <div class="footer__brand">
        <a class="brand" href="/"><span class="brand__mark">OK</span><span>Onur Koçak</span></a>
        <p class="footer__blurb" data-en="Mobile apps and games, built end to end by one person.">
          Uçtan uca tek kişi tarafından geliştirilen mobil uygulamalar ve oyunlar.
        </p>
      </div>

      <div>
        <h4 data-en="Apps">Uygulamalar</h4>
        <ul class="footer__list">
${links}
        </ul>
      </div>

      <div>
        <h4 data-en="Links">Bağlantılar</h4>
        <ul class="footer__list">
          <li><a href="/#hakkimda" data-en="About">Hakkımda</a></li>
          <li><a href="/#iletisim" data-en="Contact">İletişim</a></li>
          <li><a href="${site.github}" target="_blank" rel="noopener">GitHub</a></li>
          <li><a href="/gizlilik/" data-en="Privacy policies">Gizlilik politikaları</a></li>
        </ul>
      </div>
    </div>

    <div class="footer__bottom">
      <span>© <span data-year>2026</span> Onur Koçak</span>
      <span data-en="Built in Turkey">Türkiye'de yapıldı</span>
    </div>
  </div>
</footer>

<script src="/assets/js/i18n.js" defer></script>
<script src="/assets/js/main.js" defer></script>
</body>
</html>`;
}

/* ---------- pieces ---------- */

/** Only the stores an app is actually on get a badge. */
function stores(app, indent) {
  const pad = " ".repeat(indent);
  const out = [];

  if (app.stores.ios) {
    out.push(`${pad}  <a class="store" href="${app.stores.ios}" target="_blank" rel="noopener">
${pad}    ${APPLE_LOGO}
${pad}    <span class="store__text"><small data-en="Download on the">İndir</small><strong>App Store</strong></span>
${pad}  </a>`);
  }
  if (app.stores.android) {
    out.push(`${pad}  <a class="store" href="${app.stores.android}" target="_blank" rel="noopener">
${pad}    ${PLAY_LOGO}
${pad}    <span class="store__text"><small data-en="Get it on">İndir</small><strong>Google Play</strong></span>
${pad}  </a>`);
  }

  return `${pad}<div class="stores">\n${out.join("\n")}\n${pad}</div>`;
}

/** One screenshot. `eager` skips lazy-loading for the first, above-the-fold shot. */
function shot(m, { cls = "", eager = false } = {}) {
  const classes = ["shot", m.kind === "wide" ? "shot--wide" : "shot--tall", cls].filter(Boolean).join(" ");
  return `<div class="${classes}">
            <img src="${m.src}" width="${m.width}" height="${m.height}"
                 alt="${escA(m.alt[0])}" ${ENA("alt", m.alt)}
                 ${eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}>
          </div>`;
}

/** The app icon: real artwork when there is one, the emoji mark otherwise. */
function iconMark(app, cls) {
  const src = appIcon(app.slug);
  return src
    ? `<div class="${cls}"><img src="${src}" width="256" height="256" alt="${escA(app.name)} uygulama simgesi" ${ENA("alt", [app.name + " uygulama simgesi", app.name + " app icon"])}></div>`
    : `<div class="${cls}" aria-hidden="true">${app.icon}</div>`;
}

/* ---------- app detail page ---------- */

function appPage(app, next) {
  const full = app.fullName || [app.name, app.name];
  const title = [`${full[0]} — ${app.tagline[0]}`, `${full[1]} — ${app.tagline[1]}`];
  const shots = media(app.slug);
  const isWide = shots.length && shots[0].kind === "wide";

  const features = app.features.map((f) => `        <article class="feature" data-reveal>
          <div class="feature__icon" aria-hidden="true">${f.icon}</div>
          <h3 ${EN(f.title)}>${TR(f.title)}</h3>
          <p ${EN(f.text)}>${TR(f.text)}</p>
        </article>`).join("\n");

  const steps = app.steps.map((s) => `        <article class="step" data-reveal>
          <h3 ${EN(s.title)}>${TR(s.title)}</h3>
          <p ${EN(s.text)}>${TR(s.text)}</p>
        </article>`).join("\n");

  const specs = app.specs.map((s) => `        <div class="spec">
          <dt ${EN(s.label)}>${TR(s.label)}</dt>
          <dd ${EN(s.value)}>${TR(s.value)}</dd>
        </div>`).join("\n");

  const chips = app.chips.map((c) => `            <span class="chip" ${EN(c)}>${TR(c)}</span>`).join("\n");

  /* Hero stage: two overlapping portraits, or a single landscape capture. */
  const stage = isWide
    ? `          ${shot(shots[0], { eager: true })}`
    : `          ${shots[1] ? shot(shots[1], { cls: "shot--float" }) : ""}
          ${shots[0] ? shot(shots[0], { cls: "shot--float", eager: true }) : ""}`;

  return `${head({ title, desc: app.lede, canonical: `/uygulamalar/${app.slug}/`, css: ["app.css"], bodyApp: app.slug })}
${nav()}

<main id="main">

  <section class="app-hero">
    <div class="shell">
      <a class="back" href="/#uygulamalar">${ARROW_BACK}<span data-en="All apps">Tüm uygulamalar</span></a>

      <div class="app-hero__grid">
        <div class="app-hero__text">
          <div class="app-id" data-reveal>
            ${iconMark(app, "app-id__icon")}
            <div>
              <div class="app-id__meta" ${EN(app.kicker)}>${TR(app.kicker)}</div>
              <div class="app-id__name">${esc(full[0])}</div>
            </div>
          </div>

          <h1 data-reveal style="--d:80ms" ${EN(app.tagline)}>${TR(app.tagline)}</h1>

          <p class="lede" data-reveal style="--d:150ms" ${EN(app.lede)}>${TR(app.lede)}</p>

          <div class="app-hero__chips" data-reveal style="--d:210ms">
${chips}
          </div>

          <div data-reveal style="--d:270ms">
${stores(app, 12)}
          </div>
        </div>

        <div class="app-hero__stage${isWide ? " app-hero__stage--wide" : ""}">
${stage}
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="ozellikler">
    <div class="shell">
      <div class="section-head" data-reveal>
        <span class="eyebrow" data-en="Features">Öne çıkanlar</span>
        <h2 class="h2" data-en="What it does">Neler yapıyor</h2>
      </div>
      <div class="features" data-stagger="70">
${features}
      </div>
    </div>
  </section>

  <section class="section" id="ekranlar">
    <div class="shell">
      <div class="section-head" data-reveal>
        <span class="eyebrow" data-en="Screens">Ekranlar</span>
        <h2 class="h2" data-en="A look inside">İçeriden bir bakış</h2>
      </div>
      <div class="gallery">
${shots.map((m) => "        " + shot(m)).join("\n")}
      </div>
      <p class="gallery-hint" data-en="Drag or scroll sideways →">Yana kaydır →</p>
    </div>
  </section>

  <section class="section" id="nasil">
    <div class="shell split">
      <div data-reveal>
        <span class="eyebrow" data-en="How it works">Nasıl çalışıyor</span>
        <h2 class="h2" data-en="Four steps, start to finish">Baştan sona dört adım</h2>
        <p class="lede" data-en="No long setup: within a minute you are either playing or your plan is ready.">
          Uzun bir kurulum yok; bir dakika içinde ya oyundasın ya da planın hazır.
        </p>
      </div>
      <div class="steps" data-stagger="80">
${steps}
      </div>
    </div>
  </section>

  <section class="section" id="kunye">
    <div class="shell">
      <div class="section-head" data-reveal>
        <span class="eyebrow" data-en="Details">Künye</span>
        <h2 class="h2" data-en="At a glance">Bir bakışta</h2>
      </div>
      <dl class="specs" data-reveal>
${specs}
      </dl>

      <div class="kunye__foot" data-reveal>
${stores(app, 8)}
        <p class="kunye__legal" data-en-html="Read the <a href='/gizlilik/${app.slug}/'>privacy policy</a> for this app.">
          Bu uygulamanın <a href="/gizlilik/${app.slug}/">gizlilik politikası</a>.
        </p>
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="shell">
      <a class="next-app" href="/uygulamalar/${next.slug}/" data-app="${next.slug}" data-reveal>
        <div>
          <small data-en="Next project">Sıradaki proje</small>
          <strong>${esc(next.name)}</strong>
        </div>
        <span class="btn btn--primary"><span data-en="Explore">İncele</span> ${ARROW}</span>
      </a>
    </div>
  </section>

</main>
${footer()}`;
}

/* ---------- privacy page ---------- */

function privacyPage(app) {
  const title = [`${app.name} — Gizlilik Politikası`, `${app.name} — Privacy Policy`];
  const desc = [
    `${app.name} uygulamasının gizlilik politikası: hangi veriler toplanıyor, neden toplanıyor ve haklarınız neler.`,
    `Privacy policy for ${app.name}: what data is collected, why, and what your rights are.`,
  ];

  const li = (pairs) => pairs.map((p) => `          <li ${EN(p)}>${TR(p)}</li>`).join("\n");

  /* Sections are assembled per app, so an app without ads or purchases
     simply has no such section — and the numbering still runs 1..n. */
  const sections = [
    {
      title: ["Toplanan veriler", "Data we collect"],
      body: `        <p data-en="The app collects only what it needs in order to work:">Uygulama yalnızca çalışması için gereken verileri toplar:</p>
        <ul>
${li(app.privacy.collects)}
        </ul>`,
    },
    {
      title: ["Verilerin kullanım amacı", "How the data is used"],
      body: `        <ul>
          <li data-en="To provide the features of the app and keep them working correctly.">Uygulamanın özelliklerini sunmak ve doğru çalışmasını sağlamak.</li>
          <li data-en="To find and fix errors and crashes.">Hataları ve çökmeleri tespit edip gidermek.</li>
          <li data-en="To understand which features are used, so the app can be improved.">Hangi özelliklerin kullanıldığını anlayarak uygulamayı geliştirmek.</li>
        </ul>
        <p data-en-html="Your personal data is <strong>never sold</strong>.${app.hasAds ? " How your advertising identifier is used to show ads is described in the Advertising section below." : " It is not shared with third parties for advertising purposes."}"><strong>Kişisel verileriniz satılmaz.</strong>${app.hasAds ? " Reklam gösterimi için reklam kimliğinizin nasıl kullanıldığını aşağıdaki Reklamlar bölümünde bulabilirsiniz." : " Reklam amacıyla üçüncü taraflarla paylaşılmaz."}</p>`,
    },
    {
      title: ["Üçüncü taraf servisler", "Third-party services"],
      body: `        <p data-en="The app uses the following third-party services, each of which has its own privacy policy:">Uygulama, her biri kendi gizlilik politikasına sahip aşağıdaki üçüncü taraf servisleri kullanır:</p>
        <ul>
${li(app.privacy.thirdParty)}
        </ul>`,
    },
  ];

  if (app.ai) {
    sections.push({
      title: ["Yapay zekâ ile üretilen içerik", "AI-generated content"],
      body: `        <p ${EN(app.ai)}>${TR(app.ai)}</p>
        <p data-en-html="Google processes that content under <a href='https://policies.google.com/privacy' target='_blank' rel='noopener'>Google's own privacy policy</a>. Send only what you are comfortable sharing, and avoid entering other people's personal details.">
          Bu içerik Google tarafından <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google'ın kendi gizlilik politikası</a> kapsamında işlenir. Yalnızca paylaşmakta rahat olduğun bilgileri gönder ve başkalarının kişisel bilgilerini girmemeye özen göster.
        </p>
        <p data-en="Answers are produced by a language model. They can be wrong or incomplete, and are not a substitute for professional advice.">
          Yanıtlar bir dil modeli tarafından üretilir; yanlış veya eksik olabilir ve profesyonel tavsiye yerine geçmez.
        </p>`,
    });
  }

  if (app.hasAds) {
    sections.push({
      title: ["Reklamlar ve reklam kimliği", "Advertising and your ad identifier"],
      body: `        <p data-en="Ads in the app are served through Google AdMob. To choose which ads to show, AdMob may use your device's advertising identifier (Android Advertising ID or Apple IDFA) along with technical information such as device type and approximate location. That data is processed by Google, not by us — see Google's own policy for the details.">
          Uygulamadaki reklamlar Google AdMob aracılığıyla gösterilir. AdMob, hangi reklamların gösterileceğini belirlemek için cihazının reklam kimliğini (Android Reklam Kimliği veya Apple IDFA) ve cihaz türü, yaklaşık konum gibi teknik bilgileri kullanabilir. Bu veriler bizim tarafımızdan değil, doğrudan Google tarafından işlenir; ayrıntılar Google'ın kendi politikasındadır.
        </p>
        <p data-en-html="You can turn personalised ads off at any time: on Android under <strong>Settings → Google → Ads</strong>, on iOS under <strong>Settings → Privacy &amp; Security → Tracking</strong>. Read <a href='https://policies.google.com/technologies/ads' target='_blank' rel='noopener'>how Google uses advertising data</a>.">
          Kişiselleştirilmiş reklamları istediğin zaman kapatabilirsin: Android'de <strong>Ayarlar → Google → Reklamlar</strong>, iOS'ta <strong>Ayarlar → Gizlilik ve Güvenlik → İzleme</strong>. Ayrıntılar için <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">Google'ın reklam verilerini nasıl kullandığını</a> okuyabilirsin.
        </p>`,
    });
  }

  if (app.hasPurchases) {
    sections.push({
      title: ["Uygulama içi satın almalar", "In-app purchases"],
      body: `        <p data-en-html="Purchases and subscriptions are managed through RevenueCat. <strong>Your payment details never reach us</strong> — payments are handled entirely by Google Play or the App Store. RevenueCat stores only an anonymous user identifier and your purchase records, so the app knows what you own.">
          Satın almalar ve abonelikler RevenueCat üzerinden yönetilir. <strong>Ödeme bilgilerin bize hiçbir zaman ulaşmaz</strong>; ödemeler tümüyle Google Play veya App Store tarafından işlenir. RevenueCat yalnızca anonim bir kullanıcı kimliği ve satın alma kayıtlarını saklar, böylece uygulama neye sahip olduğunu bilir.
        </p>`,
    });
  }

  sections.push(
    {
      title: ["Veri saklama ve güvenlik", "Retention and security"],
      body: `        <p data-en="Data is kept only for as long as the feature it belongs to requires it, and is protected with industry-standard measures such as encrypted transport. No method of transmission over the internet is ever completely secure, so absolute security cannot be guaranteed.">
          Veriler, ait oldukları özellik için gerekli olduğu sürece saklanır ve şifreli iletim gibi sektör standardı önlemlerle korunur. İnternet üzerinden hiçbir veri aktarımı tümüyle güvenli olmadığından mutlak güvenlik garanti edilemez.
        </p>`,
    },
    {
      title: ["Çocukların gizliliği", "Children's privacy"],
      body: `        <p data-en="The app is not directed at children under 13 and does not knowingly collect data from them. If you believe a child has provided data through the app, contact us and it will be deleted.">
          Uygulama 13 yaş altındaki çocuklara yönelik değildir ve bilerek onlardan veri toplamaz. Bir çocuğun uygulama üzerinden veri paylaştığını düşünüyorsanız bize ulaşın; ilgili veriler silinecektir.
        </p>`,
    },
    {
      title: ["Haklarınız", "Your rights"],
      body: `        <p data-en="Under KVKK (Turkey) and GDPR (EU) you have the right to:">KVKK ve GDPR kapsamında şu haklara sahipsiniz:</p>
        <ul>
          <li data-en="Learn whether your personal data is being processed, and request a copy of it.">Kişisel verilerinizin işlenip işlenmediğini öğrenmek ve bir kopyasını talep etmek.</li>
          <li data-en="Ask for incorrect or incomplete data to be corrected.">Eksik veya yanlış işlenmiş verilerin düzeltilmesini istemek.</li>
          <li data-en="Ask for your data to be deleted.">Verilerinizin silinmesini talep etmek.</li>
          <li data-en="Object to the processing of your data.">Verilerinizin işlenmesine itiraz etmek.</li>
        </ul>
        <p data-en-html="To exercise any of these rights, write to <a href='mailto:${site.email}'>${site.email}</a>.">
          Bu haklarınızı kullanmak için <a href="mailto:${site.email}">${site.email}</a> adresine yazabilirsiniz.
        </p>`,
    },
    {
      title: ["Değişiklikler", "Changes to this policy"],
      body: `        <p data-en="This policy may be updated as the app changes. The date at the top of the page always shows the current version.">
          Bu politika, uygulama geliştikçe güncellenebilir. Sayfanın başındaki tarih her zaman geçerli sürümü gösterir.
        </p>`,
    },
    {
      title: ["İletişim", "Contact"],
      body: `        <p data-en-html="Questions about this policy? Write to <a href='mailto:${site.email}'>${site.email}</a>.">
          Bu politikayla ilgili sorularınız için <a href="mailto:${site.email}">${site.email}</a> adresine yazabilirsiniz.
        </p>`,
    }
  );

  const toc = sections.map((s, i) =>
    `            <li><a href="#b${i + 1}" ${EN(s.title)}>${TR(s.title)}</a></li>`).join("\n");

  const body = sections.map((s, i) =>
    `        <h2 id="b${i + 1}" ${EN([`${i + 1}. ${s.title[0]}`, `${i + 1}. ${s.title[1]}`])}>${i + 1}. ${esc(s.title[0])}</h2>
${s.body}`).join("\n\n");

  const note = app.privacy.note
    ? `        <p class="legal__note" ${EN(app.privacy.note)}><strong>${TR(app.privacy.note)}</strong></p>`
    : "";

  return `${head({ title, desc, canonical: `/gizlilik/${app.slug}/`, css: ["app.css"], bodyApp: app.slug })}
${nav()}

<main id="main" class="legal">
  <div class="shell">
    <div class="legal__inner">
      <a class="back" href="/uygulamalar/${app.slug}/">${ARROW_BACK}<span data-en="Back to ${escA(app.name)}">${esc(app.name)} sayfasına dön</span></a>

      <span class="eyebrow" data-en="Privacy Policy">Gizlilik Politikası</span>
      <h1 class="h2">${esc(app.name)}</h1>
      <p class="legal__updated" data-en="Last updated: ${escA(site.legalUpdated[1])}">Son güncelleme: ${esc(site.legalUpdated[0])}</p>

      <div class="legal__toc">
        <h4 data-en="Contents">İçindekiler</h4>
        <ol>
${toc}
        </ol>
      </div>

      <div class="legal__body">
        <p data-en="This policy explains what data the ${escA(app.name)} mobile app collects, why it is collected and how it is handled. By using the app you agree to this policy.">
          Bu politika, ${esc(app.name)} mobil uygulamasının hangi verileri topladığını, bunları neden topladığını ve nasıl işlediğini açıklar. Uygulamayı kullanarak bu politikayı kabul etmiş olursunuz.
        </p>
${note}

${body}
      </div>
    </div>
  </div>
</main>
${footer()}`;
}

/* ---------- privacy index ---------- */

function privacyIndex() {
  const cards = apps.map((a) => `        <a class="policy-card" data-app="${a.slug}" href="/gizlilik/${a.slug}/" data-reveal>
          ${iconMark(a, "policy-card__icon")}
          <div>
            <small data-en="Privacy policy">Gizlilik politikası</small>
            <strong>${esc(a.name)}</strong>
          </div>
          ${ARROW}
        </a>`).join("\n");

  return `${head({
    title: ["Gizlilik Politikaları — Onur Koçak", "Privacy Policies — Onur Koçak"],
    desc: ["Onur Koçak tarafından geliştirilen uygulamaların gizlilik politikaları.",
           "Privacy policies for the apps developed by Onur Koçak."],
    canonical: "/gizlilik/",
    css: ["home.css", "app.css"],
    bodyApp: null,
  })}
${nav()}

<main id="main" class="section section--top">
  <div class="shell">
    <div class="section-head" data-reveal>
      <span class="eyebrow" data-en="Legal">Yasal</span>
      <h1 class="h2" data-en="Privacy policies">Gizlilik politikaları</h1>
      <p class="lede" data-en="Each app has its own policy, covering what it collects and why.">
        Her uygulamanın hangi verileri neden topladığını anlatan kendi politikası var.
      </p>
    </div>

    <div class="policy-list" data-stagger="80">
${cards}
    </div>
  </div>
</main>
${footer()}`;
}

/* ---------- 404 ---------- */

function notFound() {
  return `${head({
    title: ["Sayfa bulunamadı — Onur Koçak", "Page not found — Onur Koçak"],
    desc: ["Aradığın sayfa burada değil.", "The page you're looking for isn't here."],
    canonical: "/404.html",
    css: ["home.css", "app.css"],
    bodyApp: null,
  })}
${nav()}

<main id="main" class="notfound">
  <div class="shell">
    <div class="notfound__code">404</div>
    <h1 class="h2" style="margin-top:1.5rem" data-en="This page took a wrong turn.">Bu sayfa yolunu şaşırmış.</h1>
    <p class="lede" style="margin-inline:auto;max-width:44ch" data-en="The link may be old, or the page may have moved. Let's get you back.">
      Bağlantı eski olabilir ya da sayfa taşınmış olabilir. Seni geri götürelim.
    </p>
    <div class="contact__actions" style="margin-top:2rem">
      <a class="btn btn--primary" href="/" data-en="Back home">Ana sayfaya dön</a>
      <a class="btn btn--ghost" href="/#uygulamalar" data-en="See the apps">Uygulamalar</a>
    </div>
  </div>
</main>
${footer()}`;
}

/* ---------- sitemap + robots ---------- */

function sitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = ["/"]
    .concat(apps.map((a) => `/uygulamalar/${a.slug}/`))
    .concat(["/gizlilik/"])
    .concat(apps.map((a) => `/gizlilik/${a.slug}/`));

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${site.origin}${u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u === "/" ? "1.0" : u.startsWith("/uygulamalar") ? "0.8" : "0.4"}</priority>
  </url>`).join("\n")}
</urlset>`;
}

function robots() {
  return `User-agent: *
Allow: /
Disallow: /görseller/

Sitemap: ${site.origin}/sitemap.xml`;
}

/* ---------- run ---------- */

console.log("Building pages…");

apps.forEach((app, i) => {
  const next = apps[(i + 1) % apps.length];
  write(`uygulamalar/${app.slug}/index.html`, appPage(app, next));
  write(`gizlilik/${app.slug}/index.html`, privacyPage(app));
});

write("gizlilik/index.html", privacyIndex());
write("404.html", notFound());
write("sitemap.xml", sitemap());
write("robots.txt", robots());

console.log("Done — " + (apps.length * 2 + 4) + " files written.");
