/* ==========================================================================
   images.js — which source image in /görseller becomes which web asset.
   --------------------------------------------------------------------------
   `kind` decides how a shot is framed on the page:
     "tall"  — portrait (raw screenshot or store poster)
     "wide"  — landscape screenshot
   ========================================================================== */

module.exports = {
  viberoute: {
    /* No standalone app icon supplied yet — the page falls back to the emoji mark. */
    icon: null,
    media: [
      { src: "viberoute/1-ana-ekran.png",        kind: "tall", alt: ["Ana ekran: gezi tercihleri ve Rotamı Çiz", "Home screen: trip preferences and Draw My Route"] },
      { src: "viberoute/3-gun-ajanda.png",       kind: "tall", alt: ["Günlük ajanda görünümü", "Day-by-day agenda view"] },
      { src: "viberoute/4-yol-ustu-duraklar.png",kind: "tall", alt: ["Yol üstü duraklar", "Stops along the way"] },
      { src: "viberoute/6-aktif-gezi.png",       kind: "tall", alt: ["Aktif gezi takibi", "Live trip tracking"] },
      { src: "viberoute/9-sehir-hakkinda.png",   kind: "tall", alt: ["Şehir hakkında bilgi kartı", "City information card"] },
      { src: "viberoute/7-ortak-plan.png",       kind: "tall", alt: ["Ortak plan: arkadaşlarla birlikte planlama", "Shared plan: planning together"] },
    ],
  },

  "firuzan-abla": {
    icon: { src: "firuzan/logo_1200x1200.png", crop: { left: 268, top: 163, width: 664, height: 664 } },
    media: [
      { src: "firuzan/01_ana-sayfa.png",           kind: "tall", alt: ["Ana sayfa: kahve falı, burç, tarot ve doğum haritası", "Home: coffee reading, horoscope, tarot and birth chart"] },
      { src: "firuzan/06_fal-sohbeti.png",         kind: "tall", alt: ["Fal sohbeti ekranı", "Fortune chat screen"] },
      { src: "firuzan/09_tarot-kart.png",          kind: "tall", alt: ["Tarot kartı açılımı", "A drawn tarot card"] },
      { src: "firuzan/11_burc-yorumu.png",         kind: "tall", alt: ["Burç yorumu", "Horoscope reading"] },
      { src: "firuzan/08_dogum-haritasi.png",      kind: "tall", alt: ["Doğum haritası", "Birth chart"] },
      { src: "firuzan/03_sinastri-uyum-puani.png", kind: "tall", alt: ["Sinastri uyum puanı", "Synastry compatibility score"] },
      { src: "firuzan/04_iki-harita-ust-uste.png", kind: "tall", alt: ["İki doğum haritası üst üste", "Two birth charts overlaid"] },
    ],
  },

  "gecis-oyunu": {
    icon: { src: "gecisoyunu/simge_512.png" },
    media: [
      { src: "gecisoyunu/01_soru.png",     kind: "tall", alt: ["İki kulüpte de oynayan futbolcuyu bul", "Name the player who played for both clubs"] },
      { src: "gecisoyunu/03_modlar.png",   kind: "tall", alt: ["Oyun modları", "Game modes"] },
      { src: "gecisoyunu/04_benkimim.png", kind: "tall", alt: ["Ben Kimim modu", "Who Am I mode"] },
      { src: "gecisoyunu/05_ulke.png",     kind: "tall", alt: ["Ülke modu", "Country mode"] },
      { src: "gecisoyunu/02_kart.png",     kind: "tall", alt: ["Futbolcu kartı", "Player card"] },
      { src: "gecisoyunu/06_magaza.png",   kind: "tall", alt: ["Mağaza", "Store"] },
    ],
  },

  "canak-tavla": {
    icon: { src: "tavla/oyun-1200x1200.png", crop: { left: 511, top: 51, width: 182, height: 182 } },
    media: [
      { src: "tavla/shot-lobby.png",  kind: "wide", alt: ["Lobi: masa seçimi ve hemen oyna", "Lobby: table selection and quick play"] },
      { src: "tavla/shot-league.png", kind: "wide", alt: ["Lig ekranı", "League screen"] },
      { src: "tavla/shot-daily.png",  kind: "wide", alt: ["Günlük bonus çarkı", "Daily bonus wheel"] },
    ],
  },
};
