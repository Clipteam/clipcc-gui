let cacheName = 'com.codingclip.clipcc3'
let cacheList = [
    'index.html',
    'sw.js',
    'lib.min.js',
    'extension-worker.js'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(c => {
            return c.addAll(cacheList);
        })
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(res => {
            if (res) {
                console.log(res);
                return res;
            }
            return fetch(e.request);
        })
    );
});


