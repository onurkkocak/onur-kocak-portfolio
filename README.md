# Onur Koçak — Portfolyo

[onur-kocak.com](https://onur-kocak.com) — mobil uygulama ve oyun portfolyosu.

Statik bir site. GitHub Pages doğrudan `main` dalının kökünden yayınlıyor, yani
**derleme adımı olmadan** çalışır: `main`'e attığın an yayında olur. Depodaki
Node araçları yalnızca senin makinende, tekrar eden sayfaları ve görselleri
üretmek için çalışır.

## Hızlı başlangıç

```bash
npm install     # sadece geliştirme araçları (sharp, puppeteer-core)
npm run dev     # http://localhost:4321
```

## Klasör yapısı

```
index.html              ana sayfa — elle düzenlenir, üretici buna dokunmaz
uygulamalar/<slug>/     uygulama detay sayfaları   ← ÜRETİLİR
gizlilik/               gizlilik politikaları      ← ÜRETİLİR
404.html sitemap.xml robots.txt                    ← ÜRETİLİR

assets/css/   base · components · home · app
assets/js/    i18n.js (TR/EN) · main.js (etkileşimler)
assets/img/   apps/<slug>/ ekran görüntüleri · icons/ · og/

görseller/    KAYNAK görseller (siteye dahil değil, robots ile engelli)
tools/        içerik, üretici ve denetim araçları
```

> `← ÜRETİLİR` işaretli dosyaları elle düzenleme; `npm run build` üzerlerine yazar.

## Sık yapılan işler

### Bir uygulamanın metnini değiştirmek

`tools/content.js` içindeki ilgili bloğu düzenle, sonra:

```bash
npm run build
```

Her metin bir çift: `["Türkçe", "English"]`. İkisini de doldur.

### Yeni ekran görüntüsü eklemek

1. Görseli `görseller/<uygulama>/` altına koy.
2. `tools/images.js` içindeki `media` dizisine ekle:
   - `kind: "tall"` → dikey (ham ekran görüntüsü veya mağaza posteri)
   - `kind: "wide"` → yatay (Çanak Tavla gibi)
3. Çalıştır:

```bash
npm run images   # WebP'e çevirir, boyutlandırır, tools/media.json yazar
npm run build    # sayfalara işler
```

Ana sayfadaki görseller `index.html` içinde elle yazılı — oradaki yolları da
güncellemen gerekirse `assets/img/apps/<slug>/` altındaki dosya adlarını kullan.

### Yeni uygulama eklemek

`tools/content.js` içine yeni bir blok, `tools/images.js` içine görselleri ekle,
`npm run images && npm run build` çalıştır, sonra `index.html`'e kartını ekle.

## Dil desteği (TR / EN)

Türkçe metin doğrudan HTML'in içinde; İngilizcesi yanındaki attribute'ta durur.
Sözlük dosyası yok, çeviri ait olduğu markup'ın yanında:

```html
<h2 data-en="Apps">Uygulamalar</h2>
<p data-en-html="Built with <b>care</b>">Özenle <b>yapıldı</b></p>
<img data-en-alt="Home screen" alt="Ana ekran">
```

`data-en-<attribute>` biçimiyle herhangi bir attribute çevrilebilir
(`data-en-content`, `data-en-alt`, `data-en-aria-label`, …).

Bir öğenin içinde ikon/etiket varsa `data-en`'i **metni saran bir `<span>`'e**
koy — yoksa metin değişimi ikonu siler:

```html
<a class="back">{ikon}<span data-en="All apps">Tüm uygulamalar</span></a>
```

## Ziyaretçi istatistikleri

Site GoatCounter kullanır: çerez koymaz, IP kaydetmez, kimseyi siteler arasında
takip etmez — bu yüzden çerez onay banner'ı gerekmez. Tekil ziyaretçi sayımı
her gün yeniden tuzlanan bir hash ile yapılır, yani sayım günlüktür ve kimseye
geri götürülemez.

Açmak için:

1. [goatcounter.com](https://www.goatcounter.com) üzerinde ücretsiz hesap aç.
   Sana `<kod>.goatcounter.com` biçiminde bir adres verecek.
2. `assets/js/analytics.js` içindeki `CODE` değişkenine o kodu yaz.
3. Commit'le ve pushla.

`CODE` boş olduğu sürece hiçbir şey yüklenmez — tek bir istek bile gitmez.

Kendi ziyaretlerini saymamak için siteyi bir kez
`https://onur-kocak.com/#toggle-goatcounter` adresiyle aç; o tarayıcı artık
sayılmaz. Localhost zaten otomatik yok sayılır.

## Denetim araçları

```bash
npm run dev              # ayrı bir terminalde açık kalsın
npm run check:responsive # 8 sayfa × 7 ekran: taşma ve dokunma hedefi kontrolü
npm run check:i18n       # her sayfayı EN'e çevirip Türkçe kalıntı arar
```

`npm run check:responsive -- --shots` her kombinasyonun tam sayfa PNG'sini
`.shots/` klasörüne yazar.

## Yapılacaklar

- [ ] `tools/content.js` ve `index.html` içindeki `iletisim@onur-kocak.com`
      adresini gerçek adresle değiştir (`TODO(onur)` olarak işaretli).
- [ ] Gizlilik politikaları taslak; kullandığın gerçek SDK'ları
      (analitik, reklam, satın alma) `tools/content.js` içindeki
      `privacy.thirdParty` listelerinde doğrula.
