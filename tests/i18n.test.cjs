'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createI18n, translateText, normalizeLanguage } = require('../i18n.js');

function fixture(initial = {}, options = {}) {
    const values = new Map(Object.entries(initial)), mutations = [], events = [], elements = [], texts = [];
    let observer;
    class Element {
        constructor(tag, attrs = {}, parent = null) { this.nodeType = 1; this.tagName = tag.toUpperCase(); this.attrs = { ...attrs }; this.parentElement = parent; elements.push(this); }
        hasAttribute(name) { return Object.hasOwn(this.attrs, name); }
        getAttribute(name) { return this.attrs[name] ?? null; }
        setAttribute(name, value) { mutations.push({ observed: Boolean(observer?.active), target: name }); this.attrs[name] = String(value); }
        closest(selector) { for (let node = this; node; node = node.parentElement) { for (const part of selector.split(',')) { const s = part.trim(); if (s[0] === '[' && node.hasAttribute(s.slice(1, -1))) return node; if (s[0] === '#' && node.attrs.id === s.slice(1)) return node; if (s.toUpperCase() === node.tagName) return node; } } return null; }
        contains(node) { for (let p = node.parentElement; p; p = p.parentElement) if (p === this) return true; return false; }
        querySelectorAll(selector) { const attrs = [...selector.matchAll(/\[([^\]]+)\]/g)].map(m => m[1]); return elements.filter(e => this.contains(e) && attrs.some(a => e.hasAttribute(a))); }
    }
    class Text {
        constructor(value, parent) { this.nodeType = 3; this.parentElement = parent; this.value = value; texts.push(this); }
        get nodeValue() { return this.value; }
        set nodeValue(value) { mutations.push({ observed: Boolean(observer?.active), target: 'text' }); this.value = value; }
    }
    const html = new Element('html'); html.lang = 'pt-BR';
    const body = new Element('body', {}, html);
    const label = new Element('button', {}, body); const labelText = new Text('  Peças  ', label);
    const input = new Element('input', { placeholder: 'Ex: João Silva' }, body); input.value = 'Peças';
    const data = new Element('span', { 'data-user-content': '' }, body); const userText = new Text('Chapa', data);
    const textarea = new Element('textarea', {}, body); const typed = new Text('Peças', textarea);
    const languageButton = new Element('button', { 'data-corte-lang': 'en' }, body);
    const listeners = {};
    const doc = {
        nodeType: 9, readyState: 'complete', documentElement: html, body,
        addEventListener(name, callback) { listeners[name] = callback; },
        querySelectorAll(selector) { return html.querySelectorAll(selector); },
        createTreeWalker(root) { const nodes = texts.filter(t => root.contains(t)); let i = 0; return { nextNode() { return nodes[i++] || null; } }; }
    };
    const win = {
        document: doc, NodeFilter: { SHOW_TEXT: 4 },
        localStorage: { getItem(key) { return values.get(key) || null; }, setItem(key, value) { values.set(key, value); } },
        addEventListener() {}, dispatchEvent(event) { events.push(event); }, CustomEvent: class { constructor(type, args) { this.type = type; this.detail = args.detail; } },
        MutationObserver: class { constructor(callback) { this.callback = callback; this.active = false; observer = this; } observe() { this.active = true; } disconnect() { this.active = false; } }
    };
    if (options.blockStorage) Object.defineProperty(win, 'localStorage', { get() { throw Error('SecurityError'); } });
    const api = createI18n(win);
    return { api, values, events, mutations, label, labelText, input, userText, typed, languageButton, observer, body, doc, win };
}

test('locale normalization and exact reversible text preserve whitespace and units', () => {
    assert.equal(normalizeLanguage('en-US'), 'en');
    assert.equal(normalizeLanguage('pt'), 'pt-BR');
    assert.equal(translateText('  Peças  ', 'en'), '  Parts  ');
    assert.equal(translateText('  Parts  ', 'pt-BR'), '  Peças  ');
    assert.equal(translateText('2750 × 1830 mm', 'en'), '2750 × 1830 mm');
    assert.equal(translateText('Chapa 2 de 4', 'en'), 'Sheet 2 of 4');
    assert.equal(translateText('Sheet 2 of 4', 'pt-BR'), 'Chapa 2 de 4');
    assert.equal(translateText('100 Créditos', 'en'), '100 credits');
    assert.equal(translateText('Cliente Fabiano / MDF 15 mm', 'en'), 'Cliente Fabiano / MDF 15 mm');
});

test('PT→EN→PT preserves nodes, user input and protected labels', () => {
    const f = fixture();
    const originalButton = f.label;
    f.api.setLanguage('en');
    assert.equal(f.labelText.nodeValue, '  Parts  ');
    assert.equal(f.label, originalButton);
    assert.equal(f.input.getAttribute('placeholder'), 'E.g. John Smith');
    assert.equal(f.input.value, 'Peças');
    assert.equal(f.userText.nodeValue, 'Chapa');
    assert.equal(f.typed.nodeValue, 'Peças');
    assert.equal(f.languageButton.getAttribute('aria-pressed'), 'true');
    assert.equal(f.doc.documentElement.lang, 'en');
    f.api.setLanguage('pt-BR');
    assert.equal(f.labelText.nodeValue, '  Peças  ');
    assert.equal(f.input.getAttribute('placeholder'), 'Ex: João Silva');
    assert.equal(f.input.value, 'Peças');
    assert.equal(f.languageButton.getAttribute('aria-pressed'), 'false');
    assert.equal(f.events.length, 2);
    assert.equal(f.events[0].type, 'cortefacil:languagechange');
    assert.equal(f.values.get('cortefacil_lang'), 'pt-BR');
});

test('stored app locale takes precedence over ecosystem locale; new locale is shared', () => {
    const f = fixture({ cortefacil_lang: 'en', '4u_lang': 'pt' });
    assert.equal(f.api.language, 'en');
    assert.equal(f.labelText.nodeValue, '  Parts  ');
    f.api.setLanguage('pt-BR');
    assert.equal(f.values.get('4u_lang'), 'pt');
    assert.equal(f.values.get('lang'), 'pt');
    assert.equal(fixture({ '4u_lang': 'en' }).api.language, 'en');
});

test('dynamic text is translated and all self-writes happen with observer disconnected', async () => {
    const f = fixture();
    f.api.setLanguage('en');
    f.labelText.nodeValue = 'Chapa 3 de 5';
    f.mutations.length = 0;
    f.observer.callback([{ type: 'characterData' }]);
    await Promise.resolve();
    assert.equal(f.labelText.nodeValue, 'Sheet 3 of 5');
    assert.ok(f.mutations.length > 0);
    assert.ok(f.mutations.every(m => !m.observed));
    assert.equal(f.observer.active, true);
    f.api.setLanguage('pt-BR');
    assert.equal(f.labelText.nodeValue, 'Chapa 3 de 5');
});

test('unavailable browser storage does not prevent localization', () => {
    const f = fixture({}, { blockStorage: true });
    f.api.setLanguage('en');
    assert.equal(f.api.language, 'en');
    assert.equal(f.api.t('Plano', 'Plan'), 'Plan');
    assert.equal(f.labelText.nodeValue, '  Parts  ');
});
