// Minimal offline cache for Tide of the Under-Horde (single-page game).
var CACHE = 'tide-under-horde-v24';
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
  './assets/units/walk/rat_brute_l1_walk2.webp', './assets/units/walk/rat_brute_l2_walk2.webp', './assets/units/walk/rat_brute_l3_walk2.webp'];
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
  e.respondWith(caches.match(e.request).then(function (hit) { return hit || fetch(e.request); }));
});
