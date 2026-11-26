<?php
/** Corte Fácil — área de trabalho para configuração, peças e plano de corte. */
include 'ui_header.php';
?>

<nav class="workspace-tabs" role="tablist" aria-label="Etapas do projeto">
    <button type="button" id="workspaceTabSheet" role="tab" aria-controls="workspacePanelSheet" aria-selected="true" data-workspace-tab="sheet"><i class="fa-solid fa-layer-group" aria-hidden="true"></i> <span>Chapa</span></button>
    <button type="button" id="workspaceTabPieces" role="tab" aria-controls="workspacePanelPieces" aria-selected="false" data-workspace-tab="pieces"><i class="fa-solid fa-puzzle-piece" aria-hidden="true"></i> <span>Peças</span> <span class="tab-piece-count" id="workspacePieceCount">0</span></button>
    <button type="button" id="workspaceTabPlan" role="tab" aria-controls="workspacePanelPlan" aria-selected="false" data-workspace-tab="plan"><i class="fa-solid fa-chart-pie" aria-hidden="true"></i> <span>Plano</span></button>
</nav>

<main class="layout-grid">
    <div class="input-column">
        <section id="workspacePanelSheet" class="workspace-panel" role="tabpanel" aria-labelledby="workspaceTabSheet" data-workspace-panel="sheet">
            <div class="card project-card">
                <h2>Projeto e material</h2>
                <div class="form-group"><label for="projectName">Nome do projeto</label><input id="projectName" placeholder="Ex: Armário da cozinha" type="text" autocomplete="off" data-form-type="other"></div>
                <div class="form-group"><label for="clientName">Cliente / Marcenaria</label><input id="clientName" placeholder="Ex: João Silva" type="text" autocomplete="off" data-form-type="other"></div>
                <div class="form-group"><label for="materialType">Material</label><select id="materialType" class="select-material" onchange="handleMaterialChange(this.value)"><option value="wood" selected>Madeira / MDF / MDP / Compensado</option><option value="glass">Vidro / Espelho</option><option value="metal">Metal / Aço / Alumínio</option><option value="acrylic">Acrílico / ACM / Plásticos</option><option value="custom">Chapa personalizada</option></select></div>
            </div>
            <div class="card sheet-settings-card">
                <h2>Dimensões da chapa</h2>
                <div class="form-row sheet-dims-row">
                    <div class="form-group"><label for="sheetWidth">Largura (mm)</label><input id="sheetWidth" min="1" type="number" value="2750" inputmode="decimal" autocomplete="off" data-form-type="other"></div>
                    <div class="form-group"><label for="sheetHeight">Altura (mm)</label><input id="sheetHeight" min="1" type="number" value="1830" inputmode="decimal" autocomplete="off" data-form-type="other"></div>
                </div>
                <details class="workspace-details preset-details">
                    <summary>Tamanhos de mercado</summary>
                    <div class="presets-grid" id="presetsGrid">
                        <button type="button" class="preset-btn active" data-preset-material="wood" onclick="applyPreset(2750, 1830, 4, 'wood', 'MDF Brasil')"><span class="preset-title">MDF Brasil</span><span class="preset-dim">2750 × 1830 mm</span></button>
                        <button type="button" class="preset-btn" data-preset-material="wood" onclick="applyPreset(2440, 1220, 4, 'wood', 'MDF Meia Chapa')"><span class="preset-title">MDF Meia Chapa</span><span class="preset-dim">2440 × 1220 mm</span></button>
                        <button type="button" class="preset-btn" data-preset-material="wood" onclick="applyPreset(2200, 1600, 4, 'wood', 'Compensado')"><span class="preset-title">Compensado</span><span class="preset-dim">2200 × 1600 mm</span></button>
                        <button type="button" class="preset-btn" data-preset-material="glass" onclick="applyPreset(3210, 2200, 2, 'glass', 'Vidro Padrão')"><span class="preset-title">Vidro Padrão</span><span class="preset-dim">3210 × 2200 mm</span></button>
                        <button type="button" class="preset-btn" data-preset-material="metal" onclick="applyPreset(3000, 1200, 1, 'metal', 'Aço / Inox 3m')"><span class="preset-title">Aço / Inox 3m</span><span class="preset-dim">3000 × 1200 mm</span></button>
                        <button type="button" class="preset-btn" data-preset-material="metal" onclick="applyPreset(2000, 1000, 1, 'metal', 'Aço Padrão 2m')"><span class="preset-title">Aço Padrão 2m</span><span class="preset-dim">2000 × 1000 mm</span></button>
                    </div>
                </details>
                <details class="workspace-details cut-settings">
                    <summary>Parâmetros de corte</summary>
                    <div class="form-row">
                        <div class="form-group"><label for="kerf">Serra / Kerf (mm)</label><input id="kerf" min="0" step="0.5" type="number" value="4" inputmode="decimal" autocomplete="off" data-form-type="other"></div>
                        <div class="form-group"><label for="trimMargin">Refilo (mm)</label><input id="trimMargin" min="0" type="number" value="10" inputmode="decimal" autocomplete="off" data-form-type="other" title="Margem de desbaste das bordas da chapa"></div>
                    </div>
                    <label class="rotation-control"><input checked id="allowRotation" type="checkbox"> Permitir rotação das peças</label>
                    <div class="form-group"><label for="cutAlgorithm">Algoritmo</label><select id="cutAlgorithm" class="select-material"><option value="auto" selected>Automático (menor desperdício)</option><option value="guillotine">Guilhotina 2D</option><option value="maxrects">Retângulos máximos (Laser/CNC)</option><option value="shelf">Faixas (Shelf Packing)</option></select></div>
                </details>
            </div>
            <details class="card workspace-details costs-details">
                <summary>Custos e orçamento <span class="optional-label">Opcional</span></summary>
                <div class="form-row"><div class="form-group"><label for="sheetPrice">Preço por chapa (R$)</label><input id="sheetPrice" min="0" step="0.01" type="number" placeholder="Ex: 210,00" inputmode="decimal" oninput="recalculateCosts()" autocomplete="off" data-form-type="other"></div><div class="form-group" id="edgePriceGroup"><label for="edgePrice">Fita de borda (R$/m)</label><input id="edgePrice" min="0" step="0.01" type="number" placeholder="Ex: 1,60" inputmode="decimal" oninput="recalculateCosts()" autocomplete="off" data-form-type="other"></div></div>
            </details>
            <details class="card workspace-details example-details">
                <summary><i class="fa-regular fa-circle-play" aria-hidden="true"></i> Experimentar um projeto</summary>
                <p class="section-hint">Exemplos completos com peças, acabamentos e plano de corte.</p>
                <div class="demo-buttons-group">
                    <button type="button" class="demo-btn" id="demoBtn-mdf" onclick="loadCompleteProjectDemo('mdf', this)"><i class="fa-solid fa-couch" aria-hidden="true"></i> Armário MDF</button>
                    <button type="button" class="demo-btn" id="demoBtn-glass" onclick="loadCompleteProjectDemo('glass', this)"><i class="fa-regular fa-window-maximize" aria-hidden="true"></i> Vidros</button>
                    <button type="button" class="demo-btn" id="demoBtn-metal" onclick="loadCompleteProjectDemo('metal', this)"><i class="fa-solid fa-industry" aria-hidden="true"></i> Chapas de aço</button>
                </div>
            </details>
        </section>

        <section id="workspacePanelPieces" class="workspace-panel" role="tabpanel" aria-labelledby="workspaceTabPieces" data-workspace-panel="pieces" hidden>
            <div class="card piece-entry-card">
                <div class="workspace-section-heading"><h2>Adicionar peça</h2><button type="button" class="control-button secondary small-btn" id="btnOpenSketchModal" onclick="openSketchModal()"><i class="fa-solid fa-camera" aria-hidden="true"></i> Ler rascunho IA</button></div>
                <div class="form-group"><label for="newPieceLabel">Descrição</label><input id="newPieceLabel" placeholder="Ex: Porta, tampo, lateral" type="text" autocomplete="off" data-form-type="other"></div>
                <div class="form-row piece-inputs-row"><div class="form-group"><label for="newPieceWidth">Largura (mm)</label><input id="newPieceWidth" placeholder="L (mm)" type="number" min="1" inputmode="decimal" autocomplete="off" data-form-type="other"></div><div class="form-group"><label for="newPieceHeight">Altura (mm)</label><input id="newPieceHeight" placeholder="H (mm)" type="number" min="1" inputmode="decimal" autocomplete="off" data-form-type="other"></div><div class="form-group"><label for="newPieceQuantity">Quantidade</label><input id="newPieceQuantity" min="1" type="number" value="1" inputmode="numeric" autocomplete="off" data-form-type="other"></div></div>
                <div class="edge-banding-box" id="edgeBandingBox"><span class="edge-label">Fita de borda</span><div class="edge-options"><label class="edge-check"><input type="checkbox" id="edgeTop"> Superior</label><label class="edge-check"><input type="checkbox" id="edgeBottom"> Inferior</label><label class="edge-check"><input type="checkbox" id="edgeLeft"> Esquerda</label><label class="edge-check"><input type="checkbox" id="edgeRight"> Direita</label><button type="button" class="btn-all-edges" onclick="toggleAllEdges()">4 lados</button></div></div>
                <div class="piece-entry-actions"><button type="button" class="control-button add-piece-btn" id="confirmAddPieceBtn"><i class="fa-solid fa-plus" aria-hidden="true"></i> Inserir peça</button><button type="button" class="control-button secondary" id="cancelEditPieceBtn" hidden>Cancelar edição</button></div>
                <span class="error-message" id="pieceInputError" role="alert" style="display:none"></span>
            </div>
            <div class="card piece-list-card"><div class="pieces-header"><div class="pieces-title-group"><h2>Peças do projeto</h2><p class="piece-counter"><b id="pieceTypeCount">0</b> tipos · <b id="pieceCount">0</b> unidades</p></div><button type="button" class="control-button secondary small-btn" disabled id="clearAllPiecesBtn" title="Limpar lista inteira"><i class="fa-regular fa-trash-can" aria-hidden="true"></i> Limpar</button></div><div class="piece-table-wrapper" id="pieceTableWrapper"><table class="piece-table" id="pieceTable"><thead><tr><th scope="col">#</th><th scope="col">Descrição</th><th scope="col">Medidas (mm)</th><th scope="col">Qtd</th><th scope="col">Bordas</th><th scope="col">Ações</th></tr></thead><tbody id="pieceTableBody"><tr><td colspan="6" class="empty-pieces-text">Nenhuma peça adicionada. Cadastre uma peça ou importe sua lista.</td></tr></tbody></table></div></div>
            <details class="card workspace-details project-files"><summary><i class="fa-solid fa-arrow-right-arrow-left" aria-hidden="true"></i> Importar e exportar projeto</summary><div class="button-group wrap-buttons"><label class="control-button secondary" for="importExcelInput"><i class="fa-solid fa-file-excel" aria-hidden="true"></i> Importar planilha<input accept=".xlsx,.xls,.csv" id="importExcelInput" type="file" hidden></label><button type="button" class="control-button secondary" id="exportProjectJsonBtn" onclick="exportProjectJSON()"><i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i> Exportar JSON</button><label class="control-button secondary" for="importProjectJsonInput"><i class="fa-solid fa-file-arrow-up" aria-hidden="true"></i> Importar JSON<input accept=".json" id="importProjectJsonInput" type="file" onchange="importProjectJSON(event)" hidden></label></div></details>
        </section>
    </div>

    <section id="workspacePanelPlan" class="results-column" role="tabpanel" aria-labelledby="workspaceTabPlan" data-workspace-panel="plan">
        <div class="card result-card" id="resultsSection">
            <div class="results-top-header"><div><h2>Plano de corte</h2><p class="section-hint">Selecione uma peça no mapa para conferir seus detalhes.</p></div><button type="button" class="zoom-btn" id="fullscreenPlanBtn" title="Abrir mapa em tela cheia"><i class="fa-solid fa-expand" aria-hidden="true"></i> Tela cheia</button></div>
            <div class="metrics-grid" id="metricsGrid" style="display:none"><div class="metric-card"><span class="metric-label">Chapas</span><span class="metric-value" id="metricSheetsCount">0</span></div><div class="metric-card"><span class="metric-label">Aproveitamento</span><span class="metric-value" id="metricEfficiency">0%</span></div><div class="metric-card"><span class="metric-label">Desperdício</span><span class="metric-value" id="metricWaste">0%</span></div><div class="metric-card" id="metricEdgeCard"><span class="metric-label">Fita de borda</span><span class="metric-value" id="metricEdgeMeters">0 m</span></div><div class="metric-card" id="metricCostCard" style="display:none"><span class="metric-label">Custo estimado</span><span class="metric-value" id="metricTotalCost">R$ 0,00</span></div></div>
            <p class="waste-info-box" id="wasteInfo" role="status">Adicione suas peças e gere o plano de corte.</p>
            <div class="plan-view-controls"><div id="planSheetNavigation" class="plan-sheet-navigation" hidden><label for="activeSheetSelect">Chapa</label><select id="activeSheetSelect" aria-label="Chapa exibida"></select></div><div class="canvas-zoom-toolbar" id="zoomToolbar" style="display:none"><button type="button" class="zoom-btn" onclick="zoomCanvas(1.15)" title="Aumentar zoom" aria-label="Aumentar zoom"><i class="fa-solid fa-magnifying-glass-plus" aria-hidden="true"></i></button><button type="button" class="zoom-btn" onclick="zoomCanvas(0.85)" title="Diminuir zoom" aria-label="Diminuir zoom"><i class="fa-solid fa-magnifying-glass-minus" aria-hidden="true"></i></button><button type="button" class="zoom-btn" onclick="resetCanvasZoom()"><i class="fa-solid fa-compress" aria-hidden="true"></i> Ajustar</button><button type="button" class="zoom-btn" onclick="togglePieceLabels()" id="toggleLabelsBtn" aria-pressed="false"><i class="fa-solid fa-tag" aria-hidden="true"></i> Detalhes</button></div></div>
            <div class="cut-plan-output-area" id="cutPlanOutput"><div class="empty-state-banner"><i class="fa-solid fa-vector-square empty-state-icon" aria-hidden="true"></i><h3>Seu plano começa aqui</h3><p>Configure a chapa e adicione suas peças. Ou experimente um projeto completo na aba Chapa.</p></div></div>
            <div id="selectedPieceDetails" class="selected-piece-details" aria-live="polite" hidden></div>
            <div class="plan-output-actions"><button type="button" class="control-button secondary" disabled id="printPlanBtn"><i class="fa-solid fa-print" aria-hidden="true"></i> Imprimir ordem de corte</button></div>
        </div>
    </section>
</main>

<div class="workspace-actionbar"><div><strong id="workspaceSummary">Nenhuma peça adicionada</strong><span id="workspaceStatus" role="status" aria-live="polite">Configure a chapa para começar.</span></div><button type="button" class="control-button optimize" disabled id="optimizeBtn"><i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> Gerar plano de corte</button></div>
<div id="printReportContainer" class="print-only"></div>
<?php
include 'ui_modals.php';
include 'ui_footer.php';
?>
