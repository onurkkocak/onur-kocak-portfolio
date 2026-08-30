/* ==========================================================================
   analytics.js — GoatCounter
   --------------------------------------------------------------------------
   Put your GoatCounter code below — the subdomain part of
   https://<code>.goatcounter.com — and analytics turn on across the whole
   site. Leave it empty and nothing loads at all: no request, no script.

   GoatCounter sets no cookies and does not track people between sites, so
   this needs no consent banner. Unique visitors are counted with a hash
   that is re-salted every day, which means the count is per day and cannot
   be traced back to a person.

   count.js already ignores localhost and private networks, so local
   development never shows up in the numbers. To silence your own browser
   on the live site, visit https://onur-kocak.com/#toggle-goatcounter once.
   ========================================================================== */
(function () {
  "use strict";

  var CODE = ""; // TODO(onur): GoatCounter kodun, örn. "onurkocak"

  if (!CODE) return;

  var endpoint = "https://" + CODE + ".goatcounter.com/count";

  /* count.js reads its endpoint from either of these; set both so the
     dynamic insertion below works the same as a plain inline tag. */
  window.goatcounter = window.goatcounter || {};
  window.goatcounter.endpoint = endpoint;

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.setAttribute("data-goatcounter", endpoint);
  document.head.appendChild(s);
})();
