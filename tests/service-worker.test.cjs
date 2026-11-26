'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { CACHE_NAME, shouldHandle, cacheKey, networkFirst, cleanOwnCaches } = require('../sw.js');
const base = 'https://4u.ia.br/app/cortefacil/sw.js';
const request = (path, method = 'GET') => ({ url: new URL(path, base).href, method });
function cacheFixture() {
    const store = new Map();
    const cache = { match: async key => store.get(key), put: async (key, value) => { store.set(key, value); } };
    return { store, cache, storage: { open: async () => cache } };
}
function response(value, extras = {}) { return { ok: true, type: 'basic', value, clone() { return response(value); }, ...extras }; }

test('handles only public GET shell/static assets of this app', () => {
    for (const path of ['./', 'index.php?v=3', 'tutorial.php', 'style.css?v=99', 'workspace.css', 'i18n.js', 'images/icon-192.png']) assert.equal(shouldHandle(request(path), base), true, path);
    for (const path of ['api.php?action=check_status', 'api_ocr_sketch.php', 'api_mp_create.php', 'api_mp_check.php', 'api_mp_webhook.php', 'lib_db.php', 'database/keepai.db', 'uploads/photo.png', '../keepai/api/auth.php', '../office/index.php', 'https://accounts.google.com/gsi/client', 'https://cdn.jsdelivr.net/library.js']) assert.equal(shouldHandle(request(path), base), false, path);
    assert.equal(shouldHandle(request('index.php', 'POST'), base), false);
});

test('versioned assets share one app-specific cache key', () => {
    assert.equal(cacheKey(request('style.css?v=1')), cacheKey(request('style.css?v=2')));
    assert.equal(cacheKey(request('script.js?v=2')), 'https://4u.ia.br/app/cortefacil/script.js');
});

test('network-first returns fresh assets and falls back to cached copy offline', async () => {
    const f = cacheFixture(); const req = request('script.js?v=2');
    f.store.set(cacheKey(req), response('old'));
    const fresh = await networkFirst(req, f.storage, async () => response('new'), base);
    assert.equal(fresh.value, 'new');
    const offline = await networkFirst(req, f.storage, async () => { throw Error('offline'); }, base);
    assert.equal(offline.value, 'new');
});

test('missing root URL falls back to cached index; errors and redirects are not cached', async () => {
    const f = cacheFixture(); f.store.set('https://4u.ia.br/app/cortefacil/index.php', response('shell'));
    const shell = await networkFirst(request('./'), f.storage, async () => { throw Error('offline'); }, base);
    assert.equal(shell.value, 'shell');
    await networkFirst(request('style.css'), f.storage, async () => response('404', { ok: false }), base);
    assert.equal(f.store.has(cacheKey(request('style.css'))), false);
    await networkFirst(request('script.js'), f.storage, async () => response('login', { redirected: true }), base);
    assert.equal(f.store.has(cacheKey(request('script.js'))), false);
});

test('activation removes only old Corte Fácil caches', async () => {
    const deleted = [];
    await cleanOwnCaches({ keys: async () => ['corte-v2', CACHE_NAME, 'tinylab-v9', 'office-v1', 'keepai-v4'], delete: async name => { deleted.push(name); return true; } });
    assert.deepEqual(deleted, ['corte-v2']);
});

test('fetch event does not intercept APIs, POST, other apps or external origins', () => {
    const listeners = {};
    vm.runInNewContext(fs.readFileSync(require.resolve('../sw.js'), 'utf8'), { URL, self: { location: { href: base }, addEventListener(name, callback) { listeners[name] = callback; } } });
    for (const req of [request('api.php'), request('api_ocr_sketch.php', 'POST'), request('../keepai/api/ai_vision.php'), request('https://example.com/x.js')]) {
        let intercepted = false;
        listeners.fetch({ request: req, respondWith() { intercepted = true; } });
        assert.equal(intercepted, false, req.url);
    }
    assert.ok(listeners.install); assert.ok(listeners.activate);
});
