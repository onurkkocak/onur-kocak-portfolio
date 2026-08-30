/* ==========================================================================
   content.js — the single source of truth for every app page.
   --------------------------------------------------------------------------
   Edit this file, then run:  node tools/build.js
   It regenerates every app page under /uygulamalar, every privacy policy
   under /gizlilik, plus 404.html, sitemap.xml and robots.txt.

   Screenshots and icons are NOT listed here — they come from tools/images.js
   via tools/media.json (see tools/prepare-images.js).

   Every text field is a pair: [Turkish, English].
   ========================================================================== */

const site = {
  origin: "https://onur-kocak.com",
  author: "Onur Koçak",
  github: "https://github.com/onurkkocak",
  email: "support@onur-kocak.com",
  legalUpdated: ["30 Ağustos 2026", "30 August 2026"],
};

const apps = [
  /* ====================================================== VibeRoute ===== */
  {
    slug: "viberoute",
    name: "VibeRoute",
    icon: "🧭",
    kicker: ["Seyahat · Yapay zekâ", "Travel · AI"],
    tagline: [
      "Geziyi anlat, gerisini yapay zekâ halletsin.",
      "Describe your trip — AI does the rest.",
    ],
    lede: [
      "VibeRoute, birkaç tercihinden yola çıkıp sana özel bir gezi rotası çizer. Kiminle gittiğini, tarihini, yönünü, tarzını ve bütçeni söyle; günlere bölünmüş, yol üstü duraklarıyla birlikte hazır bir plan al.",
      "VibeRoute draws a trip route made for you out of a handful of preferences. Say who you're travelling with, when, in which direction, in what style and on what budget — and get a plan split into days, stops along the way included.",
    ],
    chips: [
      ["Yapay zekâ rota", "AI routing"],
      ["Günlük ajanda", "Daily agenda"],
      ["Yol üstü duraklar", "Stops en route"],
      ["Ortak plan", "Shared plans"],
      ["Türkçe · İngilizce", "Turkish · English"],
    ],
    features: [
      { icon: "✨", title: ["Rotamı Çiz", "Draw My Route"],
        text: ["Kiminle, tarih, yön, bölge, tarz ve bütçe — altı seçim yeterli, rotan çıkıyor.",
               "Who with, when, which direction, which region, what style, what budget — six choices and your route appears."] },
      { icon: "🗓️", title: ["Gün gün ajanda", "A day-by-day agenda"],
        text: ["Gezin günlere bölünür; her günün nasıl geçeceğini önceden görürsün.",
               "Your trip is split into days, so you can see how each one will unfold before it starts."] },
      { icon: "📍", title: ["Yol üstü duraklar", "Stops along the way"],
        text: ["İki şehir arasında kaçırılmaması gereken duraklar rotana kendiliğinden eklenir.",
               "The stops worth making between two cities are folded into your route automatically."] },
      { icon: "🧭", title: ["Aktif gezi takibi", "Live trip tracking"],
        text: ["Yoldayken planını adım adım takip et, nerede olduğunu ve sıradakini gör.",
               "Follow your plan step by step on the road — where you are and what's next."] },
      { icon: "👥", title: ["Ortak plan", "Plan together"],
        text: ["Aynı geziyi arkadaşlarınla birlikte planla; herkes aynı programı görsün.",
               "Plan the same trip with friends so everyone is looking at the same itinerary."] },
      { icon: "🏙️", title: ["Şehir hakkında", "About the city"],
        text: ["Gideceğin yer hakkında bilmen gerekenler, gezinin içinde hazır.",
               "What you need to know about where you're going, right inside the trip."] },
    ],
    steps: [
      { title: ["Tercihlerini seç", "Set your preferences"],
        text: ["Kiminle, tarih, yön, bölge, tarz ve bütçe — hepsi tek ekranda.",
               "Who with, dates, direction, region, style and budget — all on one screen."] },
      { title: ["Rotamı Çiz'e bas", "Tap Draw My Route"],
        text: ["Yapay zekâ tercihlerine göre gezini kurar.",
               "The AI builds your trip around what you chose."] },
      { title: ["Planını düzenle", "Adjust the plan"],
        text: ["Günleri, durakları ve sırayı istediğin gibi değiştir; yarım kalan planlarına geri dön.",
               "Change days, stops and order however you like — and pick up plans you left half finished."] },
      { title: ["Yola çık", "Hit the road"],
        text: ["Aktif gezi ekranıyla planını yanında taşı.",
               "Take your plan with you through the live trip screen."] },
    ],
    specs: [
      { label: ["Kategori", "Category"], value: ["Seyahat", "Travel"] },
      { label: ["Platform", "Platform"], value: ["iOS", "iOS"] },
      { label: ["Dil", "Language"], value: ["Türkçe · İngilizce", "Turkish · English"] },
      { label: ["Öne çıkan", "Highlight"], value: ["Yapay zekâ rota", "AI routing"] },
    ],
    stores: {
      ios: "https://apps.apple.com/tr/app/viberoute/id6785224260?l=tr",
      android: null,
    },
    // Reklam veya satın alma yoksa false yap; politika bölümü de kalkar.
    hasAds: true,
    hasPurchases: true,
    // Yapay zekâya ne gönderildiği; kaldırırsan o politika bölümü de kalkar.
    ai: [
      "Rotanı oluşturabilmek için seçtiğin tercihler — kiminle gittiğin, tarih, yön, bölge, tarz ve bütçe — ile yazdığın serbest metinler Google Gemini'ye gönderilir.",
      "So your route can be generated, the preferences you choose — who you travel with, dates, direction, region, style and budget — along with any free text you type, are sent to Google Gemini.",
    ],

    privacy: {
      collects: [
        ["Gezi planların ve seçtiğin tarih, yön, bölge, tarz ve bütçe gibi tercihler.",
         "Your trip plans and the preferences you choose, such as dates, direction, region, style and budget."],
        ["Yakındaki yerleri ve aktif gezi takibini sunabilmek için — yalnızca izin verirsen — konum bilgisi.",
         "Location data, only if you grant permission, so nearby places and live trip tracking can work."],
        ["Ortak plan özelliğinde birlikte planladığın kişilerle paylaştığın plan içeriği.",
         "The plan content you share with the people you plan with in the shared-plan feature."],
        ["Uygulamanın çökme ve hata kayıtları gibi temel teknik veriler.",
         "Basic technical data such as crash and error logs."],
      ],
      thirdParty: [
        ["Supabase — hesap ve uygulama verilerinin saklandığı veritabanı altyapısı",
         "Supabase — the database infrastructure holding accounts and app data"],
        ["Google Gemini — rota önerilerinin üretilmesi",
         "Google Gemini — generating route suggestions"],
        ["RevenueCat — uygulama içi satın alma ve abonelik yönetimi",
         "RevenueCat — in-app purchase and subscription management"],
        ["Google AdMob — uygulama içinde reklam gösterimi",
         "Google AdMob — serving ads inside the app"],
        ["Google Play / App Store — dağıtım, ödeme işlemleri ve otomatik çökme raporları",
         "Google Play / App Store — distribution, payment processing and automatic crash reports"],
      ],
    },
  },

  /* =================================================== Firuzan Abla ===== */
  {
    slug: "firuzan-abla",
    name: "Firuzan Abla",
    icon: "🔮",
    kicker: ["Fal · Astroloji", "Fortune · Astrology"],
    tagline: [
      "Kahve falı, tarot ve burç yorumların cebinde.",
      "Coffee readings, tarot and horoscopes in your pocket.",
    ],
    lede: [
      "Firuzan Abla; kahve falı, tarot, burç yorumu, doğum haritası ve sinastriyi tek bir uygulamada toplar. Merak ettiğin ne varsa, tanıdık ve sıcak bir ablanın ağzından.",
      "Firuzan Abla brings coffee readings, tarot, horoscopes, birth charts and synastry together in a single app — every answer in the warm, familiar voice of an older sister.",
    ],
    chips: [
      ["Kahve falı", "Coffee reading"],
      ["Tarot", "Tarot"],
      ["Burç yorumu", "Horoscope"],
      ["Doğum haritası", "Birth chart"],
      ["Sinastri", "Synastry"],
    ],
    features: [
      { icon: "☕", title: ["Kahve falı", "Coffee reading"],
        text: ["Fincanını gönder, sohbet eder gibi falını öğren.",
               "Send your cup and get your reading the way you'd hear it over a chat."] },
      { icon: "🃏", title: ["Tarot", "Tarot"],
        text: ["Kartını çek, yayılımın ne anlattığını sade bir dille oku.",
               "Draw your card and read what the spread says, in plain language."] },
      { icon: "🌙", title: ["Burç yorumu", "Horoscope"],
        text: ["Burcuna özel yorumlarla günün nasıl geçeceğini takip et.",
               "Follow how your day is shaping up with readings for your sign."] },
      { icon: "🌌", title: ["Doğum haritası", "Birth chart"],
        text: ["Doğum tarihin, saatin ve yerinle haritanı çıkar; gezegenlerin nerede olduğunu gör.",
               "Generate your chart from your date, time and place of birth, and see where the planets sat."] },
      { icon: "💞", title: ["Sinastri", "Synastry"],
        text: ["İki haritayı üst üste koy, açıları hesapla ve uyum puanını gör.",
               "Overlay two charts, calculate the aspects and see the compatibility score."] },
      { icon: "📜", title: ["Geçmişin kayıtlı", "Your history, kept"],
        text: ["Daha önce baktırdığın fallara istediğin zaman geri dön.",
               "Go back to your earlier readings whenever you like."] },
    ],
    steps: [
      { title: ["Bilgilerini gir", "Enter your details"],
        text: ["Burcun ve doğum bilgilerin için bir kere bilgi ver, sonrası hazır gelsin.",
               "Give your sign and birth details once; everything after that comes prefilled."] },
      { title: ["Fal türünü seç", "Choose a reading"],
        text: ["Kahve, tarot, burç, doğum haritası ya da sinastri.",
               "Coffee, tarot, horoscope, birth chart or synastry."] },
      { title: ["Sohbete başla", "Start the conversation"],
        text: ["Sorunu sor, cevabını Firuzan Abla'nın kendi üslubuyla al.",
               "Ask your question and get the answer in Firuzan Abla's own style."] },
      { title: ["Geçmişine dön", "Look back"],
        text: ["Fallar kayıtlı kalır; istediğinde tekrar okuyabilirsin.",
               "Readings stay saved, so you can read them again any time."] },
    ],
    specs: [
      { label: ["Kategori", "Category"], value: ["Yaşam tarzı", "Lifestyle"] },
      { label: ["Platform", "Platform"], value: ["Android", "Android"] },
      { label: ["İçerik", "Content"], value: ["5 fal türü", "5 reading types"] },
      { label: ["Dil", "Language"], value: ["Türkçe", "Turkish"] },
    ],
    stores: {
      ios: null,
      android: "https://play.google.com/store/apps/details?id=com.firuzanabla.app",
    },
    // Reklam veya satın alma yoksa false yap; politika bölümü de kalkar.
    hasAds: true,
    hasPurchases: true,
    // Yapay zekâya ne gönderildiği; kaldırırsan o politika bölümü de kalkar.
    ai: [
      "Falının yorumlanabilmesi için yüklediğin fincan fotoğrafları, doğum bilgilerin ve sorduğun sorular Google Gemini'ye gönderilir.",
      "So your reading can be interpreted, the cup photos you upload, your birth details and the questions you ask are sent to Google Gemini.",
    ],

    privacy: {
      collects: [
        ["Doğum haritası ve sinastri hesaplaması için verdiğin doğum tarihi, saati ve yeri bilgileri.",
         "The date, time and place of birth you provide so charts and synastry can be calculated."],
        ["Kahve falı için yüklediğin fincan fotoğrafları.",
         "The cup photos you upload for a coffee reading."],
        ["Uygulama içindeki tercihlerin, jeton bakiyen ve geçmiş fal kayıtların.",
         "Your in-app preferences, token balance and past reading history."],
      ],
      thirdParty: [
        ["Supabase — hesap, fal geçmişi ve yüklenen fotoğrafların saklandığı veritabanı altyapısı",
         "Supabase — the database infrastructure holding accounts, reading history and uploaded photos"],
        ["Google Gemini — fal ve yorum metinlerinin üretilmesi",
         "Google Gemini — generating reading and interpretation text"],
        ["RevenueCat — uygulama içi satın alma ve abonelik yönetimi",
         "RevenueCat — in-app purchase and subscription management"],
        ["Google AdMob — uygulama içinde reklam gösterimi",
         "Google AdMob — serving ads inside the app"],
        ["Google Play / App Store — dağıtım, ödeme işlemleri ve otomatik çökme raporları",
         "Google Play / App Store — distribution, payment processing and automatic crash reports"],
      ],
      note: [
        "Firuzan Abla eğlence amaçlıdır. Uygulamadaki yorumlar tıbbi, hukuki veya finansal tavsiye yerine geçmez.",
        "Firuzan Abla is for entertainment. Nothing in the app is a substitute for medical, legal or financial advice.",
      ],
    },
  },

  /* ==================================================== Geçiş Oyunu ===== */
  {
    slug: "gecis-oyunu",
    name: "Geçiş Oyunu",
    fullName: ["Geçiş Oyunu: Futbol Bilgi", "Geçiş Oyunu: Football Trivia"],
    icon: "⚽",
    kicker: ["Futbol · Bilgi oyunu", "Football · Trivia"],
    tagline: [
      "İki kulüpte de forma giymiş futbolcuyu bul.",
      "Name the player who wore both shirts.",
    ],
    lede: [
      "Geçiş Oyunu, futbol hafızanı süreyle sınayan bir bilgi oyunu. 123.000'den fazla futbolcu, 4.200 kulüp ve 600.000'i aşkın transferden oluşan bir veri havuzuyla: iki kulübü gör, ortak oyuncuyu rakibinden önce bul.",
      "Geçiş Oyunu puts your football memory on the clock. Backed by a pool of over 123,000 players, 4,200 clubs and more than 600,000 transfers: see two clubs, and name the player they share before your opponent does.",
    ],
    chips: [
      ["Transfer bilmecesi", "Transfer puzzle"],
      ["Ben Kimim", "Who Am I"],
      ["Ülke modu", "Country mode"],
      ["Rakibe karşı", "Head to head"],
      ["Alıştırma modu", "Practice mode"],
    ],
    features: [
      { icon: "🔗", title: ["Klasik transfer bilmecesi", "The classic transfer puzzle"],
        text: ["İki kulüp verilir, ikisinde de oynamış futbolcuyu yazarsın. Kolay görünür — süre başlayana kadar.",
               "You're given two clubs and you name a player who turned out for both. It looks easy until the clock starts."] },
      { icon: "🕵️", title: ["Ben Kimim", "Who Am I"],
        text: ["İpuçları tek tek açılır, futbolcuyu ne kadar erken bilirsen o kadar çok puan.",
               "Clues open one by one — the earlier you name the player, the more you score."] },
      { icon: "🌍", title: ["Ülke modu", "Country mode"],
        text: ["Futbolcuları ülkelerine göre bilme üzerine kurulu ayrı bir mod.",
               "A separate mode built around placing players by their country."] },
      { icon: "⚔️", title: ["Rakibine karşı yarış", "Race your opponent"],
        text: ["Kafa kafaya oyna, kazandıkça sıralamada zirveye çık.",
               "Play head to head and climb to the top of the table as you win."] },
      { icon: "🎯", title: ["Alıştırma modu", "Practice mode"],
        text: ["Baskı olmadan çalış: doğru–yanlış sayacıyla kendini geliştir.",
               "Train without the pressure, with a right-and-wrong counter to measure yourself."] },
      { icon: "📚", title: ["Devasa veri havuzu", "A huge data pool"],
        text: ["123.000+ futbolcu, 4.200 kulüp, 600.000+ transfer — Süper Lig ve Avrupa.",
               "123,000+ players, 4,200 clubs, 600,000+ transfers — the Süper Lig and Europe."] },
    ],
    steps: [
      { title: ["Modunu seç", "Pick your mode"],
        text: ["Transfer bilmecesi, Ben Kimim, Ülke ya da alıştırma.",
               "Transfer puzzle, Who Am I, Country or practice."] },
      { title: ["İki kulübü gör", "See the two clubs"],
        text: ["Karşına çıkan iki kulüpte de forma giymiş bir isim bulman gerekiyor.",
               "You need a name who played for both of the clubs in front of you."] },
      { title: ["Süre dolmadan yaz", "Answer before time is up"],
        text: ["Aklına gelen ismi yaz ve gönder; her saniye rakibinin lehine işliyor.",
               "Type the name and send it — every second works in your opponent's favour."] },
      { title: ["Zirveye çık", "Climb to the top"],
        text: ["Kazandıkça puan topla, sıralamada yüksel.",
               "Collect points as you win and climb the rankings."] },
    ],
    specs: [
      { label: ["Kategori", "Category"], value: ["Oyun · Bilgi yarışması", "Game · Trivia"] },
      { label: ["Platform", "Platform"], value: ["Android", "Android"] },
      { label: ["Modlar", "Modes"], value: ["4 oyun modu", "4 game modes"] },
      { label: ["Veri havuzu", "Data pool"], value: ["600.000+ transfer", "600,000+ transfers"] },
    ],
    stores: {
      ios: null,
      android: "https://play.google.com/store/apps/details?id=com.gecisoyunu.gecis_oyunu",
    },
    // Reklam veya satın alma yoksa false yap; politika bölümü de kalkar.
    hasAds: true,
    hasPurchases: true,

    privacy: {
      collects: [
        ["Oyuncu adın, avatarın ve oyun içi puan ile sıralama bilgilerin.",
         "Your player name, avatar, in-game score and ranking."],
        ["Rakiple eşleşebilmek için maç ve bağlantı kayıtları.",
         "Match and connection records needed to pair you with an opponent."],
        ["Uygulamanın çökme ve hata kayıtları gibi temel teknik veriler.",
         "Basic technical data such as crash and error logs."],
      ],
      thirdParty: [
        ["Supabase — hesap, veritabanı ve çok oyunculu eşleşme altyapısı",
         "Supabase — accounts, database and multiplayer matchmaking infrastructure"],
        ["RevenueCat — uygulama içi satın alma ve abonelik yönetimi",
         "RevenueCat — in-app purchase and subscription management"],
        ["Google AdMob — uygulama içinde reklam gösterimi",
         "Google AdMob — serving ads inside the app"],
        ["Google Play / App Store — dağıtım, ödeme işlemleri ve otomatik çökme raporları",
         "Google Play / App Store — distribution, payment processing and automatic crash reports"],
      ],
    },
  },

  /* ==================================================== Çanak Tavla ===== */
  {
    slug: "canak-tavla",
    name: "Çanak Tavla",
    icon: "🎲",
    kicker: ["Tavla · Online", "Backgammon · Online"],
    tagline: [
      "Zar at, mars yap, kazan.",
      "Roll, gammon, win.",
    ],
    lede: [
      "Çanak Tavla; gerçek rakiplere ve bota karşı oynanan, seviye ve lig sistemi olan bir online tavla oyunu. Arkadaşını oda koduyla davet et, günlük bonusunu al, masaları yükselt.",
      "Çanak Tavla is online backgammon against real opponents and a bot, with levels and a league system. Invite a friend with a room code, claim your daily bonus and move up to bigger tables.",
    ],
    chips: [
      ["Online rakip", "Online opponents"],
      ["Bota karşı", "Vs. bot"],
      ["Lig sistemi", "League system"],
      ["Oda kodu", "Room code"],
      ["Çevrimdışı oynanır", "Plays offline"],
    ],
    features: [
      { icon: "🌐", title: ["Online tavla", "Online backgammon"],
        text: ["Gerçek rakiplerle eşleş, çaylaklardan yüksek jetonlu masalara kadar yüksel.",
               "Match with real opponents and work your way up from the beginners' tables to the high-stakes ones."] },
      { icon: "🤖", title: ["Bota karşı ve çevrimdışı", "Bot mode, no connection needed"],
        text: ["İnternet yokken bile oyna: çevrimdışı modda bot her zaman masada.",
               "Play even with no connection — in offline mode the bot is always at the table."] },
      { icon: "👥", title: ["Arkadaşını davet et", "Invite a friend"],
        text: ["Oda kodunu paylaş, arkadaşınla özel masada karşı karşıya gel.",
               "Share a room code and face your friend at a private table."] },
      { icon: "🏆", title: ["Lig ve seviye", "League and levels"],
        text: ["Kazandıkça seviye atla, ligde sıralamanı yükselt.",
               "Level up as you win and climb the league standings."] },
      { icon: "🎁", title: ["Günlük bonus", "Daily bonus"],
        text: ["Çarkı çevir, günlük ödülünü al, jeton kasanı büyüt.",
               "Spin the wheel, take your daily reward and build up your coins."] },
      { icon: "⚡", title: ["Oto zar ve akıcı oyun", "Auto-roll and fluid play"],
        text: ["Oto zar, pes et ve hızlı hamlelerle oyunun ritmi hiç bozulmaz.",
               "Auto-roll, resign and quick moves keep the game's rhythm intact."] },
    ],
    steps: [
      { title: ["Masanı seç", "Choose your table"],
        text: ["Çaylaklardan başla ya da doğrudan yüksek jetonlu masaya otur.",
               "Start with the beginners, or sit straight down at a high-stakes table."] },
      { title: ["Rakibini bul", "Find your opponent"],
        text: ["Hemen oyna ile eşleş, arkadaşını davet et ya da bota karşı başla.",
               "Match instantly, invite a friend, or take on the bot."] },
      { title: ["Zar at, oyna", "Roll and play"],
        text: ["Pullarını taşı, kır, topla — klasik tavla kurallarıyla.",
               "Move your checkers, hit, bear off — by the classic rules."] },
      { title: ["Mars yap, yüksel", "Gammon your way up"],
        text: ["Kazan, jeton topla, seviye atla ve ligde yüksel.",
               "Win, collect coins, level up and climb the league."] },
    ],
    specs: [
      { label: ["Kategori", "Category"], value: ["Oyun · Masa oyunu", "Game · Board"] },
      { label: ["Platform", "Platform"], value: ["Android", "Android"] },
      { label: ["Modlar", "Modes"], value: ["Online · Bot · Arkadaş", "Online · Bot · Friend"] },
      { label: ["Öne çıkan", "Highlight"], value: ["Lig ve günlük bonus", "League and daily bonus"] },
    ],
    stores: {
      ios: null,
      android: "https://play.google.com/store/apps/details?id=com.onurkocak.tavlaplus",
    },
    // Reklam veya satın alma yoksa false yap; politika bölümü de kalkar.
    hasAds: true,
    hasPurchases: true,

    privacy: {
      collects: [
        ["Oyuncu adın, avatarın, seviyen, jeton bakiyen ve lig sıralaman.",
         "Your player name, avatar, level, coin balance and league standing."],
        ["Online oyun ve oda kodu ile eşleşme için maç ve bağlantı kayıtları.",
         "Match and connection records used for online play and room-code pairing."],
        ["Uygulamanın çökme ve hata kayıtları gibi temel teknik veriler.",
         "Basic technical data such as crash and error logs."],
      ],
      thirdParty: [
        ["Supabase — hesap, veritabanı ve çok oyunculu eşleşme altyapısı",
         "Supabase — accounts, database and multiplayer matchmaking infrastructure"],
        ["RevenueCat — uygulama içi satın alma ve abonelik yönetimi",
         "RevenueCat — in-app purchase and subscription management"],
        ["Google AdMob — uygulama içinde reklam gösterimi",
         "Google AdMob — serving ads inside the app"],
        ["Google Play / App Store — dağıtım, ödeme işlemleri ve otomatik çökme raporları",
         "Google Play / App Store — distribution, payment processing and automatic crash reports"],
      ],
    },
  },
];

module.exports = { site, apps };
