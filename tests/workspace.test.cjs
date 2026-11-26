'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('../workspace-core.js');

const basePiece = (overrides = {}) => ({
    id: 1, label: 'Prateleira', width: 500, height: 300, quantity: 2,
    edgeBanding: { top: true, bottom: false, left: false, right: false },
    ...overrides
});
const sheet = (overrides = {}) => ({ width: 1000, height: 600, kerf: 4, trim: 10, allowRotation: false, ...overrides });

test('contagem distingue tipos de peças e unidades', () => {
    assert.deepEqual(core.pieceSummary([basePiece(), basePiece({ id: 2, quantity: 8 })]), { types: 2, units: 10 });
    assert.deepEqual(core.pieceSummary([]), { types: 0, units: 0 });
});

test('identificador novo não colide após remover e adicionar peças', () => {
    const pieces = [basePiece(), basePiece({ id: 3 }), basePiece({ id: 8 })];
    assert.equal(core.nextPieceId(pieces), 9);
    pieces.splice(1, 1);
    assert.equal(core.nextPieceId(pieces), 9);
    assert.equal(core.nextPieceId([]), 1);
});

test('nomes e dados de projeto não são interpretados como HTML', () => {
    const escaped = core.escapeHtml('<img src=x onerror="alert(1)"> & \'teste\'');
    assert.ok(!escaped.includes('<img'));
    assert.ok(escaped.includes('&lt;'));
    assert.ok(escaped.includes('&amp;'));
    assert.ok(escaped.includes('&quot;'));
    assert.ok(!escaped.includes("'teste'"));
});

test('rótulo completo permanece quando cabe no retângulo', () => {
    const measure = value => String(value).length * 7;
    assert.equal(core.fitCanvasLabel('#3', 30, measure), '#3');
    assert.equal(core.fitCanvasLabel('Porta', 50, measure), 'Porta');
});

test('nome longo é truncado sem ultrapassar a área da peça', () => {
    const measure = value => [...String(value)].length * 7;
    const label = core.fitCanvasLabel('Prateleira inferior do armário', 70, measure);
    assert.ok(label.endsWith('…'));
    assert.ok(measure(label) <= 70);
});

test('peça estreita não recebe rótulo impossível de desenhar', () => {
    assert.equal(core.fitCanvasLabel('#12', 2, s => s.length * 7), '');
    assert.equal(core.fitCanvasLabel('#12', 0, s => s.length * 7), '');
});

test('seleção do mapa encontra a peça por geometria', () => {
    const one = { x: 10, y: 20, w: 100, h: 40, piece: { id: 1 } };
    const two = { x: 120, y: 20, w: 80, h: 40, piece: { id: 2 } };
    assert.equal(core.hitTestRect([one, two], 25, 30), one);
    assert.equal(core.hitTestRect([one, two], 160, 30), two);
    assert.equal(core.hitTestRect([one, two], 115, 30), null);
    assert.equal(core.hitTestRect([one, two], 25, 80), null);
});

test('dimensões válidas consideram área útil da chapa', () => {
    assert.equal(core.validatePiece(basePiece(), sheet()).valid, true);
    assert.equal(core.validatePiece(basePiece({ width: 980, height: 580 }), sheet()).valid, true);
    const invalid = core.validatePiece(basePiece({ width: 981, height: 580 }), sheet());
    assert.equal(invalid.valid, false);
    assert.ok(invalid.error);
});

test('rotação é aplicada somente quando autorizada', () => {
    const piece = basePiece({ width: 500, height: 900 });
    assert.equal(core.validatePiece(piece, sheet({ allowRotation: false })).valid, false);
    assert.equal(core.validatePiece(piece, sheet({ allowRotation: true })).valid, true);
});

for (const [name, values] of [
    ['largura zero', { width: 0 }],
    ['altura negativa', { height: -1 }],
    ['quantidade zero', { quantity: 0 }],
    ['quantidade fracionária', { quantity: 1.5 }],
    ['dimensão infinita', { width: Infinity }],
    ['dimensão não numérica', { height: NaN }]
]) {
    test(`entrada inválida rejeitada: ${name}`, () => {
        assert.equal(core.validatePiece(basePiece(values), sheet()).valid, false);
    });
}

test('refilo que consome a chapa inteira é rejeitado', () => {
    assert.equal(core.validatePiece(basePiece({ width: 1, height: 1 }), sheet({ trim: 501 })).valid, false);
});

test('normalização mantém peças e bordas válidas sem modificar a entrada', () => {
    const input = [basePiece(), basePiece({ id: 1, label: 'Porta', quantity: 4 })];
    const before = JSON.stringify(input);
    const output = core.normalizePieces(input);
    assert.equal(output.length, 2);
    assert.equal(new Set(output.map(p => p.id)).size, 2);
    assert.deepEqual(output[0].edgeBanding, { top: true, bottom: false, left: false, right: false });
    assert.equal(JSON.stringify(input), before);
});

test('normalização cria bordas explícitas quando ausentes', () => {
    const result = core.normalizePieces([{ id: 3, label: 'Vidro', width: 300, height: 200, quantity: 1 }]);
    assert.deepEqual(result[0].edgeBanding, { top: false, bottom: false, left: false, right: false });
});

test('importação rejeita coleção ou dimensões inválidas', () => {
    assert.throws(() => core.normalizePieces({ pieces: [] }));
    assert.throws(() => core.normalizePieces([basePiece({ width: 0 })]));
    assert.throws(() => core.normalizePieces([basePiece({ quantity: Infinity })]));
});
