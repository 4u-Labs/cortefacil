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
    const submitBonusBtn = document.getElementById('submitBonusPassword');
    const closeBonusBtn = document.getElementById('closeBonusModal');

    // --- Paleta de Cores Elegante para Peças ---
    const PIECE_COLORS = [
        '#52b788', '#74b9b0', '#b8a6cf', '#cfb58c', '#7dace0', '#d89aa5'
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
        showLabels: false,
        selectedPieceId: null,
        activeSheetIndex: 0,
        material: 'wood'
    };

    const Core = window.CorteWorkspace;
    const t = (pt, en) => window.CorteI18n ? window.CorteI18n.t(pt, en) : pt;
    const escapeHtml = Core.escapeHtml;
    let editingPieceId = null;
    let workspaceTab = 'sheet';
    let inputTab = 'sheet';
    let workspaceReady = false;
    function sheetSettings() {
        return {width:Number(sheetWidthInput.value),height:Number(sheetHeightInput.value),kerf:Number(kerfInput.value),trim:Number(trimMarginInput.value),allowRotation:allowRotationCheckbox.checked};
    }
    function updateWorkspaceSummary() {
        const {types,units} = Core.pieceSummary(appState.pieces);
        const summary = document.getElementById('workspaceSummary');
        if (summary) summary.textContent = `${types} ${t('tipos','types')} · ${units} ${t('unidades','units')}`;
        const unitCount = document.getElementById('workspacePieceCount');
        if (unitCount) unitCount.textContent = units;
        const status = document.getElementById('workspaceStatus');
        if (status) status.textContent = appState.results ? t('Plano atualizado','Plan up to date') : (units ? t('Gere o plano após conferir as peças','Review the pieces, then generate the plan') : t('Comece pela chapa ou experimente um exemplo','Choose a sheet or try an example'));
        if (optimizeBtn) optimizeBtn.disabled = units === 0;
    }
    function selectWorkspaceTab(name, focus = false) {
        if (!['sheet','pieces','plan'].includes(name)) return;
        workspaceTab = name;
        if (name !== 'plan') inputTab = name;
        const mobile = window.matchMedia('(max-width: 900px)').matches;
        document.body.dataset.workspaceTab = name;
        document.querySelectorAll('[data-workspace-panel]').forEach(panel => {
            const key = panel.dataset.workspacePanel;
            panel.hidden = mobile ? key !== name : (key === 'plan' ? false : key !== inputTab);
        });
        document.querySelectorAll('[data-workspace-tab]').forEach(tab => {
            const selected = tab.dataset.workspaceTab === (mobile ? name : inputTab);
            tab.setAttribute('aria-selected', String(selected));
            tab.tabIndex = selected ? 0 : -1;
            if (selected && focus) tab.focus();
        });
        if (appState.results) requestAnimationFrame(() => renderResults());
    }
    function updatePresetVisibility() {
        document.querySelectorAll('#presetsGrid .preset-btn').forEach(button => {
            const material = button.dataset.presetMaterial || button.dataset.material || button.getAttribute('onclick')?.match(/'(wood|glass|metal|acrylic|custom)'/)?.[1];
            button.hidden = Boolean(material && material !== materialTypeSelect.value && !['acrylic','custom'].includes(materialTypeSelect.value));
        });
    }
    function selectPiece(id, options = {}) {
        const piece = appState.pieces.find(p => p.id === Number(id));
        if (!piece) return;
        appState.selectedPieceId = piece.id;
        if (appState.results && !appState.results[appState.activeSheetIndex]?.rects.some(r=>r.piece.id===piece.id)) {
            const index=appState.results.findIndex(s=>s.rects.some(r=>r.piece.id===piece.id));
            if(index>=0) appState.activeSheetIndex=index;
        }
        pieceTableBody?.querySelectorAll('tr[data-piece-id]').forEach(row => {
            const selected=Number(row.dataset.pieceId)===piece.id;
            row.classList.toggle('selected',selected);
            row.querySelector('.piece-select-btn')?.setAttribute('aria-pressed',String(selected));
        });
        if (appState.results) renderResults();
        if (options.showList) {
            selectWorkspaceTab('pieces');
            requestAnimationFrame(()=>document.querySelector(`tr[data-piece-id="${piece.id}"] .piece-select-btn`)?.focus({preventScroll:false}));
        }
    }
    function renderSelectedPieceDetails() {
        const target=document.getElementById('selectedPieceDetails');
        if(!target || !appState.results) return;
        const selected=appState.pieces.find(p=>p.id===appState.selectedPieceId);
        target.hidden=!selected;
        if(!selected) return;
        const edges=selected.edgeBanding||{};
        const sides=[edges.top?t('superior','top'):null,edges.bottom?t('inferior','bottom'):null,edges.left?t('esquerda','left'):null,edges.right?t('direita','right'):null].filter(Boolean).join(', ')||t('nenhuma','none');
        target.innerHTML=`<label for="selectedPieceSelect">${t('Peça selecionada','Selected piece')}</label><select id="selectedPieceSelect">${appState.pieces.map(p=>`<option value="${p.id}" ${p.id===selected.id?'selected':''}>#${p.id} · ${escapeHtml(p.label)}</option>`).join('')}</select><div class="selected-piece-heading" data-user-content><strong>#${selected.id} · ${escapeHtml(selected.label)}</strong></div><div class="selected-piece-specs">${selected.width} × ${selected.height} mm · ${selected.quantity} ${t('unidades','units')}</div>${appState.material==='wood'?`<div>${t('Fita de borda','Edge banding')}: ${sides}</div>`:''}<div class="selected-piece-actions"><button type="button" id="viewSelectedInList" class="control-button secondary small-btn">${t('Ver na lista','View in list')}</button><button type="button" id="editSelectedPiece" class="control-button secondary small-btn">${t('Editar peça','Edit piece')}</button></div>`;
        target.querySelector('select').setAttribute('data-user-content','');
        target.querySelector('select').addEventListener('change',e=>selectPiece(Number(e.target.value)));
        target.querySelector('#viewSelectedInList').addEventListener('click',()=>selectPiece(selected.id,{showList:true}));
        target.querySelector('#editSelectedPiece').addEventListener('click',()=>editPiece(selected.id));
    }
    function cancelPieceEdit() {
        editingPieceId=null;
        const cancel=document.getElementById('cancelEditPieceBtn');
        if(cancel) cancel.hidden=true;
        if(confirmAddPieceBtn) confirmAddPieceBtn.textContent=t('Inserir peça na lista','Add piece to list');
    }
    function editPiece(id) {
        const piece=appState.pieces.find(p=>p.id===Number(id));
        if(!piece) return;
        editingPieceId=piece.id;
        newPieceLabelInput.value=piece.label;
        newPieceWidthInput.value=piece.width;
        newPieceHeightInput.value=piece.height;
        newPieceQuantityInput.value=piece.quantity;
        const edges=piece.edgeBanding||{};
        [[edgeTop,'top'],[edgeBottom,'bottom'],[edgeLeft,'left'],[edgeRight,'right']].forEach(([el,key])=>{if(el)el.checked=Boolean(edges[key]);});
        if(confirmAddPieceBtn) confirmAddPieceBtn.textContent=t('Salvar alterações','Save changes');
        const cancel=document.getElementById('cancelEditPieceBtn');
        if(cancel) cancel.hidden=false;
        selectWorkspaceTab('pieces');
        newPieceLabelInput.focus();
    }
    function duplicatePiece(id) {
        const original=appState.pieces.find(p=>p.id===Number(id));
        if(!original) return;
        if(appState.pieces.length>=Core.MAX_TYPES || Core.pieceSummary(appState.pieces).units+original.quantity>Core.MAX_UNITS) return showToast(t('Limite de peças atingido. Divida o projeto.','Piece limit reached. Split the project.'),'error');
        const copy={...original,id:Core.nextPieceId(appState.pieces),edgeBanding:{...original.edgeBanding}};
        appState.pieces.push(copy);
        appState.selectedPieceId=copy.id;
        clearResults();renderPieceList();updateSaveStatus(false);
    }
    function setupWorkspace() {
        // A filtered/transformed shell creates a containing block for fixed elements.
        // Keep every dialog directly under body so it opens in the visible viewport.
        const dialogs=Core.mountDialogs(document);
        const printReport=document.getElementById('printReportContainer');if(printReport)document.body.appendChild(printReport);
        let lastFocus=null,activeDialog=null;
        function syncDialogs() {
            const open=dialogs.find(m=>m.style.display && m.style.display!=='none');
            document.body.classList.toggle('has-open-modal',Boolean(open));
            dialogs.forEach(m=>m.setAttribute('aria-hidden',String(m!==open)));
            if(open && open!==activeDialog){lastFocus=document.activeElement;activeDialog=open;(open.querySelector('button:not([disabled]),input:not([type="hidden"]),select,textarea')||open).focus({preventScroll:true});}
            else if(!open && activeDialog){activeDialog=null;lastFocus?.focus?.({preventScroll:true});if(typeof stopLiveCamera==='function') stopLiveCamera();if(paymentPollInterval)clearInterval(paymentPollInterval);}
        }
        dialogs.forEach((dialog,index)=>{
            document.body.appendChild(dialog);
            dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-hidden','true');dialog.tabIndex=-1;
            const title=dialog.querySelector('h2,h3');if(title){if(!title.id)title.id='corte-dialog-title-'+index;dialog.setAttribute('aria-labelledby',title.id);}
            new MutationObserver(syncDialogs).observe(dialog,{attributes:true,attributeFilter:['style']});
        });
        document.addEventListener('keydown',e=>{
            if(!activeDialog) return;
            if(e.key==='Escape'){activeDialog.style.display='none';e.preventDefault();}
            if(e.key==='Tab'){
                const items=[...activeDialog.querySelectorAll('button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),a[href]')].filter(el=>el.getClientRects().length);
                if(!items.length){e.preventDefault();return;}
                const first=items[0],last=items[items.length-1];
                if(e.shiftKey && document.activeElement===first){last.focus();e.preventDefault();}
                else if(!e.shiftKey && document.activeElement===last){first.focus();e.preventDefault();}
            }
        });
        document.querySelectorAll('[data-workspace-tab]').forEach(tab=>{
            tab.addEventListener('click',()=>selectWorkspaceTab(tab.dataset.workspaceTab));
            tab.addEventListener('keydown',e=>{
                if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
                const tabs=[...document.querySelectorAll('[data-workspace-tab]')].filter(el=>el.getClientRects().length);
                const idx=tabs.indexOf(tab);const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(idx+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
                e.preventDefault();selectWorkspaceTab(tabs[next].dataset.workspaceTab,true);
            });
        });
        document.getElementById('cancelEditPieceBtn')?.addEventListener('click',()=>{cancelPieceEdit();newPieceLabelInput.value='';newPieceWidthInput.value='';newPieceHeightInput.value='';newPieceQuantityInput.value='1';});
        document.getElementById('activeSheetSelect')?.addEventListener('change',e=>{appState.activeSheetIndex=Number(e.target.value);appState.selectedPieceId=appState.results?.[appState.activeSheetIndex]?.rects[0]?.piece.id||null;renderResults();});
        const fullscreenBtn=document.getElementById('fullscreenPlanBtn');
        fullscreenBtn?.addEventListener('click',async()=>{
            const area=document.getElementById('resultsSection');
            try{if(document.fullscreenElement)await document.exitFullscreen();else if(area?.requestFullscreen)await area.requestFullscreen();else{area?.classList.toggle('expanded-plan');renderResults();}}catch{area?.classList.toggle('expanded-plan');renderResults();}
        });
        document.addEventListener('fullscreenchange',()=>{requestAnimationFrame(()=>renderResults());});
        [sheetWidthInput,sheetHeightInput,kerfInput,trimMarginInput,allowRotationCheckbox,cutAlgorithmSelect].forEach(el=>el?.addEventListener('change',()=>{clearResults();updateSaveStatus(false);}));
        [clientNameInput,projectNameInput].forEach(el=>el?.addEventListener('input',()=>updateSaveStatus(false)));
        materialTypeSelect?.addEventListener('change',()=>{updatePresetVisibility();clearResults();updateSaveStatus(false);});
        let resizeTimer;
        window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>selectWorkspaceTab(workspaceTab),100);});
        let lastResultWidth=0;
        if(window.ResizeObserver && cutPlanOutput){new ResizeObserver(entries=>{const width=Math.round(entries[0].contentRect.width);if(width>0 && width!==lastResultWidth){lastResultWidth=width;if(appState.results)requestAnimationFrame(()=>renderResults());}}).observe(cutPlanOutput);}
        window.addEventListener('cortefacil:languagechange',()=>{renderPieceList();if(appState.results)renderResults();updateWorkspaceSummary();if(editingPieceId)confirmAddPieceBtn.textContent=t('Salvar alterações','Save changes');});
        let installPrompt=null;
        const install=document.getElementById('installAppButton');
        const standalone=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone;
        if(install)install.hidden=Boolean(standalone);
        window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;});
        window.addEventListener('appinstalled',()=>{installPrompt=null;if(install)install.hidden=true;});
        install?.addEventListener('click',async()=>{if(installPrompt){await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;}else{customConfirm(t('Para instalar: no Android ou computador, abra o menu do navegador e escolha Instalar app. No iPhone/iPad, use Compartilhar → Adicionar à Tela de Início.','To install: on Android or desktop, open the browser menu and choose Install app. On iPhone/iPad, use Share → Add to Home Screen.'),()=>{});}});
        updatePresetVisibility();selectWorkspaceTab('sheet');updateWorkspaceSummary();
        const status=document.getElementById('saveStatus');if(status)status.textContent=t('Projeto nesta aba','Project in this tab');
        workspaceReady=true;
    }

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
            const r = await fetch(`api.php?action=check_status&fingerprint=${fp}`, { headers });
            const res = await r.json();
            if (res.status === 'success') {
                appState.credits = parseInt(res.data.credits);
                appState.isPro = res.data.is_pro == 1;
                appState.bonusActive = res.data.bonus_active == 1;

                if (res.uid) {
                    const display = document.getElementById('userAccessId');
                    if (display) display.innerText = res.uid.toUpperCase();
                }

                const dynamicWrapper = document.getElementById('keepai-dynamic-wrapper');
                if (dynamicWrapper) {
                    if (res.mode === 'keepai' && res.data.email) {
                        dynamicWrapper.innerHTML = `
                            <div id="keepai-logged-in-box" style="display: flex; text-align: center; padding: 15px; background: rgba(0, 229, 255, 0.05); border: 1px solid rgba(0, 229, 255, 0.3); border-radius: 12px; flex-direction: column; gap: 10px;">
                                <p style="font-size: 0.8rem; color: #fff; margin: 0;"><i class="fa-solid fa-circle-check" style="color: #50fa7b;"></i> Conectado ao ecossistema Keep AI</p>
                                <div id="keepaiUserEmail" style="font-weight: bold; color: var(--primary-color); font-size: 0.95rem; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px; font-family: monospace;">${res.data.email}</div>
                                <button id="btnKeepaiLogout" class="control-button secondary small-btn" style="width: 100%; min-height: 36px; background: rgba(255, 85, 85, 0.1); border-color: #ff5555; color: #ff5555; font-weight: bold;" onclick="handleKeepaiLogout()">DESCONECTAR</button>
                            </div>
                        `;
                    } else {
                        dynamicWrapper.innerHTML = `
                            <form id="keepai-login-form" autocomplete="off" onsubmit="return false;" style="display: flex; flex-direction: column; gap: 10px;">
                                <p style="font-size:0.75rem; color:#ccc; margin: 0 0 5px 0;">Acesse ou crie sua conta para salvar, unificar e usar seus créditos em todos os apps da 4uLabs:</p>
                                <input type="email" id="keepaiEmail" placeholder="E-mail" autocomplete="off" data-lpignore="true" data-safepass-ignore="true" style="font-size:0.9rem; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--glass-border); color: #fff;">
                                <input type="password" id="keepaiPassword" placeholder="Senha Keep AI" autocomplete="off" data-lpignore="true" data-safepass-ignore="true" style="font-size:0.9rem; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--glass-border); color: #fff;">
                                <div style="display: flex; gap: 8px; margin-top: 5px;">
                                    <button id="btnKeepaiLogin" type="button" class="control-button optimize small-btn" style="flex: 1; font-weight: bold;" onclick="handleKeepaiAuth('login')">ENTRAR</button>
                                    <button id="btnKeepaiRegister" type="button" class="control-button secondary small-btn" style="flex: 1; font-weight: bold;" onclick="handleKeepaiAuth('register')">CADASTRAR</button>
                                </div>
                            </form>
                        `;
                    }
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

        updatePresetVisibility();clearResults();updateSaveStatus(false);
        showToast(t('Tamanho de chapa aplicado.','Sheet preset applied.'), 'info');
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
        cancelPieceEdit();
        appState.activeSheetIndex = 0;
        appState.selectedPieceId = 1;
        appState.pieces = demoPieces.map((p, idx) => ({
            id: idx + 1,
            label: p.label,
            width: p.width,
            height: p.height,
            quantity: p.quantity,
            edgeBanding: p.edgeBanding,
            color: PIECE_COLORS[idx % PIECE_COLORS.length]
        }));

        renderPieceList();
        updatePresetVisibility();
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
        showToast(t('Projeto de exemplo carregado e otimizado.','Sample project loaded and optimized.'), 'success');

        selectWorkspaceTab('plan');
        const resultsEl = document.getElementById('resultsSection');
        if (resultsEl && window.matchMedia('(max-width: 900px)').matches) {
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
        const width=Number(newPieceWidthInput.value),height=Number(newPieceHeightInput.value),quantity=Number(newPieceQuantityInput.value);
        const label=newPieceLabelInput.value.trim().slice(0,160)||t('Peça','Piece')+' '+Core.nextPieceId(appState.pieces);
        const checked=Core.validatePiece({width,height,quantity},sheetSettings());
        if(!checked.valid){
            const message=checked.error==='fit'?t('A peça não cabe na área útil da chapa. Confira refilo e rotação.','The piece does not fit the usable sheet area. Check trim and rotation.'):t('Informe medidas positivas e uma quantidade inteira válida.','Enter positive dimensions and a valid whole quantity.');
            showToast(message,'error');const error=document.getElementById('pieceInputError');if(error){error.hidden=false;error.style.display='block';error.textContent=message;error.setAttribute('role','alert');}return;
        }
        const current=appState.pieces.find(p=>p.id===editingPieceId);
        if((!current && appState.pieces.length>=Core.MAX_TYPES)||Core.pieceSummary(appState.pieces).units-(current?.quantity||0)+quantity>Core.MAX_UNITS)return showToast(t('Limite de peças atingido. Divida o projeto.','Piece limit reached. Split the project.'),'error');
        const id=current?.id||Core.nextPieceId(appState.pieces);
        const piece={id,label,width,height,quantity,color:current?.color||PIECE_COLORS[appState.pieces.length%PIECE_COLORS.length],edgeBanding:{top:Boolean(edgeTop?.checked),bottom:Boolean(edgeBottom?.checked),left:Boolean(edgeLeft?.checked),right:Boolean(edgeRight?.checked)}};
        if(current)appState.pieces[appState.pieces.indexOf(current)]=piece;else appState.pieces.push(piece);
        appState.selectedPieceId=id;
        cancelPieceEdit();clearResults();renderPieceList();updateSaveStatus(false);
        newPieceWidthInput.value='';newPieceHeightInput.value='';newPieceQuantityInput.value='1';newPieceLabelInput.value='';
        [edgeTop,edgeBottom,edgeLeft,edgeRight].forEach(el=>{if(el)el.checked=false;});
        const error=document.getElementById('pieceInputError');if(error)error.style.display='none';
        newPieceLabelInput.focus();
        showToast(current?t('Peça atualizada. Gere o plano novamente.','Piece updated. Generate the plan again.'):t('Peça adicionada à lista.','Piece added to the list.'),'success');
    }
    function removePiece(index) {
        const removed=appState.pieces[index];if(!removed)return;
        if(editingPieceId===removed.id)cancelPieceEdit();
        appState.pieces.splice(index,1);
        if(appState.selectedPieceId===removed.id)appState.selectedPieceId=appState.pieces[0]?.id||null;
        clearResults();renderPieceList();updateSaveStatus(false);
    }
    function renderPieceList() {
        if(!pieceTableBody)return;
        const summary=Core.pieceSummary(appState.pieces);
        if(pieceCountSpan)pieceCountSpan.textContent=summary.units;
        const typeCount=document.getElementById('pieceTypeCount');if(typeCount)typeCount.textContent=summary.types;
        if(clearAllPiecesBtn)clearAllPiecesBtn.disabled=!summary.types;
        if(optimizeBtn)optimizeBtn.disabled=!summary.types;
        if(!summary.types){pieceTableBody.innerHTML=`<tr><td colspan="6" class="empty-pieces-text">${t('Adicione uma peça ou importe uma lista para começar.','Add a piece or import a list to get started.')}</td></tr>`;updateWorkspaceSummary();return;}
        pieceTableBody.innerHTML=appState.pieces.map(p=>{
            const edges=p.edgeBanding||{};
            const names=[edges.top?t('Superior','Top'):null,edges.bottom?t('Inferior','Bottom'):null,edges.left?t('Esquerda','Left'):null,edges.right?t('Direita','Right'):null].filter(Boolean);
            const edgeHtml=appState.material==='wood'?(names.length?names.join(', '):t('Nenhuma','None')):'—';
            const selected=p.id===appState.selectedPieceId;
            return `<tr class="piece-row${selected?' selected':''}" id="piece-row-${p.id}" data-piece-id="${p.id}"><td data-label="#"><span class="piece-tag" style="border-left:3px solid ${p.color}">#${p.id}</span></td><td data-label="${t('Descrição','Description')}"><button type="button" class="piece-select-btn" data-action="select" data-id="${p.id}" aria-pressed="${selected}" data-user-content>${escapeHtml(p.label)}</button></td><td data-label="${t('Medidas','Dimensions')}">${p.width} × ${p.height} mm</td><td data-label="${t('Quantidade','Quantity')}">${p.quantity} ${t('un.','units')}</td><td data-label="${t('Bordas','Edges')}">${edgeHtml}</td><td data-label="${t('Ações','Actions')}"><div class="piece-row-actions"><button type="button" class="btn-edit-piece" data-action="edit" data-id="${p.id}" aria-label="${t('Editar peça','Edit piece')} #${p.id}">${t('Editar','Edit')}</button><button type="button" class="btn-duplicate-piece" data-action="duplicate" data-id="${p.id}" aria-label="${t('Duplicar peça','Duplicate piece')} #${p.id}">${t('Duplicar','Duplicate')}</button><button type="button" class="btn-del-piece" data-action="delete" data-id="${p.id}" aria-label="${t('Excluir peça','Delete piece')} #${p.id}"><i class="fa-solid fa-trash" aria-hidden="true"></i></button></div></td></tr>`;
        }).join('');
        updateWorkspaceSummary();
    }
    pieceTableBody?.addEventListener('click',event=>{
        const button=event.target.closest('button[data-action]');if(!button)return;
        const id=Number(button.dataset.id);
        if(button.dataset.action==='select')selectPiece(id);
        if(button.dataset.action==='edit')editPiece(id);
        if(button.dataset.action==='duplicate')duplicatePiece(id);
        if(button.dataset.action==='delete')removePiece(appState.pieces.findIndex(p=>p.id===id));
    });
    window.deletePieceItem=index=>removePiece(index);
    if(clearAllPiecesBtn)clearAllPiecesBtn.onclick=()=>customConfirm(t('Deseja realmente limpar todas as peças da lista?','Clear all pieces from the list?'),()=>{appState.pieces=[];appState.selectedPieceId=null;cancelPieceEdit();clearResults();renderPieceList();updateSaveStatus(false);});

    function updateSaveStatus(saved) {
        appState.isSaved = saved;
        const status = document.getElementById('saveStatus');
        if (status) {
            status.textContent = saved ? t('Projeto exportado', 'Project exported') : t('Alterações não exportadas', 'Unexported changes');
            status.className = saved ? 'save-status saved' : 'save-status unsaved';
        }
        updateWorkspaceSummary();
    }

    // ================================================================
    // MOTOR DE OTIMIZAÇÃO 2D MULTI-HEURÍSTICO (UNIVERSAL)
    // ================================================================

    // 1. Pack com Guilhotina 2D (Linear de ponta a ponta - Ideal p/ Vidro e Serras)
    function runMultiHeuristicOptimization(...args) {
        return window.CorteOptimizer.runMultiHeuristicOptimization(...args);
    }

    // --- Execução da Otimização ---
    function optimize() {
        if(appState.credits<=0 && !appState.isPro && !appState.bonusActive){showToast(t('Créditos insuficientes. Recarregue para continuar.','Insufficient credits. Top up to continue.'),'error');if(paymentModal)paymentModal.style.display='flex';return;}
        if(!appState.pieces.length)return;
        const sheet=sheetSettings();
        const invalid=appState.pieces.find(p=>!Core.validatePiece(p,sheet).valid);
        if(invalid){showToast(t('Confira as medidas, refilo e rotação. A peça não cabe na área útil:','Check dimensions, trim and rotation. Piece does not fit:')+' #'+invalid.id,'error');return;}
        try{
            const flat=appState.pieces.flatMap(p=>Array.from({length:p.quantity},()=>({id:p.id,label:p.label,w:p.width,h:p.height,color:p.color,edgeBanding:p.edgeBanding})));
            appState.results=runMultiHeuristicOptimization(flat,sheet.width,sheet.height,sheet.kerf,sheet.trim,sheet.allowRotation,cutAlgorithmSelect.value);
            appState.activeSheetIndex=0;
            appState.selectedPieceId=appState.results[0]?.rects[0]?.piece.id||null;
            selectWorkspaceTab('plan');renderResults();
            showToast(t('Plano de corte gerado.','Cutting plan generated.'),'success');
            if(!appState.isPro && !appState.bonusActive)deductCredit();
        }catch(error){clearResults();showToast(t('Não foi possível gerar o plano. Confira medidas e quantidade.','Could not generate the plan. Check dimensions and quantities.'),'error');}
    }

    async function deductCredit() {
        const fp = await getFingerprint();
        const token = localStorage.getItem('keepai_token');
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        try {
            await fetch(`api.php?action=use_credit&fingerprint=${fp}`, { method: 'POST', headers });
            checkStatus();
        } catch (e) { }
    }

    // --- Renderização Visual no Canvas ---
    function renderResults() {
        if(!cutPlanOutput || !appState.results?.length)return;
        cutPlanOutput.innerHTML='';
        const sW=Number(sheetWidthInput.value),sH=Number(sheetHeightInput.value),trim=Number(trimMarginInput.value)||0;
        appState.activeSheetIndex=Math.max(0,Math.min(appState.activeSheetIndex,appState.results.length-1));
        let usedArea=0,edgeMeters=0;
        const nav=document.getElementById('planSheetNavigation'),picker=document.getElementById('activeSheetSelect');
        if(nav)nav.hidden=false;
        if(picker)picker.innerHTML=appState.results.map((s,i)=>`<option value="${i}" ${i===appState.activeSheetIndex?'selected':''}>${t('Chapa','Sheet')} ${i+1} / ${appState.results.length} · ${s.rects.length} ${t('peças','pieces')}</option>`).join('');
        appState.results.forEach((sheet,index)=>{
            const wrapper=document.createElement('div');wrapper.className='canvas-wrapper';wrapper.hidden=index!==appState.activeSheetIndex;
            wrapper.innerHTML=`<div class="canvas-header-bar"><h3 class="canvas-sheet-title">${t('Chapa','Sheet')} ${index+1} / ${appState.results.length} <span>${sW} × ${sH} mm</span></h3><span class="canvas-pieces-count">${sheet.rects.length} ${t('peças','pieces')}</span></div>`;
            const scroll=document.createElement('div');scroll.className='canvas-scroll';
            const stage=document.createElement('div');stage.className='canvas-stage';
            const canvas=document.createElement('canvas');canvas.className='sheet-cut-canvas';
            const available=cutPlanOutput.clientWidth||(window.innerWidth<600?window.innerWidth-64:700);
            const width=Math.max(180,Math.min(available-32,1100))*appState.canvasZoom,height=width*sH/sW;
            stage.style.position='relative';stage.style.width=width+'px';stage.style.maxWidth='none';
            const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.width=width+'px';canvas.style.height=height+'px';
            const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);const scale=width/sW;
            ctx.fillStyle='#15231d';ctx.fillRect(0,0,width,height);
            ctx.strokeStyle='#8c9e92';ctx.lineWidth=1;ctx.strokeRect(.5,.5,width-1,height-1);
            if(trim>0){ctx.strokeStyle='#718879';ctx.setLineDash([4,4]);ctx.strokeRect(trim*scale,trim*scale,(sW-2*trim)*scale,(sH-2*trim)*scale);ctx.setLineDash([]);}
            stage.appendChild(canvas);
            sheet.rects.forEach(r=>{
                usedArea+=r.w*r.h;
                const x=r.x*scale,y=r.y*scale,w=r.w*scale,h=r.h*scale,selected=r.piece.id===appState.selectedPieceId;
                const color=/^#[a-f\d]{6}$/i.test(r.piece.color)?r.piece.color:'#52b788';
                ctx.fillStyle=selected?'#276b4c':color+'35';ctx.fillRect(x,y,w,h);ctx.strokeStyle=selected?'#a1f0bd':'#b0c4b7';ctx.lineWidth=selected?2.5:1;ctx.strokeRect(x,y,w,h);
                const eb=r.piece.edgeBanding||{};
                if(appState.material==='wood'){
                    ctx.strokeStyle='#e4c789';ctx.lineWidth=2.5;
                    const sides=[{has:(!r.rotated&&eb.top)||(r.rotated&&eb.left),a:[x,y],b:[x+w,y],length:r.w},{has:(!r.rotated&&eb.bottom)||(r.rotated&&eb.right),a:[x,y+h],b:[x+w,y+h],length:r.w},{has:(!r.rotated&&eb.left)||(r.rotated&&eb.bottom),a:[x,y],b:[x,y+h],length:r.h},{has:(!r.rotated&&eb.right)||(r.rotated&&eb.top),a:[x+w,y],b:[x+w,y+h],length:r.h}];
                    sides.forEach(side=>{if(side.has){ctx.beginPath();ctx.moveTo(...side.a);ctx.lineTo(...side.b);ctx.stroke();edgeMeters+=side.length/1000;}});
                }
                ctx.save();ctx.beginPath();ctx.rect(x+2,y+2,Math.max(0,w-4),Math.max(0,h-4));ctx.clip();ctx.fillStyle='#f0f7f2';ctx.font='600 12px system-ui, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
                if(w>18&&h>17){const label=Core.fitCanvasLabel('#'+r.piece.id,w-6,text=>ctx.measureText(text).width);ctx.fillText(label,x+w/2,y+h/2);}
                if(appState.showLabels&&w>105&&h>60){ctx.textAlign='left';ctx.textBaseline='top';ctx.font='12px system-ui, sans-serif';ctx.fillText(Core.fitCanvasLabel(r.piece.label,w-12,text=>ctx.measureText(text).width),x+6,y+6);ctx.fillText(Core.fitCanvasLabel(`${r.w} × ${r.h} mm${r.rotated?' ↻':''}`,w-12,text=>ctx.measureText(text).width),x+6,y+h-19);}
                ctx.restore();
                const hit=document.createElement('button');hit.type='button';hit.className='canvas-hit-target';hit.dataset.pieceId=r.piece.id;hit.setAttribute('aria-label',`#${r.piece.id} ${r.piece.label}, ${r.w} × ${r.h} mm`);hit.setAttribute('aria-pressed',String(selected));hit.style.cssText=`position:absolute;left:${r.x/sW*100}%;top:${r.y/sH*100}%;width:${r.w/sW*100}%;height:${r.h/sH*100}%;`;
                hit.addEventListener('click',()=>selectPiece(r.piece.id));stage.appendChild(hit);
            });
            scroll.appendChild(stage);wrapper.appendChild(scroll);cutPlanOutput.appendChild(wrapper);
        });
        const waste=Math.max(0,(1-usedArea/(sW*sH*appState.results.length))*100),efficiency=100-waste;
        const locale=window.CorteI18n?.language==='en'?'en-US':'pt-BR';
        if(metricsGrid)metricsGrid.style.display='grid';if(zoomToolbar)zoomToolbar.style.display='flex';
        document.getElementById('metricSheetsCount').textContent=appState.results.length;
        document.getElementById('metricEfficiency').textContent=efficiency.toLocaleString(locale,{minimumFractionDigits:1,maximumFractionDigits:1})+'%';
        document.getElementById('metricWaste').textContent=waste.toLocaleString(locale,{minimumFractionDigits:1,maximumFractionDigits:1})+'%';
        document.getElementById('metricEdgeMeters').textContent=edgeMeters.toFixed(1)+' m';
        const edgeCard=document.getElementById('metricEdgeCard');if(edgeCard)edgeCard.style.display=appState.material==='wood'?'flex':'none';
        recalculateCosts();
        if(wasteInfo)wasteInfo.textContent=t('Confira medidas, bordas e rotação antes de produzir.','Check dimensions, edge banding and rotation before production.');
        if(printPlanBtn)printPlanBtn.disabled=false;
        renderSelectedPieceDetails();updateWorkspaceSummary();
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
        appState.activeSheetIndex = 0;
        const detail = document.getElementById('selectedPieceDetails');
        if (detail) detail.hidden = true;
        const nav = document.getElementById('planSheetNavigation');
        if (nav) nav.hidden = true;
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
        if (wasteInfo) wasteInfo.textContent = t('Gere o plano para conferir a distribuição atual das peças.', 'Generate the plan to review the current piece layout.');
        updateWorkspaceSummary();
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
        if (btn) {btn.textContent=t('Detalhes','Details');btn.setAttribute('aria-pressed',String(appState.showLabels));}
        renderResults();
    };

    // --- Impressão de Ordem de Serviço A4 Limpa ---
    window.printCutPlan = function() {
        if (!appState.results || appState.results.length === 0) return;

        const client = escapeHtml(clientNameInput.value.trim() || t('Não informado', 'Not provided'));
        const project = escapeHtml(projectNameInput.value.trim() || t('Plano de Corte', 'Cutting plan'));
        const mat = escapeHtml(materialTypeSelect.options[materialTypeSelect.selectedIndex].text);
        const sW = sheetWidthInput.value;
        const sH = sheetHeightInput.value;
        const kerf = kerfInput.value;
        const efficiency = document.getElementById('metricEfficiency').innerText;
        const waste = document.getElementById('metricWaste').innerText;
        const edgeMeters = document.getElementById('metricEdgeMeters').innerText;
        const dateStr = new Date().toLocaleDateString(window.CorteI18n?.language === 'en' ? 'en-US' : 'pt-BR');

        let rowsHtml = '';
        appState.pieces.forEach((p, idx) => {
            rowsHtml += `
                <tr>
                    <td>#${p.id}</td>
                    <td data-user-content><strong>${escapeHtml(p.label)}</strong></td>
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

        const diagrams = document.createElement('div');
        diagrams.className = 'print-diagrams';
        cutPlanOutput.querySelectorAll('canvas').forEach((canvas, index) => {
            const figure = document.createElement('figure');
            const caption = document.createElement('figcaption');
            caption.textContent = t('Chapa', 'Sheet') + ' ' + (index + 1);
            const image = document.createElement('img');
            image.src = canvas.toDataURL('image/png');
            image.alt = caption.textContent;
            image.style.maxWidth = '100%';
            figure.append(caption, image);
            diagrams.appendChild(figure);
        });
        reportContainer.appendChild(diagrams);
        window.CorteI18n?.apply(reportContainer);
        window.print();
    };

    // --- Exportar & Importar Projeto JSON ---
    window.exportProjectJSON = function() {
        if (appState.pieces.length === 0) {
            showToast('Nenhuma peça para exportar!', 'error');
            return;
        }

        const data = {
            version: '3.0',
            client: clientNameInput.value,
            project: projectNameInput.value,
            material: materialTypeSelect.value,
            sheet: {
                width: parseInt(sheetWidthInput.value),
                height: parseInt(sheetHeightInput.value),
                kerf: parseFloat(kerfInput.value),
                trim: parseFloat(trimMarginInput.value),
                allowRotation: allowRotationCheckbox.checked,
                algorithm: cutAlgorithmSelect.value
            },
            costs: {sheet: Number(sheetPriceInput.value) || 0, edge: Number(edgePriceInput.value) || 0},
            pieces: appState.pieces
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plano-corte-${(projectNameInput.value || 'projeto').toLowerCase().replace(/\s+/g, '-')}.json`;
        a.click();
        URL.revokeObjectURL(url);
        updateSaveStatus(true);
        showToast(t('Projeto exportado em JSON com sucesso!', 'Project exported as JSON.'), 'success');
    };

    window.importProjectJSON=function(event){
        const file=event.target.files[0];if(!file)return;
        if(file.size>5*1024*1024)return showToast(t('O projeto excede 5 MB.','Project exceeds 5 MB.'),'error');
        const reader=new FileReader();reader.onload=e=>{
            try{
                const data=JSON.parse(e.target.result);
                const pieces=Core.normalizePieces(data.pieces);
                const sheet={...sheetSettings(),...(data.sheet||{})};
                if(!Number.isFinite(Number(sheet.width))||!Number.isFinite(Number(sheet.height))||Number(sheet.width)<=0||Number(sheet.height)<=0||Number(sheet.trim)<0||Number(sheet.kerf)<0||Number(sheet.trim)*2>=Math.min(Number(sheet.width),Number(sheet.height)))throw Error('sheet');
                clientNameInput.value=String(data.client||'').slice(0,160);projectNameInput.value=String(data.project||'').slice(0,160);
                if(['wood','glass','metal','acrylic','custom'].includes(data.material)){materialTypeSelect.value=data.material;handleMaterialChange(data.material);}
                sheetWidthInput.value=sheet.width;sheetHeightInput.value=sheet.height;kerfInput.value=sheet.kerf;trimMarginInput.value=sheet.trim;
                if(typeof sheet.allowRotation==='boolean')allowRotationCheckbox.checked=sheet.allowRotation;
                if(['auto','guillotine','maxrects','shelf'].includes(sheet.algorithm))cutAlgorithmSelect.value=sheet.algorithm;
                if(data.costs){sheetPriceInput.value=Math.max(0,Number(data.costs.sheet)||0);edgePriceInput.value=Math.max(0,Number(data.costs.edge)||0);}
                appState.pieces=pieces;appState.selectedPieceId=pieces[0]?.id||null;cancelPieceEdit();clearResults();renderPieceList();updateSaveStatus(false);updatePresetVisibility();selectWorkspaceTab('pieces');showToast(t('Projeto importado. Confira as peças antes de gerar o plano.','Project imported. Review the pieces before generating the plan.'),'success');
            }catch{showToast(t('Arquivo de projeto inválido. Os dados atuais foram preservados.','Invalid project file. Current data was preserved.'),'error');}
            event.target.value='';
        };reader.readAsText(file);
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
                                id: Core.nextPieceId(appState.pieces),
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
                const r = await fetch(`api_mp_check.php?fingerprint=${fp}`, { headers });
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
            if (clicks >= 5) {
                const box = document.getElementById('bonusInputBox');
                if (box) {
                    box.innerHTML = '<input type="text" id="bonusPassword" placeholder="Digite o código mestre" autocomplete="off" data-safepass-ignore="true" data-lpignore="true" style="background: rgba(0,0,0,0.5); border: 1px solid var(--glass-border); color: #fff; padding: 15px; border-radius: 10px; width: 100%; text-align: center; font-size: 1.1rem; letter-spacing: 4px; -webkit-text-security: disc; text-security: disc;">';
                    const inp = document.getElementById('bonusPassword');
                    if (inp) inp.focus();
                }
                bonusModal.style.display = 'flex';
                clicks = 0;
            }
            setTimeout(() => clicks = 0, 3000);
        };
    }

    if (submitBonusBtn) {
        submitBonusBtn.onclick = async () => {
            const fp = await getFingerprint();
            const bonusInput = document.getElementById('bonusPassword');
            const pass = bonusInput ? bonusInput.value : '';
            try {
                const r = await fetch('api.php?action=activate_bonus', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `password=${encodeURIComponent(pass)}&fingerprint=${fp}`
                });
                const res = await r.json();
                if (res.status === 'success') {
                    bonusModal.style.display = 'none';
                    const box = document.getElementById('bonusInputBox');
                    if (box) box.innerHTML = '';
                    showToast('Bônus Pro Ativado!', 'success');
                    checkStatus();
                } else {
                    showToast('Senha incorreta', 'error');
                }
            } catch (e) { showToast('Erro de conexão', 'error'); }
        };
    }

    if (closeBonusBtn) {
        closeBonusBtn.onclick = () => {
            bonusModal.style.display = 'none';
            const box = document.getElementById('bonusInputBox');
            if (box) box.innerHTML = '';
        };
    }
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
                np.id = Core.nextPieceId(appState.pieces);
                np.color = PIECE_COLORS[appState.pieces.length % PIECE_COLORS.length];
                appState.pieces.push(np);
            });
        }

        renderPieceList();
        clearResults();
        updateSaveStatus(false);
        if (sketchModal) sketchModal.style.display = 'none';
        selectWorkspaceTab('pieces');

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
            const modalId = link.id === 'openPrivacyModal' ? 'privacyModal' : 'termsModal';
            const m = document.getElementById(modalId);
            if (m) m.style.display = 'flex';
        };
    });

    document.querySelectorAll('.close-legal').forEach(btn => {
        btn.onclick = () => btn.closest('.modal').style.display = 'none';
    });

    window.onclick = (e) => { if (e.target.classList.contains('modal')) e.target.style.display = 'none'; };

    // Inicialização
    setupWorkspace();
    renderPieceList();
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
