<?php
/**
 * Central de Ajuda & Guia Completo - Corte Fácil Pro
 * Padrão Premium 4U.IA.BR
 */
$pageTitle = "Central de Ajuda - Corte Fácil Pro";
include 'ui_header.php';
?>

<style>
    .help-wrapper {
        max-width: 1100px;
        margin: 0 auto;
        padding-bottom: 40px;
    }
    .help-hero {
        text-align: center;
        padding: 30px 20px 25px;
        margin-bottom: 25px;
        border-radius: 16px;
        background: linear-gradient(135deg, rgba(0, 229, 255, 0.08), rgba(80, 250, 123, 0.08));
        border: 1px solid var(--glass-border);
    }
    .help-hero h1 {
        font-family: 'Orbitron', sans-serif;
        font-size: 2rem;
        margin: 0 0 10px;
        color: #fff;
    }
    .help-hero p {
        color: #a0aec0;
        font-size: 1rem;
        max-width: 700px;
        margin: 0 auto 15px;
        line-height: 1.6;
    }
    .quick-badges-bar {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
    }
    .q-badge {
        background: rgba(10, 15, 30, 0.7);
        border: 1px solid var(--glass-border);
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 0.8rem;
        color: #fff;
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }

    /* Grid de Tópicos */
    .help-toc-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 15px;
        margin-bottom: 30px;
    }
    .toc-card {
        padding: 16px;
        border-radius: 12px;
        text-decoration: none;
        color: #fff;
        display: flex;
        align-items: center;
        gap: 14px;
        transition: all 0.3s ease;
        border: 1px solid var(--glass-border);
        background: rgba(10, 15, 30, 0.6);
    }
    .toc-card:hover {
        border-color: var(--primary-color);
        background: rgba(0, 229, 255, 0.1);
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(0, 229, 255, 0.15);
    }
    .toc-icon {
        width: 42px;
        height: 42px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        background: rgba(255, 255, 255, 0.05);
        color: var(--primary-color);
        flex-shrink: 0;
    }

    /* Seções de Ajuda */
    .help-section {
        margin-bottom: 30px;
        padding: 28px;
        border-radius: 16px;
    }
    .help-section h2 {
        font-family: 'Orbitron', sans-serif;
        font-size: 1.4rem;
        margin-top: 0;
        margin-bottom: 16px;
        color: #fff;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .help-section h3 {
        font-size: 1.1rem;
        color: var(--primary-color);
        margin: 22px 0 10px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .help-section p, .help-section li {
        color: #cbd5e1;
        line-height: 1.75;
        font-size: 0.95rem;
    }
    .help-section ul, .help-section ol {
        margin: 10px 0 18px 20px;
        padding-left: 10px;
    }
    .help-section li {
        margin-bottom: 8px;
    }

    /* Boxes de Destaque */
    .feature-box {
        background: rgba(10, 20, 35, 0.6);
        border: 1px solid rgba(0, 229, 255, 0.25);
        border-radius: 12px;
        padding: 16px 20px;
        margin: 16px 0;
    }
    .tip-box {
        background: rgba(80, 250, 123, 0.08);
        border-left: 4px solid #50fa7b;
        border-radius: 0 10px 10px 0;
        padding: 14px 18px;
        margin: 16px 0;
    }
    .tip-box strong {
        color: #50fa7b;
    }

    /* Grid de Algoritmos */
    .algo-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 15px;
        margin: 18px 0;
    }
    .algo-card {
        padding: 16px;
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .algo-card h4 {
        margin: 0 0 8px;
        color: #fff;
        font-size: 0.95rem;
    }
    .algo-card p {
        font-size: 0.85rem;
        margin: 0;
        color: #94a3b8;
    }

    /* FAQ Accordion */
    .faq-item {
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        padding: 16px 0;
    }
    .faq-item:last-child {
        border-bottom: none;
    }
    .faq-question {
        font-weight: 600;
        color: #fff;
        font-size: 1rem;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .faq-answer {
        color: #94a3b8;
        font-size: 0.9rem;
        line-height: 1.6;
        margin: 0;
    }

    .btn-back-app {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-top: 15px;
    }

    @media (max-width: 600px) {
        .help-hero {
            padding: 20px 14px;
        }
        .help-hero h1 {
            font-size: 1.4rem;
        }
        .help-hero p {
            font-size: 0.88rem;
        }
        .help-section {
            padding: 18px 14px;
        }
        .help-section h2 {
            font-size: 1.15rem;
        }
    }
</style>

<div class="help-wrapper">
    <!-- Hero Header -->
    <div class="help-hero glass">
        <h1><i class="fa-solid fa-circle-question icon-cyan"></i> Central de Ajuda & Guia</h1>
        <p>Aprenda a configurar chapas, cadastrar peças, utilizar o Leitor de Rascunhos com IA, calcular planos de corte otimizados e gerar ordens de serviço profissionais para oficina.</p>
        <div class="quick-badges-bar">
            <span class="q-badge"><i class="fa-solid fa-brain" style="color:#00e5ff;"></i> Leitor OCR IA</span>
            <span class="q-badge"><i class="fa-solid fa-cubes" style="color:#50fa7b;"></i> Multi-Material 2D</span>
            <span class="q-badge"><i class="fa-solid fa-tape" style="color:#f1fa8c;"></i> Fitas de Borda</span>
            <span class="q-badge"><i class="fa-solid fa-file-pdf" style="color:#ff79c6;"></i> Impressão A4</span>
            <span class="q-badge"><i class="fa-brands fa-pix" style="color:#32bcad;"></i> PIX Automático</span>
        </div>
    </div>

    <!-- Índice de Navegação Rápida -->
    <div class="help-toc-grid">
        <a href="#quickstart" class="toc-card glass">
            <div class="toc-icon"><i class="fa-solid fa-bolt"></i></div>
            <div><strong>1. Início Rápido</strong><br><small style="color:#94a3b8;">Comece em 3 passos</small></div>
        </a>
        <a href="#ocr-sketch" class="toc-card glass">
            <div class="toc-icon"><i class="fa-solid fa-camera"></i></div>
            <div><strong>2. Leitor de Rascunhos IA</strong><br><small style="color:#94a3b8;">Fotos, prints e Ctrl+V</small></div>
        </a>
        <a href="#materials-presets" class="toc-card glass">
            <div class="toc-icon"><i class="fa-solid fa-layer-group"></i></div>
            <div><strong>3. Materiais & Presets</strong><br><small style="color:#94a3b8;">MDF, Vidro, Aço, Naval</small></div>
        </a>
        <a href="#edge-banding" class="toc-card glass">
            <div class="toc-icon"><i class="fa-solid fa-tape"></i></div>
            <div><strong>4. Fitas de Borda & Veio</strong><br><small style="color:#94a3b8;">L1/L2/H1/H2 e rotação</small></div>
        </a>
        <a href="#algorithms" class="toc-card glass">
            <div class="toc-icon"><i class="fa-solid fa-gears"></i></div>
            <div><strong>5. Modos de Algoritmo</strong><br><small style="color:#94a3b8;">Guilhotina, MaxRects, Auto</small></div>
        </a>
        <a href="#print-export" class="toc-card glass">
            <div class="toc-icon"><i class="fa-solid fa-print"></i></div>
            <div><strong>6. Impressão & Exportação</strong><br><small style="color:#94a3b8;">A4 oficina, JSON, Excel</small></div>
        </a>
        <a href="#credits-keepai" class="toc-card glass">
            <div class="toc-icon"><i class="fa-solid fa-gem"></i></div>
            <div><strong>7. Créditos & PIX</strong><br><small style="color:#94a3b8;">Planos, bônus e Keep AI</small></div>
        </a>
        <a href="#faq" class="toc-card glass">
            <div class="toc-icon"><i class="fa-solid fa-comments"></i></div>
            <div><strong>8. Dúvidas Frequentes</strong><br><small style="color:#94a3b8;">Perguntas e respostas</small></div>
        </a>
    </div>

    <!-- 1. Início Rápido -->
    <section id="quickstart" class="help-section glass card">
        <h2><i class="fa-solid fa-bolt icon-yellow"></i> 1. Início Rápido (3 Passos)</h2>
        <p>O <strong>Corte Fácil Pro</strong> foi desenhado para você obter seu plano de corte otimizado em segundos:</p>
        <ol>
            <li><strong>Escolha o Material ou Preset:</strong> selecione o material (Madeira/MDF, Vidro Float ou Metal/Aço) e defina o tamanho da chapa bruta em milímetros (ex: <code>2750 x 1830 mm</code>).</li>
            <li><strong>Insira as Peças:</strong> adicione manualmente as peças, importe uma planilha Excel/CSV ou use o <strong>Leitor de Rascunhos com IA</strong> para fotografar suas anotações do caderno.</li>
            <li><strong>Gere a Otimização:</strong> clique no botão <strong>"GERAR PLANO DE CORTE OTIMIZADO"</strong>. O sistema processará o encaixe perfeito com o menor desperdício e desenhará cada chapa no visualizador interativo.</li>
        </ol>
        <div class="tip-box">
            <strong>💡 Dica Prática:</strong> Para ver como funciona na prática com 1 clique, use os botões <strong>"Exemplo Armário MDF"</strong>, <strong>"Exemplo Vidros"</strong> ou <strong>"Exemplo Chapas Aço"</strong> no topo da tela principal.
        </div>
    </section>

    <!-- 2. Leitor de Rascunhos e Fotos com IA -->
    <section id="ocr-sketch" class="help-section glass card">
        <h2><i class="fa-solid fa-wand-magic-sparkles icon-cyan"></i> 2. Leitor de Rascunhos e Listas com IA (Vision OCR)</h2>
        <p>Elimine o trabalho manual de digitar dezenas de medidas. Nosso motor de Visão Computacional analisa imagens reais de anotações e croquis:</p>
        
        <div class="feature-box">
            <h3><i class="fa-solid fa-camera"></i> 3 Formas Fáceis de Enviar:</h3>
            <ul>
                <li><strong>📷 Câmera Direta (Celular/Tablet):</strong> clique em "Tirar Foto" para abrir a câmera traseira do seu aparelho e fotografar a folha de papel na bancada da oficina.</li>
                <li><strong>📁 Upload / Arrastar & Soltar:</strong> envie fotos ou prints salvos no seu computador (formatos JPG, PNG ou WEBP).</li>
                <li><strong>📋 Colar com Ctrl+V:</strong> tire um print ou copie uma imagem para a área de transferência e pressione <code>Ctrl + V</code> em qualquer lugar do modal.</li>
            </ul>
        </div>

        <h3><i class="fa-solid fa-microchip"></i> O que a IA reconhece automaticamente:</h3>
        <ul>
            <li><strong>Caligrafia Manuscrita:</strong> notas feitas à mão com caneta ou lápis.</li>
            <li><strong>Conversão de Unidades:</strong> se você anotou em centímetros (ex: <code>70 x 45</code>) ou metros (ex: <code>1,20 x 0,60</code>), a IA converte com precisão para milímetros (<code>700 x 450 mm</code> e <code>1200 x 600 mm</code>).</li>
            <li><strong>Fitas de Borda:</strong> entende notações comuns de marcenaria como <code>1C</code> (1 comprimento), <code>2C</code> (2 comprimentos), <code>1L</code> (1 largura), <code>2L</code> (2 larguras), <code>4L</code> (todos os lados) e <code>F1C1L</code>.</li>
            <li><strong>Dimensão da Chapa Bruta:</strong> se você anotou o tamanho da placa bruta (ex: <code>Chapa 2750x1830</code>), a IA sugere preenchê-la automaticamente.</li>
        </ul>

        <div class="tip-box">
            <strong>Revisão Antes de Aplicar:</strong> Após a IA processar a imagem, uma tabela de prévia é exibida permitindo que você edite qualquer valor antes de escolher entre <em>"Substituir Lista Atual"</em> ou <em>"Adicionar à Lista Existente"</em>.
        </div>
    </section>

    <!-- 3. Materiais & Presets -->
    <section id="materials-presets" class="help-section glass card">
        <h2><i class="fa-solid fa-layer-group icon-purple"></i> 3. Materiais & Presets de Mercado</h2>
        <p>O Corte Fácil Pro é um otimizador 2D universal adaptável a múltiplos tipos de matérias-primas:</p>
        
        <div class="algo-grid">
            <div class="algo-card">
                <h4>🪵 Madeira / MDF / MDP</h4>
                <p>Espessura de serra típica: <strong>3 a 4 mm</strong>. Refilo de borda: <strong>10 mm</strong>. Suporta fitas de borda e controle de veio.</p>
            </div>
            <div class="algo-card">
                <h4>🪟 Vidro Float / Temperado</h4>
                <p>Corte por diamante / mesa de corte: <strong>2 mm</strong>. Corte guilhotina linear obrigatório (de ponta a ponta sem retorno).</p>
            </div>
            <div class="algo-card">
                <h4>⚙️ Aço / Inox / Chapas Metálicas</h4>
                <p>Corte laser/plasma/CNC: kerf de <strong>0.5 a 1.5 mm</strong>. Algoritmo MaxRects de alta densidade sem travas lineares.</p>
            </div>
            <div class="algo-card">
                <h4>⛵ Compensado Naval / Acrílico</h4>
                <p>Presets com dimensões padrão de revenda (2200x1600 mm ou 2440x1220 mm) com serra ajustável.</p>
            </div>
        </div>
    </section>

    <!-- 4. Fitas de Borda & Sentido do Veio -->
    <section id="edge-banding" class="help-section glass card">
        <h2><i class="fa-solid fa-tape icon-yellow"></i> 4. Fitas de Borda & Sentido do Veio (Marcenaria)</h2>
        <p>No modo Madeira/MDF, você tem controle total de acabamento por peça:</p>
        <ul>
            <li><strong>Lados de Aplicação:</strong> escolha quais lados da peça receberão fita de PVC/borda — Superior (L1), Inferior (L2), Esquerda (H1), Direita (H2) ou botão rápido <strong>4 Lados</strong>.</li>
            <li><strong>Cálculo Linear Automático:</strong> o sistema calcula os metros lineares totais de fita necessários para o projeto completo.</li>
            <li><strong>Sentido do Veio da Madeira:</strong> se você desmarcar <em>"Permitir Rotação Global"</em>, o algoritmo manterá as peças orientadas na direção do veio da chapa de MDF para evitar padrões visuais desalinhados em portas e frentes.</li>
        </ul>
    </section>

    <!-- 5. Modos de Algoritmo -->
    <section id="algorithms" class="help-section glass card">
        <h2><i class="fa-solid fa-gears icon-green"></i> 5. Modos de Algoritmo de Corte</h2>
        <p>O sistema possui múltiplos motores geométricos para se adequar ao tipo de máquina da sua fábrica ou oficina:</p>

        <div class="algo-grid">
            <div class="algo-card">
                <h4 style="color:#50fa7b;">⚡ Automático (Recomendado)</h4>
                <p>Executa simulações paralelas (Best Fit, Short Side, Guillotine) e seleciona automaticamente a disposição com menor desperdício e menor número de chapas.</p>
            </div>
            <div class="algo-card">
                <h4 style="color:#00e5ff;">🪚 Guilhotina 2D (Linear)</h4>
                <p>Gera exclusivamente cortes retos contínuos de ponta a ponta. Essencial para <strong>esquadrejadeiras manuais</strong>, <strong>seccionadoras sem mesa de giro</strong> e <strong>corte de vidro</strong>.</p>
            </div>
            <div class="algo-card">
                <h4 style="color:#ff79c6;">⚙️ Retângulos Máximos (MaxRects)</h4>
                <p>Permite cortes em formato de encaixe complexo, maximizando a densidade de peças. Ideal para <strong>Routers CNC</strong>, <strong>Corte a Laser</strong> e <strong>Plasma</strong>.</p>
            </div>
            <div class="algo-card">
                <h4 style="color:#bd93f9;">📦 Shelf Packing (Faixas)</h4>
                <p>Organiza as peças em prateleiras/faixas de mesma altura, facilitando o corte rápido em série e organização do empilhamento.</p>
            </div>
        </div>
    </section>

    <!-- 6. Impressão & Exportação -->
    <section id="print-export" class="help-section glass card">
        <h2><i class="fa-solid fa-print icon-pink"></i> 6. Impressão & Exportação de Projetos</h2>
        <p>Leve a ordem de serviço pronta para a máquina ou compartilhe com sua equipe:</p>
        <ul>
            <li><strong>🖨️ Imprimir Ordem de Corte (A4):</strong> gera uma impressão limpa em fundo branco, pronta para folha A4, contendo a lista de peças, dimensões, fitas de borda e o desenho cotado de cada chapa.</li>
            <li><strong>📄 Importar / Exportar JSON:</strong> salve o projeto completo no seu computador para continuar mais tarde ou enviar para outro operador.</li>
            <li><strong>📊 Importar Planilhas (Excel / CSV):</strong> importe listagens geradas por outros softwares com colunas automáticas de Largura, Altura e Quantidade.</li>
        </ul>
    </section>

    <!-- 7. Créditos & Ecossistema Keep AI -->
    <section id="credits-keepai" class="help-section glass card">
        <h2><i class="fa-solid fa-gem icon-cyan"></i> 7. Créditos, PIX & Conta Keep AI</h2>
        <p>O Corte Fácil Pro utiliza um sistema de créditos transparente com liberação automática:</p>
        <ul>
            <li><strong>🎁 5 Créditos Grátis:</strong> novos usuários recebem 5 créditos gratuitos na primeira visita para testar e validar o sistema.</li>
            <li><strong>💳 Pacotes PIX:</strong> recarregue créditos instantaneamente via PIX direto processado pelo Mercado Pago:
                <ul>
                    <li>🥉 <strong>Bronze:</strong> R$ 4,90 (10 Créditos)</li>
                    <li>🥈 <strong>Prata:</strong> R$ 19,90 (50 Créditos) — <em>Mais Popular</em></li>
                    <li>🥇 <strong>Ouro:</strong> R$ 34,90 (100 Créditos)</li>
                </ul>
            </li>
            <li><strong>🌐 Conta Unificada Keep AI:</strong> faça login com sua conta Keep AI no modal de recarga para compartilhar e utilizar seus créditos em todos os aplicativos da plataforma 4uLabs.</li>
        </ul>
    </section>

    <!-- 8. Dúvidas Frequentes (FAQ) -->
    <section id="faq" class="help-section glass card">
        <h2><i class="fa-solid fa-comments icon-yellow"></i> 8. Perguntas Frequentes (FAQ)</h2>
        
        <div class="faq-item">
            <div class="faq-question"><i class="fa-solid fa-circle-question icon-cyan"></i> O que é a Espessura de Corte (Kerf)?</div>
            <p class="faq-answer">É a largura do corte consumida pela serra, disco ou feixe de laser (geralmente entre 3mm e 4mm para serras de madeira, 2mm para vidro e 1mm para laser). O algoritmo desconta esse espaço para garantir que as peças cortadas tenham as medidas exatas.</p>
        </div>

        <div class="faq-item">
            <div class="faq-question"><i class="fa-solid fa-circle-question icon-cyan"></i> O que é o Refilo de Borda?</div>
            <p class="faq-answer">É uma pequena margem (geralmente 10mm) descartada em torno de toda a chapa bruta para eliminar quinas batidas, lascadas ou defeitos de transporte antes do esquadrejamento.</p>
        </div>

        <div class="faq-item">
            <div class="faq-question"><i class="fa-solid fa-circle-question icon-cyan"></i> Como usar no celular ou tablet na oficina?</div>
            <p class="faq-answer">O Corte Fácil Pro é um PWA (Progressive Web App). Basta abrir o site no navegador do celular (Chrome ou Safari) e clicar em "Adicionar à Tela de Início" ou no botão "Instalar Aplicativo". Ele funcionará em tela cheia como um app nativo.</p>
        </div>

        <div class="faq-item">
            <div class="faq-question"><i class="fa-solid fa-circle-question icon-cyan"></i> O que acontece se a peça for maior que a chapa?</div>
            <p class="faq-answer">O sistema exibirá um aviso impedindo a inserção de peças com dimensões superiores à chapa bruta configurada.</p>
        </div>
    </section>

    <!-- Ação de Retorno ao App -->
    <div style="text-align: center; margin-top: 20px;">
        <a href="index.php" class="control-button optimize large-btn" style="text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-calculator"></i> ABRIR OTIMIZADOR DE CORTE
        </a>
    </div>
</div>

<?php 
include 'ui_modals.php';
include 'ui_footer.php'; 
?>