<?php
/**
 * Otimizador de Plano de Corte 2D Universal - Pro Edition
 * Suporte a Madeira (MDF/Compensado), Vidro, Aço/Alumínio, Acrílico e Chapas Planas
 * Padrão Premium 4U.IA.BR
 */
include 'ui_header.php';
?>

<div class="layout-grid">
    <!-- Coluna Esquerda: Entradas & Configurações -->
    <div class="input-column">
        
        <!-- Card: Informações do Projeto & Material -->
        <div class="card glass">
            <h2><i class="fa-solid fa-clipboard-list icon-purple"></i> Projeto & Material</h2>
            <div class="form-row">
                <div class="form-group">
                    <label for="clientName">Nome do Cliente</label>
                    <input id="clientName" placeholder="Ex: João Silva" type="text"/>
                </div>
                <div class="form-group">
                    <label for="projectName">Nome do Projeto</label>
                    <input id="projectName" placeholder="Ex: Armário Cozinha / Fachada" type="text"/>
                </div>
            </div>
            <div class="form-row" style="margin-top: 10px;">
                <div class="form-group">
                    <label for="materialType">Tipo de Material</label>
                    <select id="materialType" class="select-material" onchange="handleMaterialChange(this.value)">
                        <option value="wood" selected>🪵 Madeira / MDF / MDP / Compensado</option>
                        <option value="glass">🪟 Vidro / Espelho (Corte Guilhotina)</option>
                        <option value="metal">⚙️ Metal / Aço / Alumínio (Laser/Plasma/Guilhotina)</option>
                        <option value="acrylic">🎨 Acrílico / ACM / Plásticos</option>
                        <option value="custom">🔲 Chapa Personalizada</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Card: Presets Rápidos de Mercado -->
        <div class="card glass">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                <h2><i class="fa-solid fa-bolt icon-cyan"></i> Presets de Chapas de Mercado</h2>
                <span class="badge-quick-demo"><i class="fa-solid fa-wand-magic-sparkles"></i> Demonstração Rápida</span>
            </div>
            <p class="section-hint">Clique para carregar as dimensões e serra padrão:</p>
            <div class="presets-grid" id="presetsGrid">
                <button type="button" class="preset-btn active" onclick="applyPreset(2750, 1830, 4, 'wood', 'MDF Padrão Brasil (2750x1830)')">
                    <span class="preset-icon">🪵</span>
                    <span class="preset-title">MDF Brasil</span>
                    <span class="preset-dim">2750 × 1830 mm</span>
                </button>
                <button type="button" class="preset-btn" onclick="applyPreset(2440, 1220, 4, 'wood', 'MDF Meia Chapa (2440x1220)')">
                    <span class="preset-icon">🪚</span>
                    <span class="preset-title">MDF Meia Chapa</span>
                    <span class="preset-dim">2440 × 1220 mm</span>
                </button>
                <button type="button" class="preset-btn" onclick="applyPreset(3210, 2200, 2, 'glass', 'Vidro Float Padrão (3210x2200)')">
                    <span class="preset-icon">🪟</span>
                    <span class="preset-title">Vidro Padrão</span>
                    <span class="preset-dim">3210 × 2200 mm</span>
                </button>
                <button type="button" class="preset-btn" onclick="applyPreset(3000, 1200, 1, 'metal', 'Chapa Aço 3000x1200')">
                    <span class="preset-icon">⚙️</span>
                    <span class="preset-title">Aço / Inox 3m</span>
                    <span class="preset-dim">3000 × 1200 mm</span>
                </button>
                <button type="button" class="preset-btn" onclick="applyPreset(2000, 1000, 1, 'metal', 'Chapa Aço 2000x1000')">
                    <span class="preset-icon">🔩</span>
                    <span class="preset-title">Aço Padrão 2m</span>
                    <span class="preset-dim">2000 × 1000 mm</span>
                </button>
                <button type="button" class="preset-btn" onclick="applyPreset(2200, 1600, 4, 'wood', 'Compensado Naval (2200x1600)')">
                    <span class="preset-icon">⛵</span>
                    <span class="preset-title">Compensado</span>
                    <span class="preset-dim">2200 × 1600 mm</span>
                </button>
            </div>

            <!-- Botão de Demonstração / Projeto Completo com 1-Clique -->
            <div class="demo-project-container glass">
                <div class="demo-project-info">
                    <strong><i class="fa-solid fa-play-circle" style="color: #50fa7b;"></i> Carregar Projeto Completo de Exemplo:</strong>
                    <span>Preenche todas as peças, fitas de borda, custos e já gera o plano de corte otimizado na tela:</span>
                </div>
                <div class="demo-buttons-group">
                    <button type="button" class="demo-btn" id="demoBtn-mdf" onclick="loadCompleteProjectDemo('mdf', this)" title="Carregar Projeto Completo de Armário MDF com 10 tipos de peças">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> 🪵 Exemplo Armário MDF
                    </button>
                    <button type="button" class="demo-btn" id="demoBtn-glass" onclick="loadCompleteProjectDemo('glass', this)" title="Carregar Projeto Completo de Vidraçaria">
                        <i class="fa-solid fa-layer-group"></i> 🪟 Exemplo Vidros
                    </button>
                    <button type="button" class="demo-btn" id="demoBtn-metal" onclick="loadCompleteProjectDemo('metal', this)" title="Carregar Projeto Completo em Chapas de Aço">
                        <i class="fa-solid fa-gear"></i> ⚙️ Exemplo Chapas Aço
                    </button>
                </div>
            </div>
        </div>

        <!-- Card: Dimensões da Chapa & Parâmetros de Corte -->
        <div class="card glass">
            <h2><i class="fa-solid fa-ruler-combined icon-cyan"></i> Dimensões da Chapa (mm)</h2>
            <div class="form-row sheet-dims-row">
                <div class="form-group">
                    <label for="sheetWidth">Largura (mm)</label>
                    <input id="sheetWidth" min="1" type="number" value="2750"/>
                </div>
                <div class="form-group">
                    <label for="sheetHeight">Altura (mm)</label>
                    <input id="sheetHeight" min="1" type="number" value="1830"/>
                </div>
                <div class="form-group">
                    <label for="kerf">Corte / Kerf (mm)</label>
                    <input id="kerf" min="0" step="0.5" type="number" value="4"/>
                </div>
                <div class="form-group">
                    <label for="trimMargin">Refilo Borda (mm)</label>
                    <input id="trimMargin" min="0" type="number" value="10" title="Margem de desbaste das bordas da chapa"/>
                </div>
            </div>

            <div class="form-row" style="margin-top: 10px; align-items: center; justify-content: space-between;">
                <div class="form-group-checkbox">
                    <label for="allowRotation" title="Se desmarcado, respeita o sentido do veio da madeira/chapa">
                        <input checked="" id="allowRotation" type="checkbox"/> Permitir Rotação Global
                    </label>
                </div>
                <div class="form-group" style="min-width: 180px;">
                    <label for="cutAlgorithm">Modo do Algoritmo</label>
                    <select id="cutAlgorithm" class="select-material">
                        <option value="auto" selected>⚡ Automático (Menor Desperdício)</option>
                        <option value="guillotine">🪚 Guilhotina 2D (Linear de ponta a ponta)</option>
                        <option value="maxrects">⚙️ Retângulos Máximos (Laser/CNC)</option>
                        <option value="shelf">📦 Shelf Packing (Faixas)</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Card: Adicionar Peça com Descrição e Borda -->
        <div class="card glass">
            <h2><i class="fa-solid fa-keyboard icon-pink"></i> Adicionar Peça</h2>
            <div class="form-row">
                <div class="form-group" style="flex: 2; width: 100%;">
                    <label for="newPieceLabel">Descrição / Nome da Peça</label>
                    <input id="newPieceLabel" placeholder="Ex: Porta, Tampo, Vidro Fixo" type="text"/>
                </div>
            </div>
            <div class="form-row piece-inputs-row" style="margin-top: 5px;">
                <div class="form-group">
                    <label for="newPieceWidth">Largura (mm)</label>
                    <input id="newPieceWidth" placeholder="L (mm)" type="number" min="1"/>
                </div>
                <div class="form-group">
                    <label for="newPieceHeight">Altura (mm)</label>
                    <input id="newPieceHeight" placeholder="H (mm)" type="number" min="1"/>
                </div>
                <div class="form-group">
                    <label for="newPieceQuantity">Qtd</label>
                    <input id="newPieceQuantity" min="1" type="number" value="1"/>
                </div>
            </div>

            <!-- Fita de Borda Opcional (Modo Marcenaria) -->
            <div class="edge-banding-box" id="edgeBandingBox">
                <span class="edge-label"><i class="fa-solid fa-tape"></i> Fita de Borda (Acabamento):</span>
                <div class="edge-options">
                    <label class="edge-check"><input type="checkbox" id="edgeTop"> Superior (L1)</label>
                    <label class="edge-check"><input type="checkbox" id="edgeBottom"> Inferior (L2)</label>
                    <label class="edge-check"><input type="checkbox" id="edgeLeft"> Esquerda (H1)</label>
                    <label class="edge-check"><input type="checkbox" id="edgeRight"> Direita (H2)</label>
                    <button type="button" class="btn-all-edges" onclick="toggleAllEdges()">4 Lados</button>
                </div>
            </div>

            <div class="form-row" style="margin-top: 10px; justify-content: flex-end;">
                <button class="control-button add-piece-btn large-add" id="confirmAddPieceBtn">
                    <i class="fa-solid fa-plus"></i> Inserir Peça na Lista
                </button>
            </div>
            <span class="error-message" id="pieceInputError" style="display: none;"></span>
        </div>

        <!-- Lista de Peças Cadastradas -->
        <div class="card glass piece-list-card">
            <div class="pieces-header">
                <div class="pieces-title-group">
                    <h2><i class="fa-solid fa-puzzle-piece icon-yellow"></i> <span>Peças do Projeto</span> <span class="badge-item-count">(<b id="pieceCount">0</b> itens)</span></h2>
                </div>
                <div class="pieces-header-actions">
                    <button class="control-button optimize small-btn" id="btnOpenSketchModal" onclick="openSketchModal()" title="Ler rascunho, foto ou print com IA">
                        <i class="fa-solid fa-camera"></i> <span>Ler Rascunho IA</span>
                    </button>
                    <button class="control-button secondary small-btn" disabled="" id="clearAllPiecesBtn" title="Limpar lista inteira">
                        <i class="fa-solid fa-trash-can"></i> <span>Limpar</span>
                    </button>
                </div>
            </div>
            
            <div class="piece-table-wrapper" id="pieceTableWrapper">
                <table class="piece-table" id="pieceTable">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Descrição</th>
                            <th>Medidas (mm)</th>
                            <th>Qtd</th>
                            <th>Bordas</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="pieceTableBody">
                        <tr>
                            <td colspan="6" class="empty-pieces-text">Nenhuma peça adicionada ainda. Adicione acima ou importe um rascunho com IA.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Estimativa de Custos (Opcional) -->
        <div class="card glass">
            <h2><i class="fa-solid fa-calculator icon-green"></i> Custos & Orçamento (Opcional)</h2>
            <div class="form-row">
                <div class="form-group">
                    <label for="sheetPrice">Preço por Chapa (R$)</label>
                    <input id="sheetPrice" min="0" step="0.01" type="number" placeholder="Ex: 180.00" oninput="recalculateCosts()"/>
                </div>
                <div class="form-group" id="edgePriceGroup">
                    <label for="edgePrice">Fita de Borda (R$/metro)</label>
                    <input id="edgePrice" min="0" step="0.01" type="number" placeholder="Ex: 1.50" oninput="recalculateCosts()"/>
                </div>
            </div>
        </div>

        <!-- Ações Principais -->
        <div class="card glass">
            <div class="button-group actions-primary">
                <button class="control-button optimize large-btn" disabled="" id="optimizeBtn">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> GERAR PLANO DE CORTE OTIMIZADO
                </button>
            </div>
            <div class="button-group actions-secondary wrap-buttons" style="margin-top:15px;">
                <label class="control-button excel" for="importExcelInput">
                    <i class="fa-solid fa-file-excel"></i> Importar Planilha
                    <input accept=".xlsx, .xls, .csv" id="importExcelInput" style="display: none;" type="file"/>
                </label>
                <button class="control-button save-local" id="exportProjectJsonBtn" onclick="exportProjectJSON()">
                    <i class="fa-solid fa-file-arrow-down"></i> Exportar JSON
                </button>
                <label class="control-button secondary" for="importProjectJsonInput">
                    <i class="fa-solid fa-file-arrow-up"></i> Importar JSON
                    <input accept=".json" id="importProjectJsonInput" style="display: none;" type="file" onchange="importProjectJSON(event)"/>
                </label>
            </div>
            <div class="button-group actions-output wrap-buttons" style="margin-top:15px;">
                <button class="control-button print" disabled="" id="printPlanBtn">
                    <i class="fa-solid fa-file-pdf"></i> Imprimir Ordem de Corte (A4)
                </button>
            </div>
        </div>
    </div>

    <!-- Coluna Direita: Resultados & Visualizador Canvas -->
    <div class="results-column">
        <div class="card glass result-card" id="resultsSection">
            <div class="results-top-header">
                <h2><i class="fa-solid fa-chart-pie icon-green"></i> Resultado da Otimização</h2>
                <div class="canvas-zoom-toolbar" id="zoomToolbar" style="display: none;">
                    <button class="zoom-btn" onclick="zoomCanvas(1.15)" title="Aumentar Zoom"><i class="fa-solid fa-magnifying-glass-plus"></i></button>
                    <button class="zoom-btn" onclick="zoomCanvas(0.85)" title="Diminuir Zoom"><i class="fa-solid fa-magnifying-glass-minus"></i></button>
                    <button class="zoom-btn" onclick="resetCanvasZoom()" title="Ajustar à Tela"><i class="fa-solid fa-expand"></i> Ajustar</button>
                    <button class="zoom-btn" onclick="togglePieceLabels()" id="toggleLabelsBtn" title="Alternar Nomes/Medidas"><i class="fa-solid fa-tag"></i> Detalhes</button>
                </div>
            </div>

            <!-- Cards de Métricas e Desperdício -->
            <div class="metrics-grid" id="metricsGrid" style="display: none;">
                <div class="metric-card glass">
                    <span class="metric-label">Total de Chapas</span>
                    <span class="metric-value text-cyan" id="metricSheetsCount">0</span>
                </div>
                <div class="metric-card glass">
                    <span class="metric-label">Aproveitamento</span>
                    <span class="metric-value text-green" id="metricEfficiency">0%</span>
                </div>
                <div class="metric-card glass">
                    <span class="metric-label">Desperdício</span>
                    <span class="metric-value text-red" id="metricWaste">0%</span>
                </div>
                <div class="metric-card glass" id="metricEdgeCard">
                    <span class="metric-label">Fita de Borda</span>
                    <span class="metric-value text-yellow" id="metricEdgeMeters">0 m</span>
                </div>
                <div class="metric-card glass" id="metricCostCard" style="display: none;">
                    <span class="metric-label">Custo Estimado</span>
                    <span class="metric-value text-purple" id="metricTotalCost">R$ 0,00</span>
                </div>
            </div>

            <p class="waste-info-box" id="wasteInfo">Aguardando inserção de peças e clique em <b>Gerar Plano de Corte</b>...</p>

            <div class="cut-plan-output-area" id="cutPlanOutput">
                <div class="empty-state-banner">
                    <div class="empty-state-icon">🪚</div>
                    <h3>Pronto para Otimizar</h3>
                    <p>Adicione suas peças no formulário ao lado ou selecione um dos presets de mercado para visualizar o mapa de corte inteligente.</p>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Template Oculto para Impressão da Ordem de Serviço A4 -->
<div id="printReportContainer" class="print-only">
    <!-- Gerado dinamicamente via JS na hora de imprimir -->
</div>

<?php 
include 'ui_modals.php';
include 'ui_footer.php'; 
?>
