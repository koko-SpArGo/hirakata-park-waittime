const CACHE_NAME = "hirakata-park-v1";

const STATIC_FILES = [

    "./",

    "./index.html",

    "./style.css",

    "./script.js",

    "./data.json",

    "./manifest.json"

];

// ===============================

// インストール

// ===============================

self.addEventListener("install", event => {

    console.log("Service Worker: install");

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(cache => {

                return cache.addAll(STATIC_FILES);

            })

    );

    self.skipWaiting();

});

// ===============================

// 有効化

// ===============================

self.addEventListener("activate", event => {

    console.log("Service Worker: activate");

    event.waitUntil(

        caches.keys().then(cacheNames => {

            return Promise.all(

                cacheNames

                    .filter(name => name !== CACHE_NAME)

                    .map(name => caches.delete(name))

            );

        })

    );

    self.clients.claim();

});

// ===============================

// データ取得

// ===============================

self.addEventListener("fetch", event => {

    const request = event.request;

    // data.jsonはネットを優先

    if (request.url.includes("data.json")) {

        event.respondWith(

            fetch(request)

                .then(response => {

                    const responseClone = response.clone();

                    caches.open(CACHE_NAME)

                        .then(cache => {

                            cache.put(request, responseClone);

                        });

                    return response;

                })

                .catch(() => {

                    return caches.match(request);

                })

        );

        return;

    }

    // その他のファイル

    event.respondWith(

        caches.match(request)

            .then(cachedResponse => {

                if (cachedResponse) {

                    return cachedResponse;

                }

                return fetch(request);

            })

    );

});
