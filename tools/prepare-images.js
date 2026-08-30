/* ==========================================================================
   prepare-images.js — optimise the sources in /görseller into web assets.
   --------------------------------------------------------------------------
   Run:  npm install --no-save sharp  &&  node tools/prepare-images.js

   Reads tools/images.js and writes:
     assets/img/apps/<slug>/<file>.webp   screenshots  (tall 720w · wide 1280w)
     assets/img/icons/<slug>.webp         app icon     (256 x 256)
     assets/img/apps/<slug>/manifest.json dimensions consumed by tools/build.js

   Sources stay untouched; nothing here needs to run at page-view time.
   ========================================================================== */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const images = require("./images");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "görseller");

const WIDTHS = { tall: 720, wide: 1280 };
const QUALITY = 78;

const slugify = (file) =>
  path.basename(file, path.extname(file))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function run() {
  const manifest = {};

  for (const [slug, cfg] of Object.entries(images)) {
    const outDir = path.join(ROOT, "assets", "img", "apps", slug);
    fs.mkdirSync(outDir, { recursive: true });
    console.log("\n" + slug);

    /* ---- icon ---- */
    const iconPath = path.join(ROOT, "assets", "img", "icons", slug + ".webp");
    let icon = null;

    if (cfg.icon) {
      const src = path.join(SRC, cfg.icon.src);
      let img = sharp(src);
      if (cfg.icon.crop) img = img.extract(cfg.icon.crop);
      await img.resize(256, 256, { fit: "cover" }).webp({ quality: 88 }).toFile(iconPath);
      icon = "/assets/img/icons/" + slug + ".webp";
      console.log("  icon  → " + slug + ".webp");
    } else if (fs.existsSync(iconPath)) {
      /* No source to crop from, but a ready-made icon was dropped in by hand
         (VibeRoute's comes from its App Store artwork). Use it rather than
         letting the pages silently fall back to the emoji mark. */
      icon = "/assets/img/icons/" + slug + ".webp";
      console.log("  icon  → " + slug + ".webp (hazır dosya)");
    } else {
      console.log("  icon  → yok, emoji kullanılacak");
    }

    /* ---- screenshots ---- */
    const media = [];
    for (const item of cfg.media) {
      const src = path.join(SRC, item.src);
      if (!fs.existsSync(src)) { console.warn("  ! missing " + item.src); continue; }

      const name = slugify(item.src) + ".webp";
      const out = path.join(outDir, name);

      const info = await sharp(src)
        .resize({ width: WIDTHS[item.kind], withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(out);

      media.push({
        src: "/assets/img/apps/" + slug + "/" + name,
        kind: item.kind,
        alt: item.alt,
        width: info.width,
        height: info.height,
      });

      console.log("  " + name.padEnd(30) + info.width + "x" + info.height +
                  "  " + Math.round(fs.statSync(out).size / 1024) + "KB");
    }

    manifest[slug] = { icon, media };
  }

  fs.writeFileSync(path.join(__dirname, "media.json"), JSON.stringify(manifest, null, 2), "utf8");
  console.log("\n→ tools/media.json written");
}

run().catch((e) => { console.error(e); process.exit(1); });
