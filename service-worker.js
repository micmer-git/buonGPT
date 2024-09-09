self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('nutrianalyzer-v1').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/app.js',
                '/foods.js',
                '/style.css',
                '/manifest.json',
                '/icon.png'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});