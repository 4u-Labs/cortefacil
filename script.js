/**
 * Script Principal - Corte Fácil Pro Edition
 * Otimizador Universal de Chapas Planas 2D (Madeira, Vidro, Aço/Alumínio, Acrílico)
 * Padrão 4U.IA.BR Premium
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos do DOM ---
    const clientNameInput = document.getElementById('clientName');
    const projectNameInput = document.getElementById('projectName');
    const materialTypeSelect = document.getElementById('materialType');
    
    const sheetWidthInput = document.getElementById('sheetWidth');
    const sheetHeightInput = document.getElementById('sheetHeight');
    const kerfInput = document.getElementById('kerf');
    const trimMarginInput = document.getElementById('trimMargin');
    const allowRotationCheckbox = document.getElementById('allowRotation');
    const cutAlgorithmSelect = document.getElementById('cutAlgorithm');

    const newPieceLabelInput = document.getElementById('newPieceLabel');
    const newPieceWidthInput = document.getElementById('newPieceWidth');
    const newPieceHeightInput = document.getElementById('newPieceHeight');
    const newPieceQuantityInput = document.getElementById('newPieceQuantity');
    const confirmAddPieceBtn = document.getElementById('confirmAddPieceBtn');

    const edgeTop = document.getElementById('edgeTop');
    const edgeBottom = document.getElementById('edgeBottom');
    const edgeLeft = document.getElementById('edgeLeft');
    const edgeRight = document.getElementById('edgeRight');
    const edgeBandingBox = document.getElementById('edgeBandingBox');

    const pieceTableBody = document.getElementById('pieceTableBody');
    const pieceCountSpan = document.getElementById('pieceCount');
    const clearAllPiecesBtn = document.getElementById('clearAllPiecesBtn');

    const sheetPriceInput = document.getElementById('sheetPrice');
    const edgePriceInput = document.getElementById('edgePrice');
    const edgePriceGroup = document.getElementById('edgePriceGroup');

    const optimizeBtn = document.getElementById('optimizeBtn');
    const printPlanBtn = document.getElementById('printPlanBtn');
    const cutPlanOutput = document.getElementById('cutPlanOutput');
    const wasteInfo = document.getElementById('wasteInfo');
    const metricsGrid = document.getElementById('metricsGrid');
    const zoomToolbar = document.getElementById('zoomToolbar');

    const mainLogo = document.getElementById('mainLogo');
    const creditBalanceSpan = document.getElementById('creditBalance');
    const topUpBtn = document.getElementById('topUpBtn');
    const paymentModal = document.getElementById('paymentModal');
    const closePaymentBtn = document.getElementById('closePaymentModal');

    const bonusModal = document.getElementById('bonusModal');
    const bonusPasswordInput = document.getElementById('bonusPassword');
    const submitBonusBtn = document.getElementById('submitBonusPassword');
    const closeBonusBtn = document.getElementById('closeBonusModal');

    // --- Paleta de Cores Elegante para Peças ---
    const PIECE_COLORS = [
        '#50fa7b', '#8be9fd', '#ff79c6', '#bd93f9', '#f1fa8c', 
        '#ffb86c', '#00e5ff', '#a855f7', '#ec4899', '#3b82f6',
        '#10b981', '#f59e0b', '#06b6d4', '#6366f1', '#14b8a6'
    ];

    // --- Estado da Aplicação ---
    let appState = {
        pieces: [],
        results: null,
        credits: 0,
        isPro: false,
        bonusActive: false,
        isSaved: true,
        canvasZoom: 1.0,
        showLabels: true,
        material: 'wood'
    };

    // --- Utilitários ---
    function showToast(msg, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = msg;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 4500);
    }

    async function getFingerprint() {
        let fp = localStorage.getItem('user_fingerprint');
        if (!fp) {
            fp = 'u_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('user_fingerprint', fp);
        }
        return fp;
    }

    // --- Confirmação Dupla ---
    let confirmCallback = null;
    function customConfirm(msg, callback) {
        confirmCallback = callback;
        const modal = document.getElementById('confirmModal');
        const msgElem = document.getElementById('confirmMessage');
        if (msgElem) msgElem.innerText = msg;
        if (modal) modal.style.display = 'flex';
    }

    const btnConfirmCancel = document.getElementById('btnConfirmCancel');
    if (btnConfirmCancel) {
        btnConfirmCancel.onclick = () => {
            const modal = document.getElementById('confirmModal');
            if (modal) modal.style.display = 'none';
            confirmCallback = null;
        };
    }

    const btnConfirmProceed = document.getElementById('btnConfirmProceed');
    if (btnConfirmProceed) {
        btnConfirmProceed.onclick = () => {
            if (confirmCallback) confirmCallback();
            const modal = document.getElementById('confirmModal');
            if (modal) modal.style.display = 'none';
            confirmCallback = null;
        };
    }

    // --- Sincronização e Saldo ---
    async function checkStatus() {
        const fp = await getFingerprint();
        const token = localStorage.getItem('keepai_token');
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        try {
            const r = await fetch(`api.php?action=check_status&fingerprint=${fp}&keepai_token=${encodeURIComponent(token || '')}`, { headers });
            const res = await r.json();
            if (res.status === 'success') {
                appState.credits = parseInt(res.data.credits);
                appState.isPro = res.data.is_pro == 1;
                appState.bonusActive = res.data.bonus_active == 1;

                if (res.uid) {
                    const display = document.getElementById('userAccessId');
                    if (display) display.innerText = res.uid.toUpperCase();
                }

                const loginForm = document.getElementById('keepai-login-form');
                const loggedBox = document.getElementById('keepai-logged-in-box');
                const emailSpan = document.getElementById('keepaiUserEmail');
                
                if (res.mode === 'keepai' && res.data.email) {
                    if (loginForm) {
                        loginForm.style.display = 'none';
                        const passInp = document.getElementById('keepaiPassword');
                        const emailInp = document.getElementById('keepaiEmail');
                        if (passInp) passInp.disabled = true;
                        if (emailInp) emailInp.disabled = true;
                    }
                    if (loggedBox) loggedBox.style.display = 'flex';
                    if (emailSpan) emailSpan.innerText = res.data.email;
                } else {
                    if (loginForm) {
                        loginForm.style.display = 'flex';
                        const passInp = document.getElementById('keepaiPassword');
                        const emailInp = document.getElementById('keepaiEmail');
                        if (passInp) passInp.disabled = false;
                        if (emailInp) emailInp.disabled = false;
                    }
                    if (loggedBox) loggedBox.style.display = 'none';
                }

                updateUIAccess();
            }
        } catch (e) { console.warn('API offline'); }
    }

    function updateUIAccess() {
        const isPremium = appState.isPro || appState.bonusActive;
        const banner = document.querySelector('.pro-edition');
        if (isPremium) {
            if (banner) { banner.innerHTML = 'PRO UNLOCKED'; banner.style.color = '#50fa7b'; }
            if (creditBalanceSpan) creditBalanceSpan.innerHTML = '∞';
        } else {
            if (creditBalanceSpan) {
                creditBalanceSpan.innerHTML = appState.credits;
                creditBalanceSpan.style.color = appState.credits <= 0 ? '#ff5555' : '#f1fa8c';
            }
        }
    }

    // --- Material & Presets ---
    window.handleMaterialChange = function(mat) {
        appState.material = mat;
        if (mat === 'glass') {
            if (edgeBandingBox) edgeBandingBox.style.display = 'none';
            if (edgePriceGroup) edgePriceGroup.style.display = 'none';
            if (cutAlgorithmSelect) cutAlgorithmSelect.value = 'guillotine';
            if (kerfInput) kerfInput.value = '2';
        } else if (mat === 'metal') {
            if (edgeBandingBox) edgeBandingBox.style.display = 'none';
            if (edgePriceGroup) edgePriceGroup.style.display = 'none';
            if (cutAlgorithmSelect) cutAlgorithmSelect.value = 'auto';
            if (kerfInput) kerfInput.value = '1';
        } else {
            if (edgeBandingBox) edgeBandingBox.style.display = 'block';
            if (edgePriceGroup) edgePriceGroup.style.display = 'flex';
            if (cutAlgorithmSelect) cutAlgorithmSelect.value = 'auto';
            if (kerfInput) kerfInput.value = '4';
        }
        renderPieceList();
    };

    window.applyPreset = function(w, h, kerf, mat, label) {
        sheetWidthInput.value = w;
        sheetHeightInput.value = h;
        kerfInput.value = kerf;
        if (materialTypeSelect) {
            materialTypeSelect.value = mat;
            handleMaterialChange(mat);
        }

        document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.demo-btn').forEach(btn => btn.classList.remove('active'));
        if (window.event && window.event.currentTarget && window.event.currentTarget.classList.contains('preset-btn')) {
            window.event.currentTarget.classList.add('active');
        }

        showToast(`Preset <b>${label}</b> aplicado!`, 'info');
    };

    // --- Carregador de Projeto Completo de Exemplo (Demonstração com 1-Clique) ---
    window.loadCompleteProjectDemo = function(type = 'mdf', btnElement = null) {
        // Alterna o estado ativo apenas no botão clicado
        document.querySelectorAll('.demo-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));

        if (btnElement && btnElement.classList) {
            btnElement.classList.add('active');
        } else {
            const targetBtn = document.getElementById('demoBtn-' + type);
            if (targetBtn) targetBtn.classList.add('active');
        }

        let demoPieces = [];
        let demoSheet = { w: 2750, h: 1830, kerf: 4, trim: 10, mat: 'wood', price: 210.00, edgePrice: 1.60, title: 'Armário Completo em MDF 15mm' };

        if (type === 'glass') {
            demoSheet = { w: 3210, h: 2200, kerf: 2, trim: 15, mat: 'glass', price: 380.00, edgePrice: 0, title: 'Projeto Vidros Float & Esquadrias' };
            demoPieces = [
                { label: 'Porta de Correr Box', width: 1900, height: 600, quantity: 2, edgeBanding: { top: false, bottom: false, left: false, right: false } },
                { label: 'Painel Fixo Box', width: 1900, height: 600, quantity: 2, edgeBanding: { top: false, bottom: false, left: false, right: false } },
                { label: 'Bandeira Superior', width: 1200, height: 400, quantity: 2, edgeBanding: { top: false, bottom: false, left: false, right: false } },
                { label: 'Prateleiras Nicho Vidro', width: 800, height: 300, quantity: 6, edgeBanding: { top: false, bottom: false, left: false, right: false } },
                { label: 'Tampo de Mesa Vidro', width: 1400, height: 800, quantity: 1, edgeBanding: { top: false, bottom: false, left: false, right: false } }
            ];
        } else if (type === 'metal') {
            demoSheet = { w: 3000, h: 1200, kerf: 1, trim: 5, mat: 'metal', price: 290.00, edgePrice: 0, title: 'Gabinete Estrutural em Chapa de Aço' };
            demoPieces = [
                { label: 'Painel Frontal Gabinete', width: 1100, height: 850, quantity: 2, edgeBanding: { top: false, bottom: false, left: false, right: false } },
                { label: 'Laterais Estruturais', width: 1200, height: 600, quantity: 4, edgeBanding: { top: false, bottom: false, left: false, right: false } },
                { label: 'Base Reforçada', width: 950, height: 750, quantity: 2, edgeBanding: { top: false, bottom: false, left: false, right: false } },
                { label: 'Chapas Fechamento', width: 600, height: 400, quantity: 6, edgeBanding: { top: false, bottom: false, left: false, right: false } },
                { label: 'Travessas de Fixação', width: 850, height: 150, quantity: 8, edgeBanding: { top: false, bottom: false, left: false, right: false } }
            ];
        } else {
            // MDF Padrão Brasil
            demoSheet = { w: 2750, h: 1830, kerf: 4, trim: 10, mat: 'wood', price: 210.00, edgePrice: 1.60, title: 'Armário Guarda-Roupa MDF 15mm' };
            demoPieces = [
                { label: 'Lateral Esquerda', width: 2100, height: 550, quantity: 1, edgeBanding: { top: true, bottom: false, left: false, right: false } },
                { label: 'Lateral Direita', width: 2100, height: 550, quantity: 1, edgeBanding: { top: true, bottom: false, left: false, right: false } },
                { label: 'Divisória Central', width: 2000, height: 530, quantity: 1, edgeBanding: { top: true, bottom: false, left: false, right: false } },
                { label: 'Tampo Superior', width: 1600, height: 550, quantity: 1, edgeBanding: { top: true, bottom: true, left: false, right: false } },
                { label: 'Base Inferior', width: 1600, height: 550, quantity: 1, edgeBanding: { top: true, bottom: true, left: false, right: false } },
                { label: 'Prateleiras Móveis', width: 775, height: 500, quantity: 4, edgeBanding: { top: true, bottom: false, left: false, right: false } },
                { label: 'Portas de Abrir', width: 1020, height: 395, quantity: 4, edgeBanding: { top: true, bottom: true, left: true, right: true } },
                { label: 'Frentes de Gaveta', width: 390, height: 180, quantity: 4, edgeBanding: { top: true, bottom: true, left: true, right: true } },
                { label: 'Laterais de Gaveta', width: 450, height: 140, quantity: 8, edgeBanding: { top: false, bottom: false, left: false, right: false } },
                { label: 'Contra-frentes Gaveta', width: 340, height: 140, quantity: 8, edgeBanding: { top: false, bottom: false, left: false, right: false } }
            ];
        }

        // 1. Atualiza dimensões da chapa e parâmetros
        sheetWidthInput.value = demoSheet.w;
        sheetHeightInput.value = demoSheet.h;
        kerfInput.value = demoSheet.kerf;
        trimMarginInput.value = demoSheet.trim;
        if (sheetPriceInput) sheetPriceInput.value = demoSheet.price;
        if (edgePriceInput) edgePriceInput.value = demoSheet.edgePrice;
        if (materialTypeSelect) {
            materialTypeSelect.value = demoSheet.mat;
            handleMaterialChange(demoSheet.mat);
        }

        // 2. Preenche array de peças completo
        appState.pieces = demoPieces.map((p, idx) => ({
            id: idx + 1,
            label: p.label,
            width: Math.max(p.width, p.height),
            height: Math.min(p.width, p.height),
            quantity: p.quantity,
            edgeBanding: p.edgeBanding,
            color: PIECE_COLORS[idx % PIECE_COLORS.length]
        }));

        renderPieceList();
        updateSaveStatus(false);

        // 3. Executa a otimização diretamente (Demonstração completa em tempo real)
        let flatPieces = [];
        appState.pieces.forEach(p => {
            for (let i = 0; i < p.quantity; i++) {
                flatPieces.push({
                    id: p.id,
                    label: p.label,
                    w: p.width,
                    h: p.height,
                    color: p.color,
                    edgeBanding: p.edgeBanding
                });
            }
        });

        const rotate = allowRotationCheckbox ? allowRotationCheckbox.checked : true;
        const algo = cutAlgorithmSelect ? cutAlgorithmSelect.value : 'auto';

        appState.results = runMultiHeuristicOptimization(flatPieces, demoSheet.w, demoSheet.h, demoSheet.kerf, demoSheet.trim, rotate, algo);
        renderResults();

        // 4. Feedback e Scroll suave para os resultados
        showToast(`✨ <b>${demoSheet.title}</b> carregado e otimizado com sucesso!`, 'success');
        
        const resultsEl = document.getElementById('resultsSection');
        if (resultsEl) {
            resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    window.toggleAllEdges = function() {
        const anyUnchecked = !edgeTop.checked || !edgeBottom.checked || !edgeLeft.checked || !edgeRight.checked;
        edgeTop.checked = anyUnchecked;
        edgeBottom.checked = anyUnchecked;
        edgeLeft.checked = anyUnchecked;
        edgeRight.checked = anyUnchecked;
    };

    // --- Gerenciamento de Peças ---
    function addPiece() {
        const w = parseInt(newPieceWidthInput.value);
        const h = parseInt(newPieceHeightInput.value);
        const q = parseInt(newPieceQuantityInput.value);
        const label = newPieceLabelInput.value.trim() || `Peça ${appState.pieces.length + 1}`;
        const sW = parseInt(sheetWidthInput.value);
        const sH = parseInt(sheetHeightInput.value);

        if (isNaN(w) || isNaN(h) || isNaN(q) || w <= 0 || h <= 0 || q <= 0) {
            showToast('Informe dimensões válidas (L e H > 0)!', 'error');
            return;
        }

        if ((w > sW && w > sH) || (h > sW && h > sH)) {
            showToast(`A peça (${w}×${h}mm) é maior que a chapa (${sW}×${sH}mm)!`, 'error');
            return;
        }

        const color = PIECE_COLORS[appState.pieces.length % PIECE_COLORS.length];
        const edgeBanding = {
            top: edgeTop ? edgeTop.checked : false,
            bottom: edgeBottom ? edgeBottom.checked : false,
            left: edgeLeft ? edgeLeft.checked : false,
            right: edgeRight ? edgeRight.checked : false
        };

        appState.pieces.push({
            id: appState.pieces.length + 1,
            label,
            width: w,
            height: h,
            quantity: q,
            edgeBanding,
            color
        });

        // Limpa campos
        newPieceWidthInput.value = '';
        newPieceHeightInput.value = '';
        newPieceQuantityInput.value = '1';
        newPieceLabelInput.value = '';
        if (edgeTop) edgeTop.checked = false;
        if (edgeBottom) edgeBottom.checked = false;
        if (edgeLeft) edgeLeft.checked = false;
        if (edgeRight) edgeRight.checked = false;
        newPieceLabelInput.focus();

        renderPieceList();
        updateSaveStatus(false);
        showToast(`Peça <b>${label}</b> adicionada!`, 'success');
    }

    function removePiece(index) {
        appState.pieces.splice(index, 1);
        renderPieceList();
        clearResults();
        updateSaveStatus(false);
    }

    function renderPieceList() {
        if (!pieceTableBody) return;
        pieceTableBody.innerHTML = '';

        if (appState.pieces.length === 0) {
            pieceTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-pieces-text">Nenhuma peça adicionada ainda. Adicione acima ou importe uma planilha.</td>
                </tr>
            `;
            if (pieceCountSpan) pieceCountSpan.innerText = '0';
            if (clearAllPiecesBtn) clearAllPiecesBtn.disabled = true;
            if (optimizeBtn) optimizeBtn.disabled = true;
            return;
        }

        let totalItems = 0;
        appState.pieces.forEach((p, index) => {
            totalItems += p.quantity;
            const tr = document.createElement('tr');
            tr.id = `piece-row-${index}`;

            let edgeHtml = '-';
            if (appState.material === 'wood') {
                const b = p.edgeBanding || {};
                const topIcon = b.top ? '<span style="color:#f1fa8c" title="Borda Superior">⬆</span>' : '';
                const botIcon = b.bottom ? '<span style="color:#f1fa8c" title="Borda Inferior">⬇</span>' : '';
                const leftIcon = b.left ? '<span style="color:#f1fa8c" title="Borda Esquerda">⬅</span>' : '';
                const rightIcon = b.right ? '<span style="color:#f1fa8c" title="Borda Direita">➡</span>' : '';
                const count = (b.top?1:0) + (b.bottom?1:0) + (b.left?1:0) + (b.right?1:0);
                edgeHtml = count > 0 ? `${count} lados (${topIcon}${botIcon}${leftIcon}${rightIcon})` : '<span style="color:#64748b">Nenhuma</span>';
            }

            tr.innerHTML = `
                <td><span class="piece-tag" style="border-left: 3px solid ${p.color};">#${index + 1}</span></td>
                <td><strong style="color:#fff;">${p.label}</strong></td>
                <td>${p.width} × ${p.height} mm</td>
                <td><span style="color:var(--primary-color); font-weight:bold;">${p.quantity}x</span></td>
                <td>${edgeHtml}</td>
                <td>
                    <button class="btn-del-piece" onclick="window.deletePieceItem(${index})" title="Excluir Peça">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            pieceTableBody.appendChild(tr);
        });

        if (pieceCountSpan) pieceCountSpan.innerText = totalItems;
        if (clearAllPiecesBtn) clearAllPiecesBtn.disabled = false;
        if (optimizeBtn) optimizeBtn.disabled = false;
    }

    window.deletePieceItem = function(index) {
        removePiece(index);
    };

    if (clearAllPiecesBtn) {
        clearAllPiecesBtn.onclick = () => {
            customConfirm('Deseja realmente limpar todas as peças da lista?', () => {
                appState.pieces = [];
                renderPieceList();
                clearResults();
                showToast('Lista de peças limpa.', 'info');
            });
        };
    }

    function updateSaveStatus(saved) {
        appState.isSaved = saved;
        const status = document.getElementById('saveStatus');
        if (status) {
            status.innerHTML = saved ? '<i class="fa-solid fa-check"></i> Sincronizado' : '<i class="fa-regular fa-floppy-disk"></i> Pendente';
            status.className = saved ? 'save-status saved' : 'save-status unsaved';
        }
    }

    // ================================================================
    // MOTOR DE OTIMIZAÇÃO 2D MULTI-HEURÍSTICO (UNIVERSAL)
    // ================================================================

    // 1. Pack com Guilhotina 2D (Linear de ponta a ponta - Ideal p/ Vidro e Serras)
    function packGuillotine(flatPieces, sW, sH, kerf, trim, allowRotate, splitRule = 'SLAS') {
        let usableW = sW - (trim * 2);
        let usableH = sH - (trim * 2);
        let sheets = [];

        function createNewSheet() {
            return {
                freeRects: [{ x: trim, y: trim, w: usableW, h: usableH }],
                rects: []
            };
        }

        sheets.push(createNewSheet());

        flatPieces.forEach(p => {
            let bestSheetIdx = -1;
            let bestRectIdx = -1;
            let bestScore = Infinity;
            let bestRotated = false;
            let bestW = p.w;
            let bestH = p.h;

            for (let sIdx = 0; sIdx < sheets.length; sIdx++) {
                let sheet = sheets[sIdx];
                for (let rIdx = 0; rIdx < sheet.freeRects.length; rIdx++) {
                    let free = sheet.freeRects[rIdx];

                    // Tenta normal
                    if (p.w <= free.w && p.h <= free.h) {
                        let leftoverShort = Math.min(free.w - p.w, free.h - p.h);
                        let score = leftoverShort;
                        if (score < bestScore) {
                            bestScore = score;
                            bestSheetIdx = sIdx;
                            bestRectIdx = rIdx;
                            bestRotated = false;
                            bestW = p.w;
                            bestH = p.h;
                        }
                    }

                    // Tenta rotacionado
                    if (allowRotate && p.h <= free.w && p.w <= free.h) {
                        let leftoverShort = Math.min(free.w - p.h, free.h - p.w);
                        let score = leftoverShort;
                        if (score < bestScore) {
                            bestScore = score;
                            bestSheetIdx = sIdx;
                            bestRectIdx = rIdx;
                            bestRotated = true;
                            bestW = p.h;
                            bestH = p.w;
                        }
                    }
                }
                if (bestSheetIdx !== -1) break;
            }

            if (bestSheetIdx === -1) {
                sheets.push(createNewSheet());
                bestSheetIdx = sheets.length - 1;
                let sheet = sheets[bestSheetIdx];
                let free = sheet.freeRects[0];
                bestRectIdx = 0;
                bestRotated = (allowRotate && p.h <= free.w && p.w <= free.h && p.w > free.w);
                bestW = bestRotated ? p.h : p.w;
                bestH = bestRotated ? p.w : p.h;
            }

            let sheet = sheets[bestSheetIdx];
            let free = sheet.freeRects.splice(bestRectIdx, 1)[0];

            sheet.rects.push({
                x: free.x,
                y: free.y,
                w: bestW,
                h: bestH,
                rotated: bestRotated,
                piece: p
            });

            // Guilhotina: Divide o retângulo livre remanescente
            let wRemain = free.w - bestW - kerf;
            let hRemain = free.h - bestH - kerf;

            if (splitRule === 'SLAS' || splitRule === 'horizontal') {
                if (wRemain > 0) sheet.freeRects.push({ x: free.x + bestW + kerf, y: free.y, w: wRemain, h: bestH });
                if (hRemain > 0) sheet.freeRects.push({ x: free.x, y: free.y + bestH + kerf, w: free.w, h: hRemain });
            } else {
                if (hRemain > 0) sheet.freeRects.push({ x: free.x, y: free.y + bestH + kerf, w: bestW, h: hRemain });
                if (wRemain > 0) sheet.freeRects.push({ x: free.x + bestW + kerf, y: free.y, w: wRemain, h: free.h });
            }
        });

        return sheets;
    }

    // 2. Pack com Maximal Rectangles (Best Short Side Fit - Máximo aproveitamento CNC/Laser)
    function packMaxRects(flatPieces, sW, sH, kerf, trim, allowRotate) {
        let usableW = sW - (trim * 2);
        let usableH = sH - (trim * 2);
        let sheets = [];

        function createNewSheet() {
            return {
                freeRects: [{ x: trim, y: trim, w: usableW, h: usableH }],
                rects: []
            };
        }

        sheets.push(createNewSheet());

        flatPieces.forEach(p => {
            let bestSheetIdx = -1;
            let bestRectIdx = -1;
            let bestScore1 = Infinity;
            let bestScore2 = Infinity;
            let bestRotated = false;
            let bestW = p.w;
            let bestH = p.h;

            for (let sIdx = 0; sIdx < sheets.length; sIdx++) {
                let sheet = sheets[sIdx];
                for (let rIdx = 0; rIdx < sheet.freeRects.length; rIdx++) {
                    let free = sheet.freeRects[rIdx];

                    if (p.w <= free.w && p.h <= free.h) {
                        let leftoverX = free.w - p.w;
                        let leftoverY = free.h - p.h;
                        let shortSide = Math.min(leftoverX, leftoverY);
                        let longSide = Math.max(leftoverX, leftoverY);

                        if (shortSide < bestScore1 || (shortSide === bestScore1 && longSide < bestScore2)) {
                            bestScore1 = shortSide;
                            bestScore2 = longSide;
                            bestSheetIdx = sIdx;
                            bestRectIdx = rIdx;
                            bestRotated = false;
                            bestW = p.w;
                            bestH = p.h;
                        }
                    }

                    if (allowRotate && p.h <= free.w && p.w <= free.h) {
                        let leftoverX = free.w - p.h;
                        let leftoverY = free.h - p.w;
                        let shortSide = Math.min(leftoverX, leftoverY);
                        let longSide = Math.max(leftoverX, leftoverY);

                        if (shortSide < bestScore1 || (shortSide === bestScore1 && longSide < bestScore2)) {
                            bestScore1 = shortSide;
                            bestScore2 = longSide;
                            bestSheetIdx = sIdx;
                            bestRectIdx = rIdx;
                            bestRotated = true;
                            bestW = p.h;
                            bestH = p.w;
                        }
                    }
                }
                if (bestSheetIdx !== -1) break;
            }

            if (bestSheetIdx === -1) {
                sheets.push(createNewSheet());
                bestSheetIdx = sheets.length - 1;
                let sheet = sheets[bestSheetIdx];
                let free = sheet.freeRects[0];
                bestRectIdx = 0;
                bestRotated = (allowRotate && p.h <= free.w && p.w <= free.h && p.w > free.w);
                bestW = bestRotated ? p.h : p.w;
                bestH = bestRotated ? p.w : p.h;
            }

            let sheet = sheets[bestSheetIdx];
            let free = sheet.freeRects.splice(bestRectIdx, 1)[0];

            sheet.rects.push({
                x: free.x,
                y: free.y,
                w: bestW,
                h: bestH,
                rotated: bestRotated,
                piece: p
            });

            // Split
            let wRemain = free.w - bestW - kerf;
            let hRemain = free.h - bestH - kerf;
            if (wRemain > 0) sheet.freeRects.push({ x: free.x + bestW + kerf, y: free.y, w: wRemain, h: free.h });
            if (hRemain > 0) sheet.freeRects.push({ x: free.x, y: free.y + bestH + kerf, w: free.w, h: hRemain });
        });

        return sheets;
    }

    // 3. Multi-Heuristic Auto Optimizer
    function runMultiHeuristicOptimization(flatPieces, sW, sH, kerf, trim, allowRotate, forcedAlgo) {
        if (forcedAlgo === 'guillotine') {
            return packGuillotine(flatPieces, sW, sH, kerf, trim, allowRotate, 'SLAS');
        }
        if (forcedAlgo === 'maxrects') {
            return packMaxRects(flatPieces, sW, sH, kerf, trim, allowRotate);
        }

        // AUTO: Testa 4 estratégias de ordenação e cortes
        const strategies = [
            { sort: (a,b) => (b.w * b.h) - (a.w * a.h), fn: p => packMaxRects(p, sW, sH, kerf, trim, allowRotate) },
            { sort: (a,b) => Math.max(b.w, b.h) - Math.max(a.w, a.h), fn: p => packGuillotine(p, sW, sH, kerf, trim, allowRotate, 'horizontal') },
            { sort: (a,b) => Math.max(b.w, b.h) - Math.max(a.w, a.h), fn: p => packGuillotine(p, sW, sH, kerf, trim, allowRotate, 'vertical') },
            { sort: (a,b) => (b.w + b.h) - (a.w + a.h), fn: p => packMaxRects(p, sW, sH, kerf, trim, allowRotate) }
        ];

        let bestResult = null;
        let bestSheetCount = Infinity;
        let bestWaste = Infinity;

        strategies.forEach(st => {
            let sorted = [...flatPieces].sort(st.sort);
            let res = st.fn(sorted);
            let totalSheetArea = res.length * sW * sH;
            let usedArea = res.reduce((sum, s) => sum + s.rects.reduce((rSum, r) => rSum + (r.w * r.h), 0), 0);
            let waste = totalSheetArea - usedArea;

            if (res.length < bestSheetCount || (res.length === bestSheetCount && waste < bestWaste)) {
                bestSheetCount = res.length;
                bestWaste = waste;
                bestResult = res;
            }
        });

        return bestResult;
    }

    // --- Execução da Otimização ---
    function optimize() {
        if (appState.credits <= 0 && !appState.isPro && !appState.bonusActive) {
            showToast('Créditos insuficientes! Recarregue para continuar.', 'error');
            if (paymentModal) paymentModal.style.display = 'flex';
            return;
        }

        const sW = parseInt(sheetWidthInput.value);
        const sH = parseInt(sheetHeightInput.value);
        const kerf = parseFloat(kerfInput.value) || 0;
        const trim = parseInt(trimMarginInput.value) || 0;
        const rotate = allowRotationCheckbox.checked;
        const algo = cutAlgorithmSelect.value;

        if (appState.pieces.length === 0) {
            showToast('Adicione pelo menos uma peça antes de otimizar!', 'error');
            return;
        }

        // Planificar peças
        let flatPieces = [];
        appState.pieces.forEach(p => {
            for (let i = 0; i < p.quantity; i++) {
                flatPieces.push({
                    id: p.id,
                    label: p.label,
                    w: p.width,
                    h: p.height,
                    color: p.color,
                    edgeBanding: p.edgeBanding
                });
            }
        });

        // Executar motor
        appState.results = runMultiHeuristicOptimization(flatPieces, sW, sH, kerf, trim, rotate, algo);
        renderResults();

        if (!appState.isPro && !appState.bonusActive) {
            deductCredit();
        }
    }

    async function deductCredit() {
        const fp = await getFingerprint();
        const token = localStorage.getItem('keepai_token');
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        try {
            await fetch(`api.php?action=use_credit&fingerprint=${fp}&keepai_token=${encodeURIComponent(token || '')}`, { method: 'POST', headers });
            checkStatus();
        } catch (e) { }
    }

    // --- Renderização Visual no Canvas ---
    function renderResults() {
        if (!cutPlanOutput || !appState.results) return;
        cutPlanOutput.innerHTML = '';

        let sW = parseInt(sheetWidthInput.value);
        let sH = parseInt(sheetHeightInput.value);
        let totalSheetArea = sW * sH * appState.results.length;
        let totalUsedArea = 0;
        let totalEdgeMeters = 0;

        appState.results.forEach((sheet, idx) => {
            const canvasWrapper = document.createElement('div');
            canvasWrapper.className = 'canvas-wrapper glass';
            canvasWrapper.innerHTML = `
                <div class="canvas-header-bar">
                    <h3 class="canvas-sheet-title">
                        <i class="fa-solid fa-layer-group"></i> Chapa ${idx + 1} de ${appState.results.length} 
                        <span style="color:#e0e0ff; font-size:0.85em; font-weight:normal; opacity:0.85;">(${sW}×${sH}mm)</span>
                    </h3>
                    <span class="canvas-pieces-count">${sheet.rects.length} peças alocadas</span>
                </div>
            `;

            const canvas = document.createElement('canvas');
            canvas.className = 'sheet-cut-canvas';
            const ctx = canvas.getContext('2d');

            const containerW = cutPlanOutput.clientWidth || (window.innerWidth < 600 ? window.innerWidth - 32 : 800);
            const renderW = Math.max(280, Math.min(containerW - 28, 900)) * appState.canvasZoom;
            const scale = renderW / sW;
            canvas.width = sW * scale;
            canvas.height = sH * scale;

            // Fundo da Chapa
            ctx.fillStyle = '#121224';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            // Refilo (Margem de segurança)
            const trim = parseInt(trimMarginInput.value) || 0;
            if (trim > 0) {
                ctx.strokeStyle = 'rgba(255, 85, 85, 0.3)';
                ctx.setLineDash([4, 4]);
                ctx.strokeRect(trim * scale, trim * scale, (sW - trim*2) * scale, (sH - trim*2) * scale);
                ctx.setLineDash([]);
            }

            sheet.rects.forEach((r) => {
                totalUsedArea += r.w * r.h;

                const rx = r.x * scale;
                const ry = r.y * scale;
                const rw = r.w * scale;
                const rh = r.h * scale;

                // Preenchimento com cor suave da peça
                ctx.fillStyle = r.piece.color + '44';
                ctx.fillRect(rx, ry, rw, rh);

                ctx.strokeStyle = r.piece.color;
                ctx.lineWidth = 1.5;
                ctx.strokeRect(rx, ry, rw, rh);

                // Fita de Borda destacada nas laterais se houver
                if (appState.material === 'wood' && r.piece.edgeBanding) {
                    const eb = r.piece.edgeBanding;
                    ctx.strokeStyle = '#f1fa8c';
                    ctx.lineWidth = 3;

                    // Topo
                    if ((!r.rotated && eb.top) || (r.rotated && eb.left)) {
                        ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx + rw, ry); ctx.stroke();
                        totalEdgeMeters += r.w / 1000;
                    }
                    // Base
                    if ((!r.rotated && eb.bottom) || (r.rotated && eb.right)) {
                        ctx.beginPath(); ctx.moveTo(rx, ry + rh); ctx.lineTo(rx + rw, ry + rh); ctx.stroke();
                        totalEdgeMeters += r.w / 1000;
                    }
                    // Esquerda
                    if ((!r.rotated && eb.left) || (r.rotated && eb.bottom)) {
                        ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx, ry + rh); ctx.stroke();
                        totalEdgeMeters += r.h / 1000;
                    }
                    // Direita
                    if ((!r.rotated && eb.right) || (r.rotated && eb.top)) {
                        ctx.beginPath(); ctx.moveTo(rx + rw, ry); ctx.lineTo(rx + rw, ry + rh); ctx.stroke();
                        totalEdgeMeters += r.h / 1000;
                    }
                }

                // Texto e Identificação da Peça
                if (rw > 35 && rh > 18 && appState.showLabels) {
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 11px Roboto, sans-serif';
                    ctx.fillText(`#${r.piece.id} ${r.piece.label}`, rx + 5, ry + 14);

                    ctx.fillStyle = '#94a3b8';
                    ctx.font = '10px Roboto, sans-serif';
                    ctx.fillText(`${r.w}×${r.h}mm`, rx + 5, ry + 27);

                    if (r.rotated) {
                        ctx.fillStyle = '#00e5ff';
                        ctx.font = 'bold 10px Roboto, sans-serif';
                        ctx.fillText('® Giro', rx + rw - 38, ry + 14);
                    }
                }
            });

            canvasWrapper.appendChild(canvas);
            cutPlanOutput.appendChild(canvasWrapper);
        });

        // Métricas e Resultados
        const wastePercent = Math.max(0, ((1 - (totalUsedArea / totalSheetArea)) * 100)).toFixed(1);
        const efficiencyPercent = (100 - parseFloat(wastePercent)).toFixed(1);

        if (metricsGrid) metricsGrid.style.display = 'grid';
        if (zoomToolbar) zoomToolbar.style.display = 'flex';

        document.getElementById('metricSheetsCount').innerText = appState.results.length;
        document.getElementById('metricEfficiency').innerText = efficiencyPercent + '%';
        document.getElementById('metricWaste').innerText = wastePercent + '%';
        document.getElementById('metricEdgeMeters').innerText = totalEdgeMeters.toFixed(1) + ' m';

        const metricEdgeCard = document.getElementById('metricEdgeCard');
        if (metricEdgeCard) {
            metricEdgeCard.style.display = appState.material === 'wood' ? 'flex' : 'none';
        }

        recalculateCosts();

        wasteInfo.innerHTML = `Otimização concluída! <b>${appState.results.length} Chapas</b> | Aproveitamento: <b style="color:#50fa7b;">${efficiencyPercent}%</b> | Desperdício: <b style="color:#ff5555;">${wastePercent}%</b>`;
        if (printPlanBtn) printPlanBtn.disabled = false;
        showToast('Plano de corte otimizado com sucesso!', 'success');
    }

    window.recalculateCosts = function() {
        if (!appState.results) return;
        const sheetPrice = parseFloat(sheetPriceInput.value) || 0;
        const edgePrice = parseFloat(edgePriceInput.value) || 0;
        const edgeMetersText = document.getElementById('metricEdgeMeters').innerText;
        const totalEdgeMeters = parseFloat(edgeMetersText) || 0;

        const totalSheetCost = appState.results.length * sheetPrice;
        const totalEdgeCost = totalEdgeMeters * edgePrice;
        const totalCost = totalSheetCost + totalEdgeCost;

        const costCard = document.getElementById('metricCostCard');
        const totalCostSpan = document.getElementById('metricTotalCost');

        if (totalCost > 0) {
            if (costCard) costCard.style.display = 'flex';
            if (totalCostSpan) totalCostSpan.innerText = 'R$ ' + totalCost.toFixed(2).replace('.', ',');
        } else {
            if (costCard) costCard.style.display = 'none';
        }
    };

    function clearResults() {
        appState.results = null;
        if (printPlanBtn) printPlanBtn.disabled = true;
        if (metricsGrid) metricsGrid.style.display = 'none';
        if (zoomToolbar) zoomToolbar.style.display = 'none';
        if (cutPlanOutput) {
            cutPlanOutput.innerHTML = `
                <div class="empty-state-banner">
                    <div class="empty-state-icon">🪚</div>
                    <h3>Pronto para Otimizar</h3>
                    <p>Adicione suas peças no formulário ao lado ou selecione um dos presets de mercado para visualizar o mapa de corte inteligente.</p>
                </div>
            `;
        }
        if (wasteInfo) wasteInfo.innerHTML = 'Aguardando inserção de peças e clique em <b>Gerar Plano de Corte</b>...';
    }

    // --- Zoom & Visualização ---
    window.zoomCanvas = function(factor) {
        appState.canvasZoom = Math.min(2.5, Math.max(0.4, appState.canvasZoom * factor));
        renderResults();
    };

    window.resetCanvasZoom = function() {
        appState.canvasZoom = 1.0;
        renderResults();
    };

    window.togglePieceLabels = function() {
        appState.showLabels = !appState.showLabels;
        const btn = document.getElementById('toggleLabelsBtn');
        if (btn) btn.innerHTML = appState.showLabels ? '<i class="fa-solid fa-tag"></i> Detalhes' : '<i class="fa-regular fa-eye-slash"></i> Ocultos';
        renderResults();
    };

    // --- Impressão de Ordem de Serviço A4 Limpa ---
    window.printCutPlan = function() {
        if (!appState.results || appState.results.length === 0) return;

        const client = clientNameInput.value.trim() || 'Não informado';
        const project = projectNameInput.value.trim() || 'Plano de Corte';
        const mat = materialTypeSelect.options[materialTypeSelect.selectedIndex].text;
        const sW = sheetWidthInput.value;
        const sH = sheetHeightInput.value;
        const kerf = kerfInput.value;
        const efficiency = document.getElementById('metricEfficiency').innerText;
        const waste = document.getElementById('metricWaste').innerText;
        const edgeMeters = document.getElementById('metricEdgeMeters').innerText;
        const dateStr = new Date().toLocaleDateString('pt-BR');

        let rowsHtml = '';
        appState.pieces.forEach((p, idx) => {
            rowsHtml += `
                <tr>
                    <td>#${idx + 1}</td>
                    <td><strong>${p.label}</strong></td>
                    <td>${p.width} mm</td>
                    <td>${p.height} mm</td>
                    <td>${p.quantity}</td>
                    <td>${p.edgeBanding ? (p.edgeBanding.top?'T ':'') + (p.edgeBanding.bottom?'B ':'') + (p.edgeBanding.left?'E ':'') + (p.edgeBanding.right?'D ':'') : '-'}</td>
                </tr>
            `;
        });

        const reportContainer = document.getElementById('printReportContainer');
        reportContainer.innerHTML = `
            <div class="print-header">
                <div>
                    <h1>CorteFácil Pro — Ordem de Produção</h1>
                    <p><strong>Cliente:</strong> ${client} | <strong>Projeto:</strong> ${project} | <strong>Data:</strong> ${dateStr}</p>
                    <p><strong>Material:</strong> ${mat} | <strong>Chapa:</strong> ${sW}×${sH}mm | <strong>Corte (Serra):</strong> ${kerf}mm</p>
                </div>
                <div style="text-align:right;">
                    <p><strong>Total Chapas:</strong> ${appState.results.length} un</p>
                    <p><strong>Aproveitamento:</strong> ${efficiency} (Sobras: ${waste})</p>
                    ${appState.material === 'wood' ? `<p><strong>Fita de Borda:</strong> ${edgeMeters}</p>` : ''}
                </div>
            </div>

            <h3 style="margin-top:10px;">Lista de Peças a Cortar</h3>
            <table class="print-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Descrição</th>
                        <th>Largura</th>
                        <th>Altura</th>
                        <th>Qtd</th>
                        <th>Fitas</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>

            <h3 style="margin-top:20px;">Diagramas de Corte</h3>
        `;

        window.print();
    };

    // --- Exportar & Importar Projeto JSON ---
    window.exportProjectJSON = function() {
        if (appState.pieces.length === 0) {
            showToast('Nenhuma peça para exportar!', 'error');
            return;
        }

        const data = {
            version: '2.0',
            client: clientNameInput.value,
            project: projectNameInput.value,
            material: materialTypeSelect.value,
            sheet: {
                width: parseInt(sheetWidthInput.value),
                height: parseInt(sheetHeightInput.value),
                kerf: parseFloat(kerfInput.value),
                trim: parseInt(trimMarginInput.value)
            },
            pieces: appState.pieces
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plano-corte-${(projectNameInput.value || 'projeto').toLowerCase().replace(/\s+/g, '-')}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Projeto exportado em JSON com sucesso!', 'success');
    };

    window.importProjectJSON = function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.client) clientNameInput.value = data.client;
                if (data.project) projectNameInput.value = data.project;
                if (data.material && materialTypeSelect) {
                    materialTypeSelect.value = data.material;
                    handleMaterialChange(data.material);
                }
                if (data.sheet) {
                    if (data.sheet.width) sheetWidthInput.value = data.sheet.width;
                    if (data.sheet.height) sheetHeightInput.value = data.sheet.height;
                    if (data.sheet.kerf) kerfInput.value = data.sheet.kerf;
                    if (data.sheet.trim) trimMarginInput.value = data.sheet.trim;
                }
                if (Array.isArray(data.pieces)) {
                    appState.pieces = data.pieces;
                    renderPieceList();
                    clearResults();
                    showToast('Projeto importado com sucesso!', 'success');
                }
            } catch (err) {
                showToast('Arquivo JSON inválido!', 'error');
            }
        };
        reader.readAsText(file);
    };

    // --- Importação de Planilha Excel (.xlsx, .csv) ---
    const importExcelInput = document.getElementById('importExcelInput');
    if (importExcelInput) {
        importExcelInput.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = evt => {
                try {
                    const data = new Uint8Array(evt.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

                    let addedCount = 0;
                    rows.forEach((row, i) => {
                        if (i === 0 && (isNaN(row[0]) || isNaN(row[1]))) return;
                        let label = 'Peça';
                        let w = 0, h = 0, q = 1;

                        if (row.length >= 3 && !isNaN(row[1]) && !isNaN(row[2])) {
                            label = String(row[0]).trim();
                            w = parseInt(row[1]);
                            h = parseInt(row[2]);
                            q = row[3] ? parseInt(row[3]) : 1;
                        } else if (!isNaN(row[0]) && !isNaN(row[1])) {
                            w = parseInt(row[0]);
                            h = parseInt(row[1]);
                            q = row[2] ? parseInt(row[2]) : 1;
                            label = `Peça ${appState.pieces.length + 1}`;
                        }

                        if (w > 0 && h > 0 && q > 0) {
                            appState.pieces.push({
                                id: appState.pieces.length + 1,
                                label,
                                width: w,
                                height: h,
                                quantity: q,
                                color: PIECE_COLORS[appState.pieces.length % PIECE_COLORS.length]
                            });
                            addedCount++;
                        }
                    });

                    renderPieceList();
                    clearResults();
                    showToast(`${addedCount} peças importadas da planilha!`, 'success');
                } catch (err) {
                    showToast('Erro ao processar planilha Excel!', 'error');
                }
            };
            reader.readAsArrayBuffer(file);
        };
    }

    // --- Keep AI Auth & PIX Direct ---
    window.selectedPackageIndex = 1;

    window.handleKeepaiAuth = async function(action) {
        const email = document.getElementById('keepaiEmail').value.trim();
        const password = document.getElementById('keepaiPassword').value.trim();
        const btnLogin = document.getElementById('btnKeepaiLogin');
        const btnRegister = document.getElementById('btnKeepaiRegister');
        
        if (!email || !password) {
            showToast("Preencha e-mail e senha!", "error");
            return;
        }
        
        if (btnLogin) btnLogin.disabled = true;
        if (btnRegister) btnRegister.disabled = true;
        
        try {
            const r = await fetch(`../keepai/api/auth.php?action=${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const res = await r.json();
            
            if (btnLogin) btnLogin.disabled = false;
            if (btnRegister) btnRegister.disabled = false;
            
            if (res.token) {
                localStorage.setItem('keepai_token', res.token);
                showToast(action === 'login' ? "Conectado ao Keep AI!" : "Conta criada com sucesso!", "success");
                
                document.getElementById('keepaiEmail').value = '';
                document.getElementById('keepaiPassword').value = '';
                checkStatus();
            } else {
                showToast(res.error || "Falha na autenticação", "error");
            }
        } catch (err) {
            showToast("Erro ao conectar ao servidor", "error");
            if (btnLogin) btnLogin.disabled = false;
            if (btnRegister) btnRegister.disabled = false;
        }
    };

    window.handleKeepaiLogout = function() {
        customConfirm("Deseja realmente desconectar sua conta Keep AI deste dispositivo?", () => {
            localStorage.removeItem('keepai_token');
            showToast("Desconectado com sucesso!", "info");
            checkStatus();
        });
    };
    
    window.selectPackage = function(index) {
        window.selectedPackageIndex = index;
        for (let i = 0; i < 3; i++) {
            const card = document.getElementById(`pkg-card-${i}`);
            if (card) {
                card.classList.remove('highlighted');
                card.style.border = '1px solid var(--glass-border)';
                card.style.background = 'transparent';
            }
        }
        const selectedCard = document.getElementById(`pkg-card-${index}`);
        if (selectedCard) {
            selectedCard.classList.add('highlighted');
            selectedCard.style.border = '2px solid var(--primary-color)';
            selectedCard.style.background = 'rgba(0, 229, 255, 0.1)';
        }
    };

    window.generatePixPayment = async function() {
        const btn = document.getElementById('btn-generate-pix');
        const pixSection = document.getElementById('pix-section');
        const qrImg = document.getElementById('pix-qrcode');
        const copiaColaText = document.getElementById('pix-copia-cola');
        
        if (!btn) return;
        
        const token = localStorage.getItem('keepai_token');
        
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: '💎 Login Obrigatório',
                text: 'Para comprar créditos, é necessário fazer login ou criar uma conta Keep AI. Assim, seus créditos ficam seguros e unificados para uso em todos os apps!',
                background: '#1a1a1a',
                color: '#fff',
                confirmButtonColor: '#00e5ff',
                confirmButtonText: 'Entrar ou Criar Conta',
                customClass: { popup: 'cyber-border' }
            }).then(() => {
                const emailInput = document.getElementById('keepaiEmail');
                if (emailInput) {
                    emailInput.scrollIntoView({ behavior: 'smooth' });
                    emailInput.focus();
                }
            });
            return;
        }

        const originalHTML = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> GERANDO PIX...';
        
        const fp = await getFingerprint();
        const headers = { 'Content-Type': 'application/json' };
        headers['Authorization'] = `Bearer ${token}`;
        
        try {
            const r = await fetch('api_mp_create.php', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    package_index: window.selectedPackageIndex,
                    fingerprint: fp,
                    keepai_token: token
                })
            });
            
            const res = await r.json();
            btn.disabled = false;
            btn.innerHTML = originalHTML;
            
            if (res.status === 'success' && res.qr_code_base64) {
                qrImg.src = `data:image/png;base64,${res.qr_code_base64}`;
                copiaColaText.value = res.qr_code;
                pixSection.style.display = 'block';
                
                showToast("PIX gerado! Aguardando pagamento...", "info");
                startPaymentPolling();
            } else {
                showToast(res.message || "Erro ao gerar PIX", "error");
            }
        } catch (err) {
            showToast("Erro de conexão ao gerar PIX", "error");
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        }
    };

    window.copyPixCode = function() {
        const text = document.getElementById('pix-copia-cola');
        if (!text || !text.value) return;
        
        navigator.clipboard.writeText(text.value).then(() => {
            showToast("Chave PIX Copiada!", "success");
            Swal.fire({
                icon: 'success',
                title: 'Código Copiado!',
                text: 'Cole o código no app do seu banco para pagar.',
                background: '#1a1a1a',
                color: '#fff',
                confirmButtonColor: '#00e5ff',
                customClass: { popup: 'cyber-border' }
            });
        });
    };

    let paymentPollInterval;
    function startPaymentPolling() {
        if (paymentPollInterval) clearInterval(paymentPollInterval);
        paymentPollInterval = setInterval(async () => {
            const fp = await getFingerprint();
            const token = localStorage.getItem('keepai_token');
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            try {
                const r = await fetch(`api_mp_check.php?fingerprint=${fp}&keepai_token=${encodeURIComponent(token || '')}`, { headers });
                const res = await r.json();
                if (res.status === 'approved') {
                    clearInterval(paymentPollInterval);
                    paymentModal.style.display = 'none';
                    const pixSec = document.getElementById('pix-section');
                    if (pixSec) pixSec.style.display = 'none';
                    
                    Swal.fire({
                        icon: 'success',
                        title: '⚡ Recarga Aprovada!',
                        text: 'Seus créditos foram liberados instantaneamente.',
                        background: '#1a1a1a',
                        color: '#fff',
                        confirmButtonColor: '#00e5ff',
                        customClass: { popup: 'cyber-border' }
                    });
                    
                    checkStatus();
                }
            } catch (e) { }
        }, 5000);
    }

    // --- Listeners de Ações ---
    if (confirmAddPieceBtn) confirmAddPieceBtn.onclick = addPiece;
    if (optimizeBtn) optimizeBtn.onclick = optimize;
    if (printPlanBtn) printPlanBtn.onclick = printCutPlan;

    // Backdoor
    let clicks = 0;
    if (mainLogo) {
        mainLogo.onclick = () => {
            clicks++;
            if (clicks >= 5) { bonusModal.style.display = 'flex'; clicks = 0; }
            setTimeout(() => clicks = 0, 3000);
        };
    }

    if (submitBonusBtn) {
        submitBonusBtn.onclick = async () => {
            const fp = await getFingerprint();
            const pass = bonusPasswordInput.value;
            try {
                const r = await fetch('api.php?action=activate_bonus', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `password=${encodeURIComponent(pass)}&fingerprint=${fp}`
                });
                const res = await r.json();
                if (res.status === 'success') {
                    bonusModal.style.display = 'none';
                    showToast('Bônus Pro Ativado!', 'success');
                    checkStatus();
                } else {
                    showToast('Senha incorreta', 'error');
                }
            } catch (e) { showToast('Erro de conexão', 'error'); }
        };
    }

    if (closeBonusBtn) closeBonusBtn.onclick = () => bonusModal.style.display = 'none';
    if (topUpBtn) topUpBtn.onclick = () => { paymentModal.style.display = 'flex'; startPaymentPolling(); };
    if (closePaymentBtn) {
        closePaymentBtn.onclick = () => {
            paymentModal.style.display = 'none';
            if (paymentPollInterval) clearInterval(paymentPollInterval);
        };
    }

    // ========================================================
    // LEITOR DE RASCUNHOS E LISTAS COM IA (VISION OCR)
    // ========================================================
    const sketchModal = document.getElementById('sketchModal');
    const openSketchModalBtn = document.getElementById('openSketchModalBtn');
    const closeSketchModal = document.getElementById('closeSketchModal');
    const sketchFileInput = document.getElementById('sketchFileInput');
    const sketchCameraInput = document.getElementById('sketchCameraInput');
    const sketchDropZone = document.getElementById('sketchDropZone');
    const btnTriggerCamera = document.getElementById('btnTriggerCamera');
    const btnTriggerFile = document.getElementById('btnTriggerFile');
    const sketchPreviewBox = document.getElementById('sketchPreviewBox');
    const sketchPreviewImg = document.getElementById('sketchPreviewImg');
    const sketchImgWrapper = document.getElementById('sketchImgWrapper');
    const sketchUnitSelect = document.getElementById('sketchUnitSelect');
    const sketchCustomNotes = document.getElementById('sketchCustomNotes');
    const btnResetSketch = document.getElementById('btnResetSketch');
    const btnAnalyzeSketch = document.getElementById('btnAnalyzeSketch');
    const sketchLoadingState = document.getElementById('sketchLoadingState');
    const sketchUploadStep = document.getElementById('sketchUploadStep');
    const sketchResultStep = document.getElementById('sketchResultStep');
    const ocrResultTitle = document.getElementById('ocrResultTitle');
    const ocrResultNotes = document.getElementById('ocrResultNotes');
    const ocrDetectedSheetBox = document.getElementById('ocrDetectedSheetBox');
    const chkApplyDetectedSheet = document.getElementById('chkApplyDetectedSheet');
    const detectedSheetText = document.getElementById('detectedSheetText');
    const ocrPreviewTbody = document.getElementById('ocrPreviewTbody');
    const btnBackToSketch = document.getElementById('btnBackToSketch');
    const btnApplySketchAppend = document.getElementById('btnApplySketchAppend');
    const btnApplySketchReplace = document.getElementById('btnApplySketchReplace');

    let currentSketchBase64 = null;
    let currentExtractedData = null;

    function resetSketchModal() {
        stopLiveCamera();
        currentSketchBase64 = null;
        currentExtractedData = null;
        if (sketchUploadStep) sketchUploadStep.style.display = 'block';
        if (sketchResultStep) sketchResultStep.style.display = 'none';
        if (sketchDropZone) sketchDropZone.style.display = 'block';
        if (sketchLiveCameraBox) sketchLiveCameraBox.style.display = 'none';
        if (sketchPreviewBox) sketchPreviewBox.style.display = 'none';
        if (sketchLoadingState) sketchLoadingState.style.display = 'none';
        if (sketchImgWrapper) sketchImgWrapper.classList.remove('scanning');
        if (sketchPreviewImg) sketchPreviewImg.src = '';
        if (sketchCustomNotes) sketchCustomNotes.value = '';
        if (sketchUnitSelect) sketchUnitSelect.value = 'auto';
        if (sketchFileInput) sketchFileInput.value = '';
        if (sketchCameraInput) sketchCameraInput.value = '';
    }

    window.openSketchModal = function() {
        resetSketchModal();
        if (sketchModal) sketchModal.style.display = 'flex';
    };

    const btnOpenSketch = document.getElementById('btnOpenSketchModal') || openSketchModalBtn;
    if (btnOpenSketch) {
        btnOpenSketch.onclick = window.openSketchModal;
    }

    if (closeSketchModal) {
        closeSketchModal.onclick = () => {
            stopLiveCamera();
            if (sketchModal) sketchModal.style.display = 'none';
        };
    }

    // Câmera ao Vivo & Upload
    const sketchLiveCameraBox = document.getElementById('sketchLiveCameraBox');
    const sketchVideo = document.getElementById('sketchVideo');
    const sketchCaptureCanvas = document.getElementById('sketchCaptureCanvas');
    const btnSnapPhoto = document.getElementById('btnSnapPhoto');
    const btnCloseCamera = document.getElementById('btnCloseCamera');
    const btnFlipCamera = document.getElementById('btnFlipCamera');

    let currentVideoStream = null;
    let currentFacingMode = 'environment';

    function stopLiveCamera() {
        if (currentVideoStream) {
            currentVideoStream.getTracks().forEach(track => {
                try { track.stop(); } catch (e) {}
            });
            currentVideoStream = null;
        }
        if (sketchVideo) {
            sketchVideo.srcObject = null;
        }
        if (sketchLiveCameraBox) sketchLiveCameraBox.style.display = 'none';
    }

    async function startLiveCamera() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            // Fallback imediato para o input nativo de câmera
            if (sketchCameraInput) sketchCameraInput.click();
            return;
        }

        try {
            stopLiveCamera();

            const constraints = {
                video: {
                    facingMode: { ideal: currentFacingMode },
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                },
                audio: false
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            currentVideoStream = stream;
            
            if (sketchVideo) {
                sketchVideo.srcObject = stream;
                sketchVideo.play();
            }

            if (sketchDropZone) sketchDropZone.style.display = 'none';
            if (sketchLiveCameraBox) sketchLiveCameraBox.style.display = 'block';
            if (sketchPreviewBox) sketchPreviewBox.style.display = 'none';
        } catch (err) {
            console.warn('Câmera WebRTC não disponível ou permissão negada, acionando câmera nativa:', err);
            stopLiveCamera();
            if (sketchCameraInput) sketchCameraInput.click();
        }
    }

    function snapPhotoFromStream() {
        if (!sketchVideo || !sketchCaptureCanvas) return;

        const w = sketchVideo.videoWidth || 1280;
        const h = sketchVideo.videoHeight || 720;

        sketchCaptureCanvas.width = w;
        sketchCaptureCanvas.height = h;

        const ctx = sketchCaptureCanvas.getContext('2d');
        ctx.drawImage(sketchVideo, 0, 0, w, h);

        const dataUrl = sketchCaptureCanvas.toDataURL('image/jpeg', 0.92);
        stopLiveCamera();

        currentSketchBase64 = dataUrl;
        if (sketchPreviewImg) sketchPreviewImg.src = currentSketchBase64;
        if (sketchDropZone) sketchDropZone.style.display = 'none';
        if (sketchPreviewBox) sketchPreviewBox.style.display = 'block';
    }

    if (btnSnapPhoto) {
        btnSnapPhoto.onclick = snapPhotoFromStream;
    }

    if (btnCloseCamera) {
        btnCloseCamera.onclick = () => {
            stopLiveCamera();
            if (sketchDropZone) sketchDropZone.style.display = 'block';
        };
    }

    if (btnFlipCamera) {
        btnFlipCamera.onclick = () => {
            currentFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
            startLiveCamera();
        };
    }

    if (btnTriggerCamera) {
        btnTriggerCamera.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            startLiveCamera();
        };
    }

    if (btnTriggerFile && sketchFileInput) {
        btnTriggerFile.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            stopLiveCamera();
            sketchFileInput.click();
        };
    }

    if (sketchDropZone) {
        sketchDropZone.onclick = (e) => {
            // Só aciona arquivo se o clique foi fora dos botões internos
            if (e.target.closest('button')) return;
            if (sketchFileInput) sketchFileInput.click();
        };

        ['dragenter', 'dragover'].forEach(eventName => {
            sketchDropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                sketchDropZone.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            sketchDropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                sketchDropZone.classList.remove('dragover');
            });
        });

        sketchDropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files && files.length > 0) {
                processImageFile(files[0]);
            }
        });
    }

    if (sketchFileInput) {
        sketchFileInput.onchange = (e) => {
            if (e.target.files && e.target.files.length > 0) {
                processImageFile(e.target.files[0]);
            }
        };
    }

    if (sketchCameraInput) {
        sketchCameraInput.onchange = (e) => {
            if (e.target.files && e.target.files.length > 0) {
                processImageFile(e.target.files[0]);
            }
        };
    }

    // Suporte a colar com Ctrl+V (área de transferência)
    window.addEventListener('paste', (e) => {
        if (!sketchModal || sketchModal.style.display !== 'flex') return;
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                processImageFile(blob);
                showToast('Imagem colada com sucesso!', 'success');
                break;
            }
        }
    });

    function processImageFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            showToast('Por favor selecione um arquivo de imagem válido (JPG, PNG, WEBP).', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            currentSketchBase64 = e.target.result;
            if (sketchPreviewImg) sketchPreviewImg.src = currentSketchBase64;
            if (sketchDropZone) sketchDropZone.style.display = 'none';
            if (sketchPreviewBox) sketchPreviewBox.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    if (btnResetSketch) {
        btnResetSketch.onclick = () => {
            currentSketchBase64 = null;
            if (sketchPreviewImg) sketchPreviewImg.src = '';
            if (sketchPreviewBox) sketchPreviewBox.style.display = 'none';
            if (sketchDropZone) sketchDropZone.style.display = 'block';
            if (sketchFileInput) sketchFileInput.value = '';
            if (sketchCameraInput) sketchCameraInput.value = '';
        };
    }

    if (btnAnalyzeSketch) {
        btnAnalyzeSketch.onclick = async () => {
            if (!currentSketchBase64) {
                showToast('Selecione ou tire uma foto do rascunho primeiro!', 'error');
                return;
            }

            if (sketchImgWrapper) sketchImgWrapper.classList.add('scanning');
            if (sketchLoadingState) sketchLoadingState.style.display = 'block';
            btnAnalyzeSketch.disabled = true;

            const unitVal = sketchUnitSelect ? sketchUnitSelect.value : 'auto';
            const notesVal = sketchCustomNotes ? sketchCustomNotes.value.trim() : '';

            try {
                const response = await fetch('api_ocr_sketch.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image: currentSketchBase64,
                        unit: unitVal,
                        instructions: notesVal
                    })
                });

                const result = await response.json();

                if (sketchImgWrapper) sketchImgWrapper.classList.remove('scanning');
                if (sketchLoadingState) sketchLoadingState.style.display = 'none';
                btnAnalyzeSketch.disabled = false;

                if (result.status === 'success' && Array.isArray(result.pieces) && result.pieces.length > 0) {
                    currentExtractedData = result;
                    displaySketchResults(result);
                } else {
                    Swal.fire({
                        title: 'Não foi possível ler as peças',
                        text: result.message || 'Verifique se a imagem está legível e tente novamente.',
                        icon: 'warning',
                        background: '#121224',
                        color: '#fff',
                        confirmButtonColor: '#00e5ff'
                    });
                }
            } catch (err) {
                if (sketchImgWrapper) sketchImgWrapper.classList.remove('scanning');
                if (sketchLoadingState) sketchLoadingState.style.display = 'none';
                btnAnalyzeSketch.disabled = false;
                showToast('Erro de comunicação ao analisar imagem: ' + err.message, 'error');
            }
        };
    }

    function displaySketchResults(data) {
        if (sketchUploadStep) sketchUploadStep.style.display = 'none';
        if (sketchResultStep) sketchResultStep.style.display = 'block';

        if (ocrResultNotes) {
            ocrResultNotes.innerText = data.notes || `Foram identificadas ${data.pieces.length} peças com sucesso.`;
        }

        // Chapa detectada
        if (data.sheet_detected && data.sheet_detected.length && data.sheet_detected.width) {
            if (ocrDetectedSheetBox) {
                ocrDetectedSheetBox.style.display = 'flex';
                const matText = data.sheet_detected.material ? ` (${data.sheet_detected.material})` : '';
                if (detectedSheetText) {
                    detectedSheetText.innerHTML = `Aplicar dimensões da chapa detectada: <b>${data.sheet_detected.length} × ${data.sheet_detected.width} mm</b>${matText}`;
                }
                if (chkApplyDetectedSheet) chkApplyDetectedSheet.checked = true;
            }
        } else {
            if (ocrDetectedSheetBox) ocrDetectedSheetBox.style.display = 'none';
        }

        // Tabela de peças
        if (!ocrPreviewTbody) return;
        ocrPreviewTbody.innerHTML = '';

        data.pieces.forEach((p, idx) => {
            const tr = document.createElement('tr');
            tr.id = `ocr-row-${idx}`;

            const eb = p.edgeBanding || {};
            const ebCount = (eb.top?1:0) + (eb.bottom?1:0) + (eb.left?1:0) + (eb.right?1:0);
            let ebSummary = ebCount > 0 ? `${ebCount} lados` : 'Sem fita';

            tr.innerHTML = `
                <td><input type="text" class="ocr-table-input ocr-name" value="${p.name || ('Peça ' + (idx + 1))}"></td>
                <td><input type="number" class="ocr-table-input ocr-length" value="${p.length}" min="1" style="width: 85px;"></td>
                <td><input type="number" class="ocr-table-input ocr-width" value="${p.width}" min="1" style="width: 85px;"></td>
                <td><input type="number" class="ocr-table-input ocr-qty" value="${p.quantity || 1}" min="1" style="width: 60px;"></td>
                <td>
                    <select class="ocr-table-input ocr-rotate" style="width: 75px;">
                        <option value="1" ${p.canRotate !== false ? 'selected' : ''}>Sim</option>
                        <option value="0" ${p.canRotate === false ? 'selected' : ''}>Não</option>
                    </select>
                </td>
                <td style="font-size: 0.8rem; color: #a0aec0;">${ebSummary}</td>
                <td>
                    <button type="button" class="btn-del-piece" onclick="document.getElementById('ocr-row-${idx}').remove()" title="Remover item">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            ocrPreviewTbody.appendChild(tr);
        });
    }

    if (btnBackToSketch) {
        btnBackToSketch.onclick = () => {
            if (sketchResultStep) sketchResultStep.style.display = 'none';
            if (sketchUploadStep) sketchUploadStep.style.display = 'block';
        };
    }

    function collectEditedOcrPieces() {
        const rows = ocrPreviewTbody ? ocrPreviewTbody.querySelectorAll('tr') : [];
        const resultPieces = [];
        
        rows.forEach((row, idx) => {
            const name = row.querySelector('.ocr-name')?.value.trim() || `Peça ${idx + 1}`;
            const length = parseInt(row.querySelector('.ocr-length')?.value) || 0;
            const width = parseInt(row.querySelector('.ocr-width')?.value) || 0;
            const quantity = parseInt(row.querySelector('.ocr-qty')?.value) || 1;

            let edgeBanding = { top: false, bottom: false, left: false, right: false };
            if (currentExtractedData && currentExtractedData.pieces && currentExtractedData.pieces[idx]) {
                edgeBanding = currentExtractedData.pieces[idx].edgeBanding || edgeBanding;
            }

            if (length > 0 && width > 0) {
                const maxDim = Math.max(length, width);
                const minDim = Math.min(length, width);
                resultPieces.push({
                    id: appState.pieces.length + resultPieces.length + 1,
                    label: name,
                    width: maxDim,
                    height: minDim,
                    quantity: quantity,
                    edgeBanding: edgeBanding,
                    color: PIECE_COLORS[(appState.pieces.length + resultPieces.length) % PIECE_COLORS.length]
                });
            }
        });

        return resultPieces;
    }

    function applySketchPieces(replaceCurrent) {
        const newPieces = collectEditedOcrPieces();
        if (newPieces.length === 0) {
            showToast('Nenhuma peça válida encontrada para importar.', 'error');
            return;
        }

        // Aplica chapa detectada se selecionado
        if (chkApplyDetectedSheet && chkApplyDetectedSheet.checked && currentExtractedData && currentExtractedData.sheet_detected) {
            const sd = currentExtractedData.sheet_detected;
            if (sd.length && sd.width) {
                if (sheetWidthInput) sheetWidthInput.value = Math.max(sd.length, sd.width);
                if (sheetHeightInput) sheetHeightInput.value = Math.min(sd.length, sd.width);
            }
        }

        if (replaceCurrent) {
            appState.pieces = newPieces;
        } else {
            newPieces.forEach(np => {
                np.id = appState.pieces.length + 1;
                np.color = PIECE_COLORS[appState.pieces.length % PIECE_COLORS.length];
                appState.pieces.push(np);
            });
        }

        renderPieceList();
        clearResults();
        updateSaveStatus(false);
        if (sketchModal) sketchModal.style.display = 'none';

        showToast(`🎉 ${newPieces.length} peças importadas do rascunho com sucesso!`, 'success');
        
        const pieceCard = document.querySelector('.piece-list-card');
        if (pieceCard) {
            pieceCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    if (btnApplySketchReplace) {
        btnApplySketchReplace.onclick = () => applySketchPieces(true);
    }

    if (btnApplySketchAppend) {
        btnApplySketchAppend.onclick = () => applySketchPieces(false);
    }

    // Modais Legais Específicos
    document.querySelectorAll('#openPrivacyModal, #openTermsModal').forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            const modalId = link.id.replace('open', '').toLowerCase() + 'Modal';
            const m = document.getElementById(modalId);
            if (m) m.style.display = 'flex';
        };
    });

    document.querySelectorAll('.close-legal').forEach(btn => {
        btn.onclick = () => btn.closest('.modal').style.display = 'none';
    });

    window.onclick = (e) => { if (e.target.classList.contains('modal')) e.target.style.display = 'none'; };

    // Inicialização
    checkStatus();
});

// Injeção de CSS de Toasts
if (!document.getElementById('toast-style')) {
    const s = document.createElement('style');
    s.id = 'toast-style';
    s.textContent = `
        #toastContainer { position: fixed; bottom: 20px; right: 20px; z-index: 10001; }
        .toast { background: rgba(26, 26, 26, 0.95); border-left: 5px solid #bd93f9; color: #fff; padding: 12px 25px; border-radius: 8px; margin-top: 10px; backdrop-filter: blur(10px); box-shadow: 0 10px 30px rgba(0,0,0,0.5); animation: toastIn 0.3s ease-out; font-size: 0.9rem; }
        .toast.success { border-left-color: #50fa7b; }
        .toast.error { border-left-color: #ff5555; }
        @keyframes toastIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    `;
    document.head.appendChild(s);
}
