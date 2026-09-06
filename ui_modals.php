<?php
/**
 * UI Modals - Corte Fácil Pro
 * Padrão 4U.IA.BR Premium
 */
?>
<!-- Modal Super Acesso (Backdoor) -->
<div id="bonusModal" class="modal">
    <div class="modal-content glass cyber-border">
        <h3><i class="fa-solid fa-unlock-keyhole"></i> Super Acesso Pro</h3>
        <p>Insira a senha de mestre para liberar bônus:</p>
        <input type="password" id="bonusPassword" placeholder="Senha do Admin">
        <div class="modal-actions">
            <button class="control-button secondary" id="closeBonusModal">Cancelar</button>
            <button class="control-button optimize" id="submitBonusPassword">Ativar</button>
        </div>
    </div>
</div>

<!-- Modal Mercado Pago (Pacotes de Créditos) -->
<div id="paymentModal" class="modal">
    <div class="modal-content glass cyber-border">
        <h3><i class="fa-solid fa-gem" style="color: #00e5ff;"></i> Recarregar Créditos</h3>
        <p><i class="fa-brands fa-pix" style="color:#32bcad"></i> Pagamento exclusivo via <b>PIX</b> (Liberação Imediata)</p>
        
        <div class="pricing-grid" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px;">
            <div class="pricing-card glass" id="pkg-card-0" style="cursor: pointer; padding: 15px; text-align: center; border-radius: 12px; transition: all 0.3s; border: 1px solid var(--glass-border);" onclick="selectPackage(0)">
                <h4 style="margin: 0 0 5px 0; font-size: 1rem; color: #fff;">Bronze</h4>
                <span class="price" style="font-size: 1.3rem; font-weight: bold; color: var(--primary-color); display: block; margin-bottom: 5px;">R$ 4,90</span>
                <p style="margin: 0; font-size: 0.85rem; color: #ccc;">10 Créditos</p>
            </div>
            <div class="pricing-card glass highlighted" id="pkg-card-1" style="cursor: pointer; padding: 15px; text-align: center; border-radius: 12px; transition: all 0.3s; border: 2px solid var(--primary-color); background: rgba(0, 229, 255, 0.1);" onclick="selectPackage(1)">
                <h4 style="margin: 0 0 5px 0; font-size: 1rem; color: #fff;">Prata</h4>
                <span class="price" style="font-size: 1.3rem; font-weight: bold; color: var(--primary-color); display: block; margin-bottom: 5px;">R$ 19,90</span>
                <p style="margin: 0; font-size: 0.85rem; color: #ccc;">50 Créditos</p>
            </div>
            <div class="pricing-card glass" id="pkg-card-2" style="cursor: pointer; padding: 15px; text-align: center; border-radius: 12px; transition: all 0.3s; border: 1px solid var(--glass-border);" onclick="selectPackage(2)">
                <h4 style="margin: 0 0 5px 0; font-size: 1rem; color: #fff;">Ouro</h4>
                <span class="price" style="font-size: 1.3rem; font-weight: bold; color: var(--primary-color); display: block; margin-bottom: 5px;">R$ 34,90</span>
                <p style="margin: 0; font-size: 0.85rem; color: #ccc;">100 Créditos</p>
            </div>
        </div>

        <button id="btn-generate-pix" class="control-button optimize" style="width: 100%; font-weight: bold; min-height: 44px; font-size: 0.95rem; margin-bottom: 10px;" onclick="generatePixPayment()">
            <i class="fa-brands fa-pix"></i> GERAR CÓDIGO PIX
        </button>

        <!-- Seção do PIX Direct com QR Code -->
        <div id="pix-section" style="display: none; margin-top: 15px; text-align: center; background: rgba(0,0,0,0.4); padding: 15px; border-radius: 12px; border: 1px solid rgba(0, 229, 255, 0.2);">
            <h4 style="color: #32bcad; margin-top: 0; margin-bottom: 10px; font-size: 0.95rem;"><i class="fa-solid fa-spinner fa-spin"></i> Aguardando Pagamento PIX...</h4>
            
            <div id="pix-qrcode-container" style="margin: 15px auto; width: 180px; height: 180px; background: white; padding: 8px; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(0, 229, 255, 0.2);">
                <img id="pix-qrcode" src="" alt="QR Code PIX" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
            
            <p style="font-size: 0.8rem; color: #ccc; margin-bottom: 8px;">Escaneie o QR Code ou copie a chave copia e cola abaixo:</p>
            
            <textarea id="pix-copia-cola" readonly style="width: 100%; height: 50px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 5px; border-radius: 6px; font-family: monospace; font-size: 0.7rem; resize: none; text-align: center; margin-bottom: 10px;"></textarea>
            
            <button id="btn-copy-pix" class="control-button secondary small-btn" style="width: 100%; font-size: 0.8rem;" onclick="copyPixCode()">
                <i class="fa-regular fa-copy"></i> Copiar Código PIX
            </button>
        </div>
        
        <!-- Conta Unificada Keep AI -->
        <div class="account-recovery glass" style="margin-top:20px; border-top:1px solid var(--glass-border); padding-top:20px;">
            <p style="font-size:0.8rem; color:var(--primary-color); font-weight:bold; margin-bottom:12px; text-transform: uppercase; letter-spacing: 1px;">
                <i class="fa-solid fa-user-gear"></i> Conta Unificada Keep AI
            </p>

            <!-- Formulário Deslogado -->
            <div id="keepai-login-form" style="display: flex; flex-direction: column; gap: 10px;">
                <p style="font-size:0.75rem; color:#ccc; margin: 0 0 5px 0;">Acesse ou crie sua conta para salvar, unificar e usar seus créditos em todos os apps da 4uLabs:</p>
                <input type="email" id="keepaiEmail" placeholder="E-mail" style="font-size:0.9rem; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--glass-border); color: #fff;">
                <input type="password" id="keepaiPassword" placeholder="Senha Keep AI" style="font-size:0.9rem; padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--glass-border); color: #fff;">
                <div style="display: flex; gap: 8px; margin-top: 5px;">
                    <button id="btnKeepaiLogin" class="control-button optimize small-btn" style="flex: 1; font-weight: bold;" onclick="handleKeepaiAuth('login')">ENTRAR</button>
                    <button id="btnKeepaiRegister" class="control-button secondary small-btn" style="flex: 1; font-weight: bold;" onclick="handleKeepaiAuth('register')">CADASTRAR</button>
                </div>
            </div>

            <!-- Box Logado -->
            <div id="keepai-logged-in-box" style="display: none; text-align: center; padding: 15px; background: rgba(0, 229, 255, 0.05); border: 1px solid rgba(0, 229, 255, 0.3); border-radius: 12px; flex-direction: column; gap: 10px;">
                <p style="font-size: 0.8rem; color: #fff; margin: 0;"><i class="fa-solid fa-circle-check" style="color: #50fa7b;"></i> Conectado ao ecossistema Keep AI</p>
                <div id="keepaiUserEmail" style="font-weight: bold; color: var(--primary-color); font-size: 0.95rem; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px; font-family: monospace;">...</div>
                <button id="btnKeepaiLogout" class="control-button secondary small-btn" style="width: 100%; min-height: 36px; background: rgba(255, 85, 85, 0.1); border-color: #ff5555; color: #ff5555; font-weight: bold;" onclick="handleKeepaiLogout()">DESCONECTAR</button>
            </div>
        </div>
        
        <button class="close-payment" id="closePaymentModal">Fechar</button>
    </div>
</div>

<!-- Modais Legais -->
<div id="privacyModal" class="modal">
    <div class="modal-content glass cyber-border legal-modal">
        <h3><i class="fa-solid fa-shield-halved icon-cyan"></i> Privacidade</h3>
        <div class="legal-text">
            <p>Seus dados de projeto são armazenados localmente e sincronizados de forma segura via ID de Acesso.</p>
            <h4>Conformidade</h4>
            <p>Não compartilhamos informações com terceiros. Os pagamentos são processados 100% pelo Mercado Pago.</p>
        </div>
        <button class="control-button secondary close-legal" data-modal="privacyModal">Entendido</button>
    </div>
</div>

<div id="termsModal" class="modal">
    <div class="modal-content glass cyber-border legal-modal">
        <h3><i class="fa-solid fa-file-contract icon-purple"></i> Termos de Uso</h3>
        <div class="legal-text">
            <p>O CorteFácil Pro é uma ferramenta de auxílio. A conferência final das medidas é responsabilidade do usuário.</p>
            <h4>Créditos</h4>
            <p>Cada otimização consome 1 crédito. Pacotes ilimitados removem esta trava.</p>
        </div>
        <button class="control-button secondary close-legal" data-modal="termsModal">Aceitar</button>
    </div>
</div>

<!-- Modal Confirmação Dupla -->
<div id="confirmModal" class="modal">
    <div class="modal-content glass cyber-border">
        <h3><i class="fa-solid fa-triangle-exclamation" style="color:#ff5555"></i> Confirmar Ação</h3>
        <p id="confirmMessage">Deseja realmente prosseguir com esta ação?</p>
        <div class="modal-actions">
            <button class="control-button secondary" id="btnConfirmCancel">Cancelar</button>
            <button class="control-button optimize" id="btnConfirmProceed" style="background:#ff5555; color:#fff;">Confirmar</button>
        </div>
    </div>
</div>

<!-- Modal Leitor de Rascunhos e Listas com IA (Vision OCR) -->
<div id="sketchModal" class="modal">
    <div class="modal-content glass cyber-border sketch-modal-content">
        <div class="modal-header-flex">
            <h3><i class="fa-solid fa-wand-magic-sparkles" style="color: #00e5ff;"></i> Leitor de Rascunhos com IA</h3>
            <span class="ocr-badge-ai"><i class="fa-solid fa-brain"></i> Vision OCR Pro</span>
        </div>
        <p class="modal-subtitle">Tire foto do caderno de anotações, rascunho desenhado ou print. A IA lê as medidas, quantidades e fitas de borda automaticamente.</p>

        <!-- Etapa 1: Upload / Captura / Drop -->
        <div id="sketchUploadStep">
            <!-- Inputs Nativos Ocultos -->
            <input type="file" id="sketchFileInput" accept="image/*" style="display: none;">
            <input type="file" id="sketchCameraInput" accept="image/*" capture="environment" style="display: none;">

            <!-- Câmera ao Vivo com Visor em Tempo Real -->
            <div id="sketchLiveCameraBox" class="sketch-live-camera glass" style="display: none;">
                <div class="camera-video-wrapper">
                    <video id="sketchVideo" autoplay playsinline muted></video>
                    <canvas id="sketchCaptureCanvas" style="display: none;"></canvas>
                    <div class="camera-overlay-guide">
                        <span><i class="fa-solid fa-expand"></i> Enquadre o rascunho na tela</span>
                    </div>
                </div>
                <div class="camera-controls-bar">
                    <button type="button" class="control-button secondary small-btn" id="btnCloseCamera">
                        <i class="fa-solid fa-xmark"></i> Cancelar
                    </button>
                    <button type="button" class="control-button optimize" id="btnSnapPhoto" style="font-size: 0.95rem; font-weight: bold; min-height: 42px; flex: 1;">
                        <i class="fa-solid fa-camera"></i> CAPTURAR FOTO
                    </button>
                    <button type="button" class="control-button secondary small-btn" id="btnFlipCamera" title="Alternar Câmera">
                        <i class="fa-solid fa-rotate"></i>
                    </button>
                </div>
            </div>

            <!-- Área de Escolha / Upload Inicial -->
            <div id="sketchDropZone" class="sketch-drop-zone glass">
                <div class="drop-zone-icon">
                    <i class="fa-solid fa-camera-retro"></i>
                </div>
                <div class="drop-zone-text">
                    <strong>Como deseja enviar seu rascunho?</strong>
                    <span>Tire uma foto na bancada ou escolha uma imagem/print:</span>
                </div>
                <div class="drop-zone-buttons">
                    <button type="button" class="control-button optimize" id="btnTriggerCamera" style="flex: 1; min-height: 44px;">
                        <i class="fa-solid fa-camera"></i> Tirar Foto (Câmera)
                    </button>
                    <button type="button" class="control-button secondary" id="btnTriggerFile" style="flex: 1; min-height: 44px;">
                        <i class="fa-solid fa-folder-open"></i> Escolher Arquivo / Galeria
                    </button>
                </div>
                <div class="paste-hint">
                    <i class="fa-regular fa-clipboard"></i> Dica: Você também pode colar uma imagem direto com <b>Ctrl + V</b>
                </div>
            </div>

            <!-- Preview da Imagem Selecionada -->
            <div id="sketchPreviewBox" class="sketch-preview-box glass" style="display: none;">
                <div class="preview-img-wrapper" id="sketchImgWrapper">
                    <img id="sketchPreviewImg" src="" alt="Prévia do Rascunho">
                    <div id="sketchScanLine" class="sketch-scan-line"></div>
                </div>
                
                <div class="sketch-options-grid">
                    <div class="input-group">
                        <label for="sketchUnitSelect"><i class="fa-solid fa-ruler"></i> Unidade do Rascunho:</label>
                        <select id="sketchUnitSelect">
                            <option value="auto" selected>🤖 Auto (Reconhecimento Inteligente)</option>
                            <option value="mm">Milímetros (mm) — Ex: 2000 x 500</option>
                            <option value="cm">Centímetros (cm) — Ex: 200 x 50</option>
                            <option value="m">Metros (m) — Ex: 2.00 x 0.50</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="sketchCustomNotes"><i class="fa-solid fa-comment-dots"></i> Observações Extras (Opcional):</label>
                        <input type="text" id="sketchCustomNotes" placeholder="Ex: MDF 15mm, desconsiderar rabiscos...">
                    </div>
                </div>

                <div class="sketch-action-bar">
                    <button type="button" class="control-button secondary" id="btnResetSketch">
                        <i class="fa-solid fa-arrow-rotate-left"></i> Trocar Imagem
                    </button>
                    <button type="button" class="control-button optimize pulse-anim" id="btnAnalyzeSketch">
                        <i class="fa-solid fa-bolt"></i> Extrair Peças com IA
                    </button>
                </div>
            </div>

            <!-- Loading / Scan Progress -->
            <div id="sketchLoadingState" class="sketch-loading glass" style="display: none;">
                <div class="spinner-cyber"></div>
                <h4 id="sketchLoadingTitle">Analisando imagem com Visão Computacional...</h4>
                <p id="sketchLoadingSub">Identificando cotas, medidas, quantidades e fitas de borda...</p>
            </div>
        </div>

        <!-- Etapa 2: Tabela de Revisão / Confirmação -->
        <div id="sketchResultStep" style="display: none;">
            <div class="ocr-success-alert glass">
                <i class="fa-solid fa-circle-check" style="color: #50fa7b; font-size: 1.5rem;"></i>
                <div>
                    <h4 id="ocrResultTitle" style="margin: 0 0 4px 0; color: #50fa7b;">Rascunho Processado com Sucesso!</h4>
                    <p id="ocrResultNotes" style="margin: 0; font-size: 0.85rem; color: #ddd;"></p>
                </div>
            </div>

            <!-- Chapa Bruta Detectada (se houver) -->
            <div id="ocrDetectedSheetBox" class="ocr-sheet-box glass" style="display: none;">
                <label class="custom-checkbox">
                    <input type="checkbox" id="chkApplyDetectedSheet" checked>
                    <span class="checkmark"></span>
                    <span id="detectedSheetText">Aplicar dimensões da chapa detectada: <b>2750 x 1830 mm</b></span>
                </label>
            </div>

            <div class="table-responsive glass" style="max-height: 280px; overflow-y: auto; margin: 15px 0;">
                <table class="data-table" id="ocrPreviewTable">
                    <thead>
                        <tr>
                            <th>Descrição / Peça</th>
                            <th>Compr. (mm)</th>
                            <th>Larg. (mm)</th>
                            <th>Qtd</th>
                            <th>Girar?</th>
                            <th>Fita de Borda</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody id="ocrPreviewTbody">
                        <!-- Itens gerados dinamicamente via JS -->
                    </tbody>
                </table>
            </div>

            <div class="ocr-modal-actions">
                <button type="button" class="control-button secondary" id="btnBackToSketch">
                    <i class="fa-solid fa-arrow-left"></i> Nova Foto
                </button>
                <div class="ocr-actions-right">
                    <button type="button" class="control-button secondary" id="btnApplySketchAppend">
                        <i class="fa-solid fa-plus"></i> Adicionar à Lista
                    </button>
                    <button type="button" class="control-button optimize" id="btnApplySketchReplace">
                        <i class="fa-solid fa-check-double"></i> Substituir Lista
                    </button>
                </div>
            </div>
        </div>

        <button class="close-payment" id="closeSketchModal">Fechar</button>
    </div>
</div>

