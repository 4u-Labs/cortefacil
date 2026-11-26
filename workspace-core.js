(function (root, factory) {
    const api = factory();
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.CorteWorkspace = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';
    const MAX_TYPES = 500;
    const MAX_UNITS = 5000;
    const COLORS = ['#52b788', '#74b9b0', '#b8a6cf', '#cfb58c', '#7dace0', '#d89aa5'];
    function escapeHtml(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }
    function pieceSummary(pieces) {
        return { types: pieces.length, units: pieces.reduce((sum, p) => sum + Number(p.quantity || 0), 0) };
    }
    function nextPieceId(pieces) {
        return pieces.reduce((max, p) => Number.isSafeInteger(Number(p.id)) && Number(p.id) > max ? Number(p.id) : max, 0) + 1;
    }
    function fitCanvasLabel(text, maxWidth, measure) {
        text = String(text);
        if (!(maxWidth > 0)) return '';
        if (measure(text) <= maxWidth) return text;
        if (measure('…') > maxWidth) return '';
        const chars = Array.from(text);
        while (chars.length && measure(chars.join('') + '…') > maxWidth) chars.pop();
        return chars.join('') + '…';
    }
    function hitTestRect(rects, x, y) {
        for (let i = rects.length - 1; i >= 0; i--) {
            const r = rects[i];
            if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return r;
        }
        return null;
    }
    function validatePiece(piece, sheet) {
        const w = Number(piece.width), h = Number(piece.height), q = Number(piece.quantity);
        if (![w,h,q].every(Number.isFinite) || w <= 0 || h <= 0 || w > 1e6 || h > 1e6 || !Number.isInteger(q) || q <= 0 || q > MAX_UNITS) return { valid:false, error:'dimensions' };
        const sw = Number(sheet.width), sh = Number(sheet.height), trim = Number(sheet.trim || 0), kerf = Number(sheet.kerf || 0);
        if (![sw,sh,trim,kerf].every(Number.isFinite) || sw <= 0 || sh <= 0 || trim < 0 || kerf < 0 || trim * 2 >= Math.min(sw,sh)) return {valid:false,error:'sheet'};
        const usableW = sw - trim * 2, usableH = sh - trim * 2;
        const fits = w <= usableW && h <= usableH;
        const rotated = sheet.allowRotation !== false && h <= usableW && w <= usableH;
        return fits || rotated ? {valid:true,error:null} : {valid:false,error:'fit'};
    }
    function normalizePieces(raw) {
        if (!Array.isArray(raw) || raw.length > MAX_TYPES) throw new Error('Invalid piece collection');
        const ids = new Set();
        let next = raw.reduce((max,p) => Number.isSafeInteger(Number(p?.id)) && Number(p.id)>max && Number(p.id)<1e9 ? Number(p.id) : max,0)+1;
        const pieces = raw.map((p,i) => {
            if (!p || typeof p !== 'object') throw new Error('Invalid piece');
            const width=Number(p.width),height=Number(p.height),quantity=Number(p.quantity);
            if (![width,height,quantity].every(Number.isFinite) || width<=0 || height<=0 || width>1e6 || height>1e6 || !Number.isInteger(quantity) || quantity<=0 || quantity>MAX_UNITS) throw new Error('Invalid dimensions');
            let id=Number(p.id);
            if (!Number.isSafeInteger(id)||id<=0||id>=1e9||ids.has(id)) id=next++;
            ids.add(id);
            const edges=p.edgeBanding||{};
            return {id,label:String(p.label || 'Peça '+id).slice(0,160),width,height,quantity,color:/^#[a-f\d]{6}$/i.test(p.color)?p.color:COLORS[i%COLORS.length],edgeBanding:{top:edges.top===true,bottom:edges.bottom===true,left:edges.left===true,right:edges.right===true}};
        });
        if (pieceSummary(pieces).units > MAX_UNITS) throw new Error('Too many pieces');
        return pieces;
    }
    function mountDialogs(doc) {
        const dialogs=Array.from(doc.querySelectorAll('.modal'));
        dialogs.forEach(dialog=>doc.body.appendChild(dialog));
        return dialogs;
    }
    return {mountDialogs,MAX_TYPES,MAX_UNITS,COLORS,escapeHtml,pieceSummary,nextPieceId,fitCanvasLabel,hitTestRect,validatePiece,normalizePieces};
});
