(function (root, factory) {
    const api = factory();
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.CorteOptimizer = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';
    const EPSILON = 1e-7;

    function prepare(flatPieces, sW, sH, kerf, trim, allowRotate) {
        sW = Number(sW); sH = Number(sH); kerf = Number(kerf); trim = Number(trim);
        if (!Array.isArray(flatPieces) || flatPieces.length > 5000) throw new Error('Lista de peças inválida.');
        if (![sW, sH, kerf, trim].every(Number.isFinite) || sW <= 0 || sH <= 0 || kerf < 0 || trim < 0 || trim * 2 >= Math.min(sW, sH)) {
            throw new Error('Dimensões da chapa, serra ou refilo inválidos.');
        }
        const usableW = sW - trim * 2, usableH = sH - trim * 2;
        const pieces = flatPieces.map(p => {
            const w = Number(p && p.w), h = Number(p && p.h);
            if (![w, h].every(Number.isFinite) || w <= 0 || h <= 0) throw new Error('Dimensões de peça inválidas.');
            const fits = w <= usableW + EPSILON && h <= usableH + EPSILON;
            const rotatedFits = allowRotate && h <= usableW + EPSILON && w <= usableH + EPSILON;
            if (!fits && !rotatedFits) throw new Error('Uma peça não cabe na área útil da chapa. Confira o refilo e a rotação.');
            return { ...p, w, h };
        });
        return { pieces, sW, sH, kerf, trim, allowRotate, usableW, usableH };
    }

    function orientations(piece, allowRotate) {
        const values = [{ w: piece.w, h: piece.h, rotated: false }];
        if (allowRotate && piece.w !== piece.h) values.push({ w: piece.h, h: piece.w, rotated: true });
        return values;
    }

    // Disjoint guillotine splits preserve straight cuts and reserve kerf between pieces.
    function packGuillotine(flatPieces, sW, sH, kerf, trim, allowRotate, splitRule = 'SLAS') {
        const input = prepare(flatPieces, sW, sH, kerf, trim, allowRotate);
        const sheets = [];
        const createSheet = () => ({ freeRects: [{ x: input.trim, y: input.trim, w: input.usableW, h: input.usableH }], rects: [] });
        for (const piece of input.pieces) {
            let best = null;
            function findPlacement(sheet, sheetIndex) {
                for (let index = 0; index < sheet.freeRects.length; index++) {
                    const free = sheet.freeRects[index];
                    for (const orientation of orientations(piece, input.allowRotate)) {
                        if (orientation.w > free.w + EPSILON || orientation.h > free.h + EPSILON) continue;
                        const score = Math.min(free.w - orientation.w, free.h - orientation.h);
                        if (!best || score < best.score) best = { sheetIndex, index, score, ...orientation };
                    }
                }
            }
            for (let index = 0; index < sheets.length; index++) {
                findPlacement(sheets[index], index);
                if (best) break;
            }
            if (!best) {
                sheets.push(createSheet());
                findPlacement(sheets[sheets.length - 1], sheets.length - 1);
            }
            const sheet = sheets[best.sheetIndex], free = sheet.freeRects.splice(best.index, 1)[0];
            sheet.rects.push({ x: free.x, y: free.y, w: best.w, h: best.h, rotated: best.rotated, piece });
            const wRemain = free.w - best.w - input.kerf, hRemain = free.h - best.h - input.kerf;
            if (splitRule === 'SLAS' || splitRule === 'horizontal') {
                if (wRemain > EPSILON) sheet.freeRects.push({ x: free.x + best.w + input.kerf, y: free.y, w: wRemain, h: best.h });
                if (hRemain > EPSILON) sheet.freeRects.push({ x: free.x, y: free.y + best.h + input.kerf, w: free.w, h: hRemain });
            } else {
                if (hRemain > EPSILON) sheet.freeRects.push({ x: free.x, y: free.y + best.h + input.kerf, w: best.w, h: hRemain });
                if (wRemain > EPSILON) sheet.freeRects.push({ x: free.x + best.w + input.kerf, y: free.y, w: wRemain, h: free.h });
            }
        }
        return sheets;
    }

    function contains(outer, inner) {
        return inner.x >= outer.x - EPSILON && inner.y >= outer.y - EPSILON &&
            inner.x + inner.w <= outer.x + outer.w + EPSILON && inner.y + inner.h <= outer.y + outer.h + EPSILON;
    }

    // Every free rectangle must be split against the occupied region, not only the
    // rectangle selected for placement. Free rectangles can overlap one another;
    // none of them may overlap an already placed piece or its kerf reservation.
    function splitAndPrune(freeRects, used) {
        const split = [];
        for (const free of freeRects) {
            const right = free.x + free.w, bottom = free.y + free.h;
            const usedRight = used.x + used.w, usedBottom = used.y + used.h;
            if (used.x >= right - EPSILON || usedRight <= free.x + EPSILON || used.y >= bottom - EPSILON || usedBottom <= free.y + EPSILON) {
                split.push(free);
                continue;
            }
            if (used.x > free.x + EPSILON) split.push({ x: free.x, y: free.y, w: used.x - free.x, h: free.h });
            if (usedRight < right - EPSILON) split.push({ x: usedRight, y: free.y, w: right - usedRight, h: free.h });
            if (used.y > free.y + EPSILON) split.push({ x: free.x, y: free.y, w: free.w, h: used.y - free.y });
            if (usedBottom < bottom - EPSILON) split.push({ x: free.x, y: usedBottom, w: free.w, h: bottom - usedBottom });
        }
        const pruned = [];
        for (let index = 0; index < split.length; index++) {
            const candidate = split[index];
            if (candidate.w <= EPSILON || candidate.h <= EPSILON) continue;
            const redundant = split.some((other, otherIndex) => otherIndex !== index && contains(other, candidate) &&
                (!contains(candidate, other) || otherIndex < index));
            if (!redundant) pruned.push(candidate);
        }
        return pruned;
    }

    function packMaxRects(flatPieces, sW, sH, kerf, trim, allowRotate) {
        const input = prepare(flatPieces, sW, sH, kerf, trim, allowRotate);
        const sheets = [];
        // Adding kerf to the virtual right/bottom boundary permits a final piece
        // to touch the useful boundary without requiring a cut beyond the sheet.
        const createSheet = () => ({ freeRects: [{ x: input.trim, y: input.trim, w: input.usableW + input.kerf, h: input.usableH + input.kerf }], rects: [] });
        for (const piece of input.pieces) {
            let best = null;
            function findPlacement(sheet, sheetIndex) {
                for (const free of sheet.freeRects) {
                    for (const orientation of orientations(piece, input.allowRotate)) {
                        const packedW = orientation.w + input.kerf, packedH = orientation.h + input.kerf;
                        if (packedW > free.w + EPSILON || packedH > free.h + EPSILON) continue;
                        const short = Math.min(free.w - packedW, free.h - packedH);
                        const long = Math.max(free.w - packedW, free.h - packedH);
                        if (!best || short < best.short - EPSILON || (Math.abs(short - best.short) <= EPSILON && long < best.long)) {
                            best = { sheetIndex, x: free.x, y: free.y, short, long, ...orientation };
                        }
                    }
                }
            }
            for (let index = 0; index < sheets.length; index++) {
                findPlacement(sheets[index], index);
                if (best) break;
            }
            if (!best) {
                sheets.push(createSheet());
                findPlacement(sheets[sheets.length - 1], sheets.length - 1);
            }
            const sheet = sheets[best.sheetIndex];
            const placed = { x: best.x, y: best.y, w: best.w, h: best.h, rotated: best.rotated, piece };
            sheet.rects.push(placed);
            sheet.freeRects = splitAndPrune(sheet.freeRects, { x: best.x, y: best.y, w: best.w + input.kerf, h: best.h + input.kerf });
        }
        return sheets;
    }

    function packShelf(flatPieces, sW, sH, kerf, trim, allowRotate) {
        const input = prepare(flatPieces, sW, sH, kerf, trim, allowRotate);
        const sheets = [];
        const right = input.sW - input.trim, bottom = input.sH - input.trim;
        const createSheet = () => ({ shelves: [], rects: [], freeRects: [], nextY: input.trim });
        for (const piece of input.pieces) {
            let best = null;
            function findPlacement(sheet, sheetIndex) {
                for (let index = 0; index < sheet.shelves.length; index++) {
                    const shelf = sheet.shelves[index];
                    for (const orientation of orientations(piece, input.allowRotate)) {
                        if (orientation.h <= shelf.h + EPSILON && shelf.nextX + orientation.w <= right + EPSILON) {
                            const waste = shelf.h - orientation.h;
                            if (!best || waste < best.waste) best = { sheetIndex, shelfIndex: index, newShelf: false, waste, ...orientation };
                        }
                    }
                }
                if (best) return;
                for (const orientation of orientations(piece, input.allowRotate)) {
                    if (orientation.w <= input.usableW + EPSILON && sheet.nextY + orientation.h <= bottom + EPSILON) {
                        if (!best || orientation.h < best.h) best = { sheetIndex, newShelf: true, ...orientation };
                    }
                }
            }
            for (let index = 0; index < sheets.length; index++) {
                findPlacement(sheets[index], index);
                if (best) break;
            }
            if (!best) {
                sheets.push(createSheet());
                findPlacement(sheets[sheets.length - 1], sheets.length - 1);
            }
            const sheet = sheets[best.sheetIndex];
            if (best.newShelf) {
                sheet.shelves.push({ y: sheet.nextY, h: best.h, nextX: input.trim });
                sheet.nextY += best.h + input.kerf;
                best.shelfIndex = sheet.shelves.length - 1;
            }
            const shelf = sheet.shelves[best.shelfIndex];
            sheet.rects.push({ x: shelf.nextX, y: shelf.y, w: best.w, h: best.h, rotated: best.rotated, piece });
            shelf.nextX += best.w + input.kerf;
        }
        return sheets;
    }

    function runMultiHeuristicOptimization(flatPieces, sW, sH, kerf, trim, allowRotate, forcedAlgo = 'auto') {
        const input = prepare(flatPieces, sW, sH, kerf, trim, allowRotate);
        if (!input.pieces.length) return [];
        if (forcedAlgo === 'guillotine') return packGuillotine(input.pieces, sW, sH, kerf, trim, allowRotate, 'SLAS');
        if (forcedAlgo === 'maxrects') return packMaxRects(input.pieces, sW, sH, kerf, trim, allowRotate);
        if (forcedAlgo === 'shelf') return packShelf(input.pieces, sW, sH, kerf, trim, allowRotate);
        const strategies = [
            { sort: (a, b) => b.w * b.h - a.w * a.h, pack: packMaxRects },
            { sort: (a, b) => Math.max(b.w, b.h) - Math.max(a.w, a.h), pack: (p, ...args) => packGuillotine(p, ...args, 'horizontal') },
            { sort: (a, b) => Math.max(b.w, b.h) - Math.max(a.w, a.h), pack: (p, ...args) => packGuillotine(p, ...args, 'vertical') },
            { sort: (a, b) => b.w + b.h - a.w - a.h, pack: packMaxRects }
        ];
        let best = null;
        for (const strategy of strategies) {
            const result = strategy.pack([...input.pieces].sort(strategy.sort), sW, sH, kerf, trim, allowRotate);
            if (!best || result.length < best.length) best = result;
        }
        return best;
    }

    return { packGuillotine, packMaxRects, packShelf, runMultiHeuristicOptimization };
});
