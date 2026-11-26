/* Corte Fácil: app-scoped offline shell, always prefer current interface assets. */
const CACHE_NAME = 'corte-v3-workspace-20261126b';
const CACHE_PREFIX = 'corte-';
const ASSETS = ['./', './index.php', './tutorial.php', './style.css', './workspace.css', './workspace-core.js', './optimizer.js', './i18n.js', './script.js', './manifest.json', './images/icon-192.png', './images/icon-512.png'];

function appBase(locationHref) { return new URL('./', locationHref); }
function shouldHandle(request, locationHref) {
    if (!request || request.method !== 'GET') return false;
    const base = appBase(locationHref), url = new URL(request.url);
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) return false;
    const relative = url.pathname.slice(base.pathname.length);
    if (/(?:^|\/)(?:api(?:[_.\/-]|$)|lib_db\.php|database(?:\/|$)|uploads(?:\/|$))/i.test(relative)) return false;
    if (/\.(?:db|sqlite|sqlite3|env|log)(?:$|\.)/i.test(relative)) return false;
    if (/\.php$/i.test(relative)) return ['index.php', 'tutorial.php', 'app.php', 'landingpage.php'].includes(relative);
    return relative === '' || /\.(?:css|js|json|png|webp|jpg|jpeg|svg|ico|woff2?|ttf)$/i.test(relative);
}
function cacheKey(request) {
    const url = new URL(request.url);
    url.search = '';
    url.hash = '';
    return url.href;
}
async function networkFirst(request, cacheStorage, fetcher, locationHref) {
    const cache = await cacheStorage.open(CACHE_NAME);
    const key = cacheKey(request);
    try {
        const response = await fetcher(request, {cache: 'no-store'});
        if (response.ok && response.type !== 'opaque' && !response.redirected) await cache.put(key, response.clone());
        return response;
    } catch (error) {
        const cached = await cache.match(key);
        if (cached) return cached;
        const base = appBase(locationHref);
        const path = new URL(request.url).pathname;
        if (path === base.pathname || path === base.pathname + 'index.php') {
            const shell = await cache.match(new URL('index.php', base).href) || await cache.match(base.href);
            if (shell) return shell;
        }
        throw error;
    }
}
async function cleanOwnCaches(cacheStorage) {
    const names = await cacheStorage.keys();
    await Promise.all(names.filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME).map(name => cacheStorage.delete(name)));
}
if (typeof module === 'object' && module.exports) module.exports = { CACHE_NAME, CACHE_PREFIX, ASSETS, shouldHandle, cacheKey, networkFirst, cleanOwnCaches };
if (typeof self !== 'undefined' && self.addEventListener) {
    self.addEventListener('install', event => {
        event.waitUntil((async () => {
            const cache = await caches.open(CACHE_NAME);
            await cache.addAll(ASSETS);
            await self.skipWaiting();
        })());
    });
    self.addEventListener('activate', event => {
        event.waitUntil((async () => { await cleanOwnCaches(caches); await self.clients.claim(); })());
    });
    self.addEventListener('fetch', event => {
        if (shouldHandle(event.request, self.location.href)) event.respondWith(networkFirst(event.request, caches, fetch, self.location.href));
    });
}
