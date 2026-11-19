// Service worker van het portfolio. Hij bewaart de pagina en haar bestanden, zodat de site
// ook opent zonder internet en bij een tweede bezoek meteen op het scherm staat.
// Verhoog het versienummer bij elke wijziging aan deze lijst: oude caches worden dan opgeruimd.

const VERSIE = "portfolio-v1";
const SCHIL = VERSIE + "-schil";
const LOPEND = VERSIE + "-lopend";

// De bestanden die de site nodig heeft om te openen.
const SCHIL_BESTANDEN = [
    "/",
    "/index.html",
    "/style.css",
    "/script.js",
    "/cv-pdf.js",
    "/lang/nl.js",
    "/lang/en.js",
    "/manifest.webmanifest",
    "/favicon.ico",
    "/favicon-v3-96x96.png",
    "/favicon-v3-192x192.png",
    "/apple-touch-icon-v3.png",
    "/icon-512x512.png"
];

self.addEventListener("install", function (gebeurtenis) {
    gebeurtenis.waitUntil(
        caches.open(SCHIL).then(function (cache) {
            // Eén mislukt bestand mag de installatie niet tegenhouden.
            return Promise.allSettled(SCHIL_BESTANDEN.map(function (pad) {
                return cache.add(new Request(pad, { cache: "reload" }));
            }));
        }).then(function () {
            return self.skipWaiting();
        })
    );
});

self.addEventListener("activate", function (gebeurtenis) {
    gebeurtenis.waitUntil(
        caches.keys().then(function (namen) {
            return Promise.all(namen.map(function (naam) {
                if (naam !== SCHIL && naam !== LOPEND) {
                    return caches.delete(naam);
                }
                return null;
            }));
        }).then(function () {
            return self.clients.claim();
        })
    );
});

self.addEventListener("fetch", function (gebeurtenis) {
    const verzoek = gebeurtenis.request;

    if (verzoek.method !== "GET") {
        return;
    }

    const url = new URL(verzoek.url);

    // Pagina's: eerst het net, zodat een bezoeker altijd de nieuwste versie ziet.
    // Lukt dat niet, dan komt de bewaarde pagina uit de cache.
    if (verzoek.mode === "navigate") {
        gebeurtenis.respondWith(
            fetch(verzoek).then(function (antwoord) {
                const kopie = antwoord.clone();
                caches.open(SCHIL).then(function (cache) {
                    cache.put("/index.html", kopie);
                });
                return antwoord;
            }).catch(function () {
                return caches.match("/index.html").then(function (bewaard) {
                    return bewaard || caches.match("/");
                });
            })
        );
        return;
    }

    // Eigen bestanden: meteen uit de cache en ondertussen op de achtergrond vernieuwen.
    // ignoreSearch: style.css en script.js worden geladen met een versienummer achter de naam
    // (?v=161); zonder deze optie zou de bewaarde versie niet gevonden worden.
    if (url.origin === self.location.origin) {
        gebeurtenis.respondWith(
            caches.match(verzoek, { ignoreSearch: true }).then(function (bewaard) {
                const vanHetNet = fetch(verzoek).then(function (antwoord) {
                    if (antwoord && antwoord.status === 200) {
                        const kopie = antwoord.clone();
                        caches.open(LOPEND).then(function (cache) {
                            cache.put(verzoek, kopie);
                        });
                    }
                    return antwoord;
                }).catch(function () {
                    return bewaard;
                });

                return bewaard || vanHetNet;
            })
        );
        return;
    }

    // Bestanden van elders (Bootstrap, Font Awesome, lettertypes): eerst de cache,
    // anders het net, en wat binnenkomt wordt bewaard voor de volgende keer.
    gebeurtenis.respondWith(
        caches.match(verzoek).then(function (bewaard) {
            if (bewaard) {
                return bewaard;
            }

            return fetch(verzoek).then(function (antwoord) {
                const kopie = antwoord.clone();
                caches.open(LOPEND).then(function (cache) {
                    cache.put(verzoek, kopie);
                });
                return antwoord;
            });
        })
    );
});
