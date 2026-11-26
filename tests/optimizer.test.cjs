'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const optimizer = require('../optimizer.js');

const mdfTypes = [
    [2100, 550, 1], [2100, 550, 1], [2000, 530, 1],
    [1600, 550, 1], [1600, 550, 1], [775, 500, 4],
    [1020, 395, 4], [390, 180, 4], [450, 140, 8], [340, 140, 8]
];
const flatten = types => types.flatMap(([w, h, quantity], index) => Array.from({ length: quantity }, () => ({
    id: index + 1, label: `Peça ${index + 1}`, w, h
})));
const mdf = flatten(mdfTypes);

function assertValidPlan(plan, pieces, sW, sH, kerf, trim, allowRotation) {
    assert.ok(Array.isArray(plan) && plan.length > 0, 'plano contém chapas');
    const expected = new Map();
    const actual = new Map();
    for (const p of pieces) expected.set(p.id, (expected.get(p.id) || 0) + 1);
    const eps = 1e-6;
    for (const [sheetIndex, sheet] of plan.entries()) {
        assert.ok(sheet.rects.length > 0, `chapa ${sheetIndex + 1} não está vazia`);
        for (const [index, rect] of sheet.rects.entries()) {
            assert.ok(rect.x >= trim - eps && rect.y >= trim - eps, 'peça respeita refilo inicial');
            assert.ok(rect.x + rect.w <= sW - trim + eps, 'peça respeita largura útil');
            assert.ok(rect.y + rect.h <= sH - trim + eps, 'peça respeita altura útil');
            assert.ok(rect.w > 0 && rect.h > 0, 'dimensões físicas positivas');
            actual.set(rect.piece.id, (actual.get(rect.piece.id) || 0) + 1);
            const original = pieces.find(p => p.id === rect.piece.id);
            assert.ok(original, 'nenhuma peça inventada');
            if (rect.rotated) {
                assert.ok(allowRotation, 'rotação autorizada');
                assert.equal(rect.w, original.h);
                assert.equal(rect.h, original.w);
            } else {
                assert.equal(rect.w, original.w);
                assert.equal(rect.h, original.h);
            }
            for (const other of sheet.rects.slice(index + 1)) {
                const separated = rect.x + rect.w + kerf <= other.x + eps ||
                    other.x + other.w + kerf <= rect.x + eps ||
                    rect.y + rect.h + kerf <= other.y + eps ||
                    other.y + other.h + kerf <= rect.y + eps;
                assert.ok(separated, `chapa ${sheetIndex + 1}: #${rect.piece.id} e #${other.piece.id} não sobrepõem nem consomem a serra`);
            }
        }
    }
    assert.deepEqual(actual, expected, 'cada unidade é alocada exatamente uma vez');
}

for (const algo of ['auto', 'maxrects', 'guillotine', 'shelf']) {
    test(`${algo}: exemplo MDF mantém 33 unidades dentro das chapas e sem sobreposição`, () => {
        const plan = optimizer.runMultiHeuristicOptimization(mdf, 2750, 1830, 4, 10, true, algo);
        assertValidPlan(plan, mdf, 2750, 1830, 4, 10, true);
        assert.ok(plan.length <= 4, 'exemplo mantém aproveitamento razoável sem fixar solução inválida de duas chapas');
    });
}

for (const algo of ['auto', 'maxrects', 'guillotine', 'shelf']) {
    test(`${algo}: preserva sentido das peças quando rotação está desativada`, () => {
        const pieces = flatten([[70, 25, 3], [25, 70, 2], [15, 15, 4]]);
        const plan = optimizer.runMultiHeuristicOptimization(pieces, 100, 100, 2, 5, false, algo);
        assertValidPlan(plan, pieces, 100, 100, 2, 5, false);
        assert.ok(plan.every(s => s.rects.every(r => !r.rotated)));
    });
}

test('MAXRECTS elimina o retângulo livre sobreposto que duplicava área utilizável', () => {
    const pieces = flatten([[60, 60, 1], [40, 100, 1], [100, 40, 1]]);
    const plan = optimizer.packMaxRects(pieces, 100, 100, 0, 0, false);
    assertValidPlan(plan, pieces, 100, 100, 0, 0, false);
    assert.ok(plan.length >= 2, 'área total de 11600 não cabe em chapa de 10000');
});

test('AUTO não modifica a lista de peças recebida', () => {
    const pieces = flatten([[80, 30, 2], [20, 50, 3]]);
    const before = JSON.stringify(pieces);
    optimizer.runMultiHeuristicOptimization(pieces, 100, 100, 2, 0, true, 'auto');
    assert.equal(JSON.stringify(pieces), before);
});

module.exports = { assertValidPlan };

for (const [name, pack] of Object.entries({ guillotine: optimizer.packGuillotine, maxrects: optimizer.packMaxRects, shelf: optimizer.packShelf })) {
    test(`${name}: peça que só cabe girada respeita refilo e a última borda não exige serra extra`, () => {
        const pieces = [{ id: 1, label: 'Painel', w: 45, h: 90 }];
        const plan = pack(pieces, 100, 60, 4, 5, true);
        assertValidPlan(plan, pieces, 100, 60, 4, 5, true);
        assert.equal(plan.length, 1);
        assert.equal(plan[0].rects[0].rotated, true);
        assert.throws(() => pack(pieces, 100, 60, 4, 5, false));
    });
    test(`${name}: dimensões inválidas não são empacotadas fora da chapa`, () => {
        assert.throws(() => pack([{ id: 1, w: 95, h: 95 }], 100, 100, 4, 5, true));
        assert.throws(() => pack([{ id: 1, w: 0, h: 20 }], 100, 100, 4, 5, true));
        assert.throws(() => pack([{ id: 1, w: 20, h: Infinity }], 100, 100, 4, 5, true));
        assert.throws(() => pack([{ id: 1, w: 20, h: 20 }], 100, 100, -1, 5, true));
        assert.throws(() => pack([{ id: 1, w: 20, h: 20 }], 100, 100, 4, 50, true));
    });
    test(`${name}: projeto vazio não gera chapa vazia`, () => {
        assert.deepEqual(pack([], 100, 100, 2, 5, false), []);
    });
}

test('geometrias variadas mantêm área útil, espaçamento e quantidades em todos os modos', () => {
    let seed = 2762026;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 0x100000000; };
    for (let sample = 0; sample < 12; sample++) {
        const pieces = Array.from({ length: 12 }, (_, index) => ({
            id: index + 1,
            w: 5 + Math.floor(random() * 60) + (sample % 2 ? 0.25 : 0),
            h: 5 + Math.floor(random() * 60) + (sample % 3 ? 0.5 : 0)
        }));
        for (const algo of ['auto', 'guillotine', 'maxrects', 'shelf']) {
            const kerf = sample % 3 ? 1.5 : 0;
            const plan = optimizer.runMultiHeuristicOptimization(pieces, 100, 90, kerf, 3, sample % 2 === 0, algo);
            assertValidPlan(plan, pieces, 100, 90, kerf, 3, sample % 2 === 0);
        }
    }
});
