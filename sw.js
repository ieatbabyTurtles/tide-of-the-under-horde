// Tide of the Under-Horde — offline cache with an update-safe strategy.
//
// HOW UPDATES REACH PHONES:
// 1. Bump BUILD_VERSION on every deploy. Phones check this file for changes on
//    each launch, install the new worker, and drop the old cache.
// 2. The app shell (index.html / navigations) is served NETWORK-FIRST: every
//    launch tries the network first, so new code lands immediately. If the
//    phone is offline, the cached copy is used instead.
// 3. Static assets (sprites, icons) stay cache-first: fast and offline-friendly.
//    Bump BUILD_VERSION whenever an asset file changes too.
var BUILD_VERSION = 'v79';
var CACHE = 'tide-under-horde-' + BUILD_VERSION;
var ASSETS = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png',
  './assets/units/rat_scurrier.webp', './assets/units/rat_archer.webp', './assets/units/rat_brute.webp',
  './assets/units/porc_gladiator.webp', './assets/units/porc_warlord.webp', './assets/units/porc_quillthrower.webp',
  './assets/bg/meadow.jpg',
  './assets/units/walk/rat_scurrier_walk2.webp', './assets/units/walk/rat_archer_walk2.webp', './assets/units/walk/rat_brute_walk2.webp',
  './assets/units/walk/porc_gladiator_walk2.webp', './assets/units/walk/porc_warlord_walk2.webp', './assets/units/walk/porc_quillthrower_walk2.webp',
  './assets/units/armor/rat_scurrier_l1.webp', './assets/units/armor/rat_scurrier_l2.webp', './assets/units/armor/rat_scurrier_l3.webp',
  './assets/units/armor/rat_archer_l1.webp', './assets/units/armor/rat_archer_l2.webp', './assets/units/armor/rat_archer_l3.webp',
  './assets/units/armor/rat_brute_l1.webp', './assets/units/armor/rat_brute_l2.webp', './assets/units/armor/rat_brute_l3.webp',
  './assets/units/walk/rat_scurrier_l1_walk2.webp', './assets/units/walk/rat_scurrier_l2_walk2.webp', './assets/units/walk/rat_scurrier_l3_walk2.webp',
  './assets/units/walk/rat_archer_l1_walk2.webp', './assets/units/walk/rat_archer_l2_walk2.webp', './assets/units/walk/rat_archer_l3_walk2.webp',
  './assets/units/walk/rat_brute_l1_walk2.webp', './assets/units/walk/rat_brute_l2_walk2.webp', './assets/units/walk/rat_brute_l3_walk2.webp',
  './assets/buildings/rat_warren.webp', './assets/buildings/porc_citadel.webp',
  './assets/buildings/turret_rat_crossbow.webp', './assets/buildings/turret_porc_quillshooter.webp',
  './assets/menu_rat_crest.webp'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  var isAppShell = e.request.mode === 'navigate' || /(^|\/)index\.html$/.test(url.pathname);
  if (isAppShell) {
    // Network-first for the app shell: fresh code on every launch when online,
    // cached copy as the offline fallback. Never serves a stale build again.
    e.respondWith(
      fetch(e.request, { cache: 'no-store' }).then(function (resp) {
        if (resp && resp.ok) {
          var copy = resp.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); }).catch(function () {});
        }
        return resp;
      }).catch(function () { return caches.match(e.request); })
    );
  } else {
    // Cache-first for static assets: fast launches and offline play.
    e.respondWith(caches.match(e.request).then(function (hit) { return hit || fetch(e.request); }));
  }
});
