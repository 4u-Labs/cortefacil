/* Corte Fácil workspace localization. No network requests or user-data translation. */
(function (host, factory) {
    'use strict';
    const exports = factory();
    if (typeof module === 'object' && module.exports) module.exports = exports;
    if (host && host.document) host.CorteI18n = exports.createI18n(host);
})(typeof window !== 'undefined' ? window : globalThis, function () {
    'use strict';
    const PAIRS = [
        ['Chapa', 'Sheet'], ['Peças', 'Parts'], ['Plano', 'Plan'], ['Ajuda', 'Help'], ['Apoiar', 'Support'],
        ['Aplicativos, suporte e comunidade', 'Apps, support and community'], ['Instalar app', 'Install app'],
        ['Instalar App', 'Install App'], ['Instalar aplicativo', 'Install application'], ['INSTALAR APP', 'INSTALL APP'],
        ['Projeto & Material', 'Project & material'], ['Projeto e material', 'Project and material'],
        ['Nome do Cliente / Marcenaria', 'Client / workshop name'], ['Ex: João Silva', 'E.g. John Smith'],
        ['Nome do Projeto / Móvel', 'Project / furniture name'], ['Ex: Armário Cozinha / Fachada', 'E.g. Kitchen cabinet / facade'],
        ['Tipo de Material', 'Material type'], ['Material', 'Material'],
        ['🪵 Madeira / MDF / MDP / Compensado', '🪵 Wood / MDF / MDP / plywood'],
        ['🪟 Vidro / Espelho (Corte Guilhotina)', '🪟 Glass / mirror (guillotine cutting)'],
        ['⚙️ Metal / Aço / Alumínio (Laser/Plasma/Guilhotina)', '⚙️ Metal / steel / aluminum (laser/plasma/guillotine)'],
        ['🎨 Acrílico / ACM / Plásticos', '🎨 Acrylic / ACM / plastics'], ['🔲 Chapa Personalizada', '🔲 Custom sheet'],
        ['Presets de Chapas de Mercado', 'Standard sheet presets'], ['Demonstração Rápida', 'Quick demonstration'],
        ['Clique para carregar as dimensões e serra padrão:', 'Select a preset to load standard dimensions and saw kerf:'],
        ['MDF Brasil', 'Brazilian MDF'], ['MDF Meia Chapa', 'Half MDF sheet'], ['Vidro Padrão', 'Standard glass'],
        ['Aço / Inox 3m', 'Steel / stainless 3m'], ['Aço Padrão 2m', 'Standard steel 2m'], ['Compensado', 'Plywood'],
        ['Carregar Projeto Completo de Exemplo:', 'Load a complete sample project:'],
        ['Preenche todas as peças, fitas de borda, custos e já gera o plano de corte otimizado na tela:', 'Loads sample parts, edge banding and costs, then displays the cutting plan:'],
        ['Carregar Projeto Completo de Armário MDF com 10 tipos de peças', 'Load a complete MDF cabinet with 10 part types'],
        ['🪵 Exemplo Armário MDF', '🪵 MDF cabinet example'], ['🪟 Exemplo Vidros', '🪟 Glass example'], ['⚙️ Exemplo Chapas Aço', '⚙️ Steel sheet example'],
        ['Carregar Projeto Completo de Vidraçaria', 'Load a complete glass project'], ['Carregar Projeto Completo em Chapas de Aço', 'Load a complete steel sheet project'],
        ['Dimensões da Chapa (mm)', 'Sheet dimensions (mm)'], ['Dimensões da chapa', 'Sheet dimensions'],
        ['Largura (mm)', 'Width (mm)'], ['Altura (mm)', 'Height (mm)'], ['Corte / Kerf (mm)', 'Saw kerf (mm)'],
        ['Refilo Borda (mm)', 'Edge trim (mm)'], ['Margem de desbaste das bordas da chapa', 'Trimming margin around the sheet edges'],
        ['Se desmarcado, respeita o sentido do veio da madeira/chapa', 'When unchecked, preserves the sheet grain direction'],
        ['Permitir Rotação Global', 'Allow global rotation'], ['Modo do Algoritmo', 'Algorithm mode'],
        ['⚡ Automático (Menor Desperdício)', '⚡ Automatic (least waste)'], ['🪚 Guilhotina 2D (Linear de ponta a ponta)', '🪚 2D guillotine (full-length linear cuts)'],
        ['⚙️ Retângulos Máximos (Laser/CNC)', '⚙️ Maximal rectangles (laser/CNC)'], ['📦 Shelf Packing (Faixas)', '📦 Shelf packing (strips)'],
        ['Adicionar Peça', 'Add part'], ['Adicionar peça', 'Add part'], ['Descrição / Nome da Peça', 'Description / part name'],
        ['Ex: Porta, Tampo, Vidro Fixo', 'E.g. Door, top, fixed glass'], ['L (mm)', 'W (mm)'], ['H (mm)', 'H (mm)'], ['Qtd', 'Qty'],
        ['Fita de Borda (Acabamento):', 'Edge banding (finish):'], ['Superior (L1)', 'Top (L1)'], ['Inferior (L2)', 'Bottom (L2)'],
        ['Esquerda (H1)', 'Left (H1)'], ['Direita (H2)', 'Right (H2)'], ['4 Lados', 'All 4 sides'], ['Inserir Peça na Lista', 'Add part to list'],
        ['Peças do Projeto', 'Project parts'], ['Ler rascunho, foto ou print com IA', 'Read a sketch, photo or screenshot with AI'],
        ['Ler Rascunho IA', 'Read sketch with AI'], ['Limpar lista inteira', 'Clear the entire list'], ['Limpar', 'Clear'],
        ['Descrição', 'Description'], ['Medidas (mm)', 'Dimensions (mm)'], ['Bordas', 'Edges'], ['Ações', 'Actions'],
        ['Nenhuma peça adicionada ainda. Adicione acima ou importe um rascunho com IA.', 'No parts yet. Add a part above or import a sketch with AI.'],
        ['Nenhuma peça adicionada ainda. Adicione acima ou importe uma planilha.', 'No parts yet. Add a part above or import a spreadsheet.'],
        ['Custos & Orçamento (Opcional)', 'Costs & estimate (optional)'], ['Custos e orçamento', 'Costs and estimate'],
        ['Preço por Chapa (R$)', 'Price per sheet (BRL)'], ['Fita de Borda (R$/metro)', 'Edge banding (BRL/metre)'],
        ['Ex: 180.00', 'E.g. 180.00'], ['Ex: 1.50', 'E.g. 1.50'],
        ['GERAR PLANO DE CORTE OTIMIZADO', 'GENERATE OPTIMIZED CUTTING PLAN'], ['Gerar Plano de Corte', 'Generate cutting plan'],
        ['Gerar plano', 'Generate plan'], ['Importar Planilha', 'Import spreadsheet'], ['Exportar JSON', 'Export JSON'], ['Importar JSON', 'Import JSON'],
        ['Imprimir Ordem de Corte (A4)', 'Print cutting order (A4)'], ['Resultado da Otimização', 'Optimization result'],
        ['Aumentar Zoom', 'Zoom in'], ['Diminuir Zoom', 'Zoom out'], ['Ajustar à Tela', 'Fit to view'], ['Ajustar', 'Fit'],
        ['Alternar Nomes/Medidas', 'Toggle names/dimensions'], ['Detalhes', 'Details'], ['Ocultos', 'Hidden'],
        ['Total de Chapas', 'Total sheets'], ['Aproveitamento', 'Utilization'], ['Desperdício', 'Waste'], ['Fita de Borda', 'Edge banding'],
        ['Custo Estimado', 'Estimated cost'], ['Aguardando inserção de peças e clique em', 'Add parts and select'], ['Pronto para Otimizar', 'Ready to optimize'],
        ['Adicione suas peças no formulário ao lado ou selecione um dos presets de mercado para visualizar o mapa de corte inteligente.', 'Add your parts or load a sample project to view the cutting map.'],
        ['Clique 5 vezes para acesso bônus', 'Click 5 times for bonus access'], ['Saldo de Otimizações', 'Optimization balance'],
        ['Comprar Créditos', 'Buy credits'], ['Sincronizando...', 'Synchronizing...'], ['Pendente', 'Pending'], ['Salvo', 'Saved'],
        ['Central de Ajuda', 'Help centre'], ['Privacidade', 'Privacy'], ['Termos', 'Terms'], ['App Icon', 'App icon'],
        ['CorteFácil Pro no seu Celular!', 'CorteFácil Pro on your phone!'], ['Use offline e acesse mais rápido.', 'Use offline and open faster.'], ['Agora não', 'Not now'],
        ['Super Acesso Pro', 'Pro access'], ['Insira a chave de liberação:', 'Enter the activation key:'], ['Cancelar', 'Cancel'], ['Ativar', 'Activate'],
        ['Recarregar Créditos', 'Top up credits'], ['Pagamento exclusivo via', 'Payment exclusively via'], ['(Liberação Imediata)', '(Immediate activation)'],
        ['Prata', 'Silver'], ['Ouro', 'Gold'], ['GERAR CÓDIGO PIX', 'GENERATE PIX CODE'], ['Aguardando Pagamento PIX...', 'Waiting for PIX payment...'],
        ['Escaneie o QR Code ou copie a chave copia e cola abaixo:', 'Scan the QR code or copy the payment code below:'], ['Copiar Código PIX', 'Copy PIX code'],
        ['Conta Unificada Keep AI', 'Unified Keep AI account'], ['Fechar', 'Close'], ['Conformidade', 'Compliance'], ['Entendido', 'Understood'],
        ['Seus dados de projeto são armazenados localmente e sincronizados de forma segura via ID de Acesso.', 'Your project data is stored locally and synchronized securely using your access ID.'],
        ['Não compartilhamos informações com terceiros. Os pagamentos são processados 100% pelo Mercado Pago.', 'We do not share information with third parties. Payments are processed by Mercado Pago.'],
        ['Termos de Uso', 'Terms of use'], ['O CorteFácil Pro é uma ferramenta de auxílio. A conferência final das medidas é responsabilidade do usuário.', 'CorteFácil Pro is an assistance tool. The user is responsible for the final verification of dimensions.'],
        ['Créditos', 'Credits'], ['Cada otimização consome 1 crédito. Pacotes ilimitados removem esta trava.', 'Each optimization uses 1 credit. Unlimited packages remove this limit.'],
        ['Aceitar', 'Accept'], ['Confirmar Ação', 'Confirm action'], ['Deseja realmente prosseguir com esta ação?', 'Do you really want to proceed with this action?'], ['Confirmar', 'Confirm'],
        ['Leitor de Rascunhos com IA', 'AI sketch reader'], ['Tire foto do caderno de anotações, rascunho desenhado ou print. A IA lê as medidas, quantidades e fitas de borda automaticamente.', 'Photograph your notes, drawing or screenshot. AI reads the dimensions, quantities and edge banding.'],
        ['Enquadre o rascunho na tela', 'Fit the sketch inside the frame'], ['CAPTURAR FOTO', 'CAPTURE PHOTO'], ['Alternar Câmera', 'Switch camera'],
        ['Como deseja enviar seu rascunho?', 'How would you like to send your sketch?'], ['Tire uma foto na bancada ou escolha uma imagem/print:', 'Take a photo at the workbench or choose an image/screenshot:'],
        ['Tirar Foto (Câmera)', 'Take photo (camera)'], ['Escolher Arquivo / Galeria', 'Choose file / gallery'], ['Dica: Você também pode colar uma imagem direto com', 'Tip: you can also paste an image using'],
        ['Prévia do Rascunho', 'Sketch preview'], ['Unidade do Rascunho:', 'Sketch units:'], ['🤖 Auto (Reconhecimento Inteligente)', '🤖 Auto (smart recognition)'],
        ['Milímetros (mm) — Ex: 2000 x 500', 'Millimetres (mm) — E.g. 2000 x 500'], ['Centímetros (cm) — Ex: 200 x 50', 'Centimetres (cm) — E.g. 200 x 50'], ['Metros (m) — Ex: 2.00 x 0.50', 'Metres (m) — E.g. 2.00 x 0.50'],
        ['Observações Extras (Opcional):', 'Extra notes (optional):'], ['Ex: MDF 15mm, desconsiderar rabiscos...', 'E.g. 15 mm MDF, ignore scribbles...'],
        ['Trocar Imagem', 'Change image'], ['Extrair Peças com IA', 'Extract parts with AI'], ['Analisando imagem com Visão Computacional...', 'Analyzing image with computer vision...'],
        ['Identificando cotas, medidas, quantidades e fitas de borda...', 'Identifying dimensions, quantities and edge banding...'],
        ['Rascunho Processado com Sucesso!', 'Sketch processed successfully!'], ['Aplicar dimensões da chapa detectada:', 'Apply detected sheet dimensions:'],
        ['Descrição / Peça', 'Description / part'], ['Compr. (mm)', 'Length (mm)'], ['Larg. (mm)', 'Width (mm)'], ['Girar?', 'Rotate?'], ['Ação', 'Action'],
        ['Nova Foto', 'New photo'], ['Adicionar à Lista', 'Append to list'], ['Substituir Lista', 'Replace list'],
        ['Central de Ajuda & Guia', 'Help centre & guide'],
        ['Aprenda a configurar chapas, cadastrar peças, utilizar o Leitor de Rascunhos com IA, calcular planos de corte otimizados e gerar ordens de serviço profissionais para oficina.', 'Learn how to configure sheets, enter parts, use the AI sketch reader, calculate cutting plans and prepare production orders.'],
        ['Leitor OCR IA', 'AI OCR reader'], ['Multi-Material 2D', 'Multi-material 2D'], ['Fitas de Borda', 'Edge banding'], ['Impressão A4', 'A4 printing'], ['PIX Automático', 'Automatic PIX'],
        ['1. Início Rápido', '1. Quick start'], ['Comece em 3 passos', 'Get started in 3 steps'], ['2. Leitor de Rascunhos IA', '2. AI sketch reader'], ['Fotos, prints e Ctrl+V', 'Photos, screenshots and Ctrl+V'],
        ['3. Materiais & Presets', '3. Materials & presets'], ['MDF, Vidro, Aço, Naval', 'MDF, glass, steel, plywood'], ['4. Fitas de Borda & Veio', '4. Edge banding & grain'], ['L1/L2/H1/H2 e rotação', 'L1/L2/H1/H2 and rotation'],
        ['5. Modos de Algoritmo', '5. Algorithm modes'], ['Guilhotina, MaxRects, Auto', 'Guillotine, MaxRects, Auto'], ['6. Impressão & Exportação', '6. Printing & export'], ['A4 oficina, JSON, Excel', 'Workshop A4, JSON, Excel'],
        ['7. Créditos & PIX', '7. Credits & PIX'], ['Planos, bônus e Keep AI', 'Plans, bonuses and Keep AI'], ['8. Dúvidas Frequentes', '8. Frequently asked questions'], ['Perguntas e respostas', 'Questions and answers'],
        ['1. Início Rápido (3 Passos)', '1. Quick start (3 steps)'], ['O', 'The'], ['foi desenhado para você obter seu plano de corte otimizado em segundos:', 'was designed to prepare your cutting plan in seconds:'],
        ['Escolha o Material ou Preset:', 'Choose the material or preset:'], ['selecione o material (Madeira/MDF, Vidro Float ou Metal/Aço) e defina o tamanho da chapa bruta em milímetros (ex:', 'select the material (wood/MDF, float glass or metal/steel) and set the raw sheet size in millimetres (e.g.'],
        ['Insira as Peças:', 'Enter the parts:'], ['adicione manualmente as peças, importe uma planilha Excel/CSV ou use o', 'add parts manually, import an Excel/CSV spreadsheet or use the'], ['para fotografar suas anotações do caderno.', 'to photograph your handwritten notes.'],
        ['Gere a Otimização:', 'Generate the optimization:'], ['clique no botão', 'click the button'], ['"GERAR PLANO DE CORTE OTIMIZADO"', '"GENERATE OPTIMIZED CUTTING PLAN"'],
        ['. O sistema processará o encaixe perfeito com o menor desperdício e desenhará cada chapa no visualizador interativo.', '. The system calculates a low-waste arrangement and draws each sheet in the interactive viewer.'],
        ['💡 Dica Prática:', '💡 Practical tip:'], ['Para ver como funciona na prática com 1 clique, use os botões', 'To try it with one click, use the buttons'],
        ['"Exemplo Armário MDF"', '"MDF cabinet example"'], ['"Exemplo Vidros"', '"Glass example"'], ['"Exemplo Chapas Aço"', '"Steel sheet example"'], ['ou', 'or'], ['no topo da tela principal.', 'at the top of the main screen.'],
        ['2. Leitor de Rascunhos e Listas com IA (Vision OCR)', '2. AI sketch and list reader (Vision OCR)'],
        ['Elimine o trabalho manual de digitar dezenas de medidas. Nosso motor de Visão Computacional analisa imagens reais de anotações e croquis:', 'Avoid manually typing dozens of dimensions. The computer vision engine analyzes images of notes and sketches:'],
        ['3 Formas Fáceis de Enviar:', '3 easy ways to send:'], ['📷 Câmera Direta (Celular/Tablet):', '📷 Camera (phone/tablet):'],
        ['clique em "Tirar Foto" para abrir a câmera traseira do seu aparelho e fotografar a folha de papel na bancada da oficina.', 'select "Take photo" to open your rear camera and photograph the paper on the workbench.'],
        ['📁 Upload / Arrastar & Soltar:', '📁 Upload / drag & drop:'], ['envie fotos ou prints salvos no seu computador (formatos JPG, PNG ou WEBP).', 'send photos or screenshots saved on your computer (JPG, PNG or WEBP).'],
        ['📋 Colar com Ctrl+V:', '📋 Paste with Ctrl+V:'], ['tire um print ou copie uma imagem para a área de transferência e pressione', 'take a screenshot or copy an image to the clipboard and press'], ['em qualquer lugar do modal.', 'anywhere in the dialog.'],
        ['O que a IA reconhece automaticamente:', 'What AI recognizes automatically:'], ['Caligrafia Manuscrita:', 'Handwriting:'], ['notas feitas à mão com caneta ou lápis.', 'notes written with a pen or pencil.'],
        ['Conversão de Unidades:', 'Unit conversion:'], ['se você anotou em centímetros (ex:', 'if your notes use centimetres (e.g.'], [') ou metros (ex:', ') or metres (e.g.'], ['), a IA converte com precisão para milímetros (', '), AI converts them to millimetres ('], ['e', 'and'],
        ['Fitas de Borda:', 'Edge banding:'], ['entende notações comuns de marcenaria como', 'understands common woodworking notation such as'], ['(1 comprimento),', '(one long edge),'], ['(2 comprimentos),', '(two long edges),'], ['(1 largura),', '(one short edge),'], ['(2 larguras),', '(two short edges),'], ['(todos os lados) e', '(all sides) and'],
        ['Dimensão da Chapa Bruta:', 'Raw sheet dimensions:'], ['se você anotou o tamanho da placa bruta (ex:', 'if you wrote down the raw sheet size (e.g.'], ['Chapa 2750x1830', 'Sheet 2750x1830'], ['), a IA sugere preenchê-la automaticamente.', '), AI suggests filling it in.'],
        ['Revisão Antes de Aplicar:', 'Review before applying:'], ['Após a IA processar a imagem, uma tabela de prévia é exibida permitindo que você edite qualquer valor antes de escolher entre', 'After processing the image, a preview table lets you edit every value before choosing between'], ['"Substituir Lista Atual"', '"Replace current list"'], ['"Adicionar à Lista Existente"', '"Append to existing list"'],
        ['3. Materiais & Presets de Mercado', '3. Materials & standard presets'], ['O Corte Fácil Pro é um otimizador 2D universal adaptável a múltiplos tipos de matérias-primas:', 'Corte Fácil Pro is a 2D optimizer for multiple raw materials:'],
        ['🪵 Madeira / MDF / MDP', '🪵 Wood / MDF / MDP'], ['Espessura de serra típica:', 'Typical saw kerf:'], ['3 a 4 mm', '3 to 4 mm'], ['. Refilo de borda:', '. Edge trim:'], ['. Suporta fitas de borda e controle de veio.', '. Supports edge banding and grain direction.'],
        ['🪟 Vidro Float / Temperado', '🪟 Float / tempered glass'], ['Corte por diamante / mesa de corte:', 'Diamond cutting / cutting table:'], ['. Corte guilhotina linear obrigatório (de ponta a ponta sem retorno).', '. Requires linear guillotine cuts from edge to edge.'],
        ['⚙️ Aço / Inox / Chapas Metálicas', '⚙️ Steel / stainless / metal sheets'], ['Corte laser/plasma/CNC: kerf de', 'Laser/plasma/CNC cutting: kerf of'], ['0.5 a 1.5 mm', '0.5 to 1.5 mm'], ['. Algoritmo MaxRects de alta densidade sem travas lineares.', '. High-density MaxRects algorithm without linear constraints.'],
        ['⛵ Compensado Naval / Acrílico', '⛵ Marine plywood / acrylic'], ['Presets com dimensões padrão de revenda (2200x1600 mm ou 2440x1220 mm) com serra ajustável.', 'Standard stock dimensions (2200x1600 mm or 2440x1220 mm) with adjustable saw kerf.'],
        ['4. Fitas de Borda & Sentido do Veio (Marcenaria)', '4. Edge banding & grain direction (woodworking)'], ['No modo Madeira/MDF, você tem controle total de acabamento por peça:', 'Wood/MDF mode gives you finish control for each part:'],
        ['Lados de Aplicação:', 'Application sides:'], ['escolha quais lados da peça receberão fita de PVC/borda — Superior (L1), Inferior (L2), Esquerda (H1), Direita (H2) ou botão rápido', 'choose which sides receive edge banding: top (L1), bottom (L2), left (H1), right (H2), or use'],
        ['Cálculo Linear Automático:', 'Automatic linear calculation:'], ['o sistema calcula os metros lineares totais de fita necessários para o projeto completo.', 'the system calculates the total metres of edge banding required for the project.'],
        ['Sentido do Veio da Madeira:', 'Wood grain direction:'], ['se você desmarcar', 'if you uncheck'], ['"Permitir Rotação Global"', '"Allow global rotation"'], [', o algoritmo manterá as peças orientadas na direção do veio da chapa de MDF para evitar padrões visuais desalinhados em portas e frentes.', ', the algorithm preserves part orientation to avoid misaligned grain patterns on doors and fronts.'],
        ['5. Modos de Algoritmo de Corte', '5. Cutting algorithm modes'], ['O sistema possui múltiplos motores geométricos para se adequar ao tipo de máquina da sua fábrica ou oficina:', 'The system offers several geometric engines for different workshop machines:'],
        ['⚡ Automático (Recomendado)', '⚡ Automatic (recommended)'], ['Executa simulações paralelas (Best Fit, Short Side, Guillotine) e seleciona automaticamente a disposição com menor desperdício e menor número de chapas.', 'Compares Best Fit, Short Side and Guillotine arrangements, selecting the result with fewer sheets and less waste.'],
        ['🪚 Guilhotina 2D (Linear)', '🪚 2D guillotine (linear)'], ['Gera exclusivamente cortes retos contínuos de ponta a ponta. Essencial para', 'Creates only continuous straight cuts from edge to edge. Suitable for'], ['esquadrejadeiras manuais', 'manual panel saws'], ['seccionadoras sem mesa de giro', 'panel saws without a rotating table'], ['corte de vidro', 'glass cutting'],
        ['⚙️ Retângulos Máximos (MaxRects)', '⚙️ Maximal rectangles (MaxRects)'], ['Permite cortes em formato de encaixe complexo, maximizando a densidade de peças. Ideal para', 'Allows complex nesting to increase part density. Suitable for'], ['Routers CNC', 'CNC routers'], ['Corte a Laser', 'Laser cutting'],
        ['Organiza as peças em prateleiras/faixas de mesma altura, facilitando o corte rápido em série e organização do empilhamento.', 'Organizes parts in equal-height shelves or strips, simplifying batch cutting and stacking.'],
        ['6. Impressão & Exportação de Projetos', '6. Printing & project export'], ['Leve a ordem de serviço pronta para a máquina ou compartilhe com sua equipe:', 'Take the production order to the machine or share it with your team:'],
        ['🖨️ Imprimir Ordem de Corte (A4):', '🖨️ Print cutting order (A4):'], ['gera uma impressão limpa em fundo branco, pronta para folha A4, contendo a lista de peças, dimensões, fitas de borda e o desenho cotado de cada chapa.', 'creates a clean A4 printout with the parts list, dimensions, edge banding and sheet diagrams.'],
        ['📄 Importar / Exportar JSON:', '📄 Import / export JSON:'], ['salve o projeto completo no seu computador para continuar mais tarde ou enviar para outro operador.', 'save the project on your computer to continue later or send it to another operator.'],
        ['📊 Importar Planilhas (Excel / CSV):', '📊 Import spreadsheets (Excel / CSV):'], ['importe listagens geradas por outros softwares com colunas automáticas de Largura, Altura e Quantidade.', 'import lists from other software using width, height and quantity columns.'],
        ['7. Créditos, PIX & Conta Keep AI', '7. Credits, PIX & Keep AI account'], ['O Corte Fácil Pro utiliza um sistema de créditos transparente com liberação automática:', 'Corte Fácil Pro uses credits with automatic activation:'],
        ['🎁 5 Créditos Grátis:', '🎁 5 free credits:'], ['novos usuários recebem 5 créditos gratuitos na primeira visita para testar e validar o sistema.', 'new users receive 5 free credits on their first visit to try the system.'], ['💳 Pacotes PIX:', '💳 PIX packages:'], ['recarregue créditos instantaneamente via PIX direto processado pelo Mercado Pago:', 'top up using PIX payments processed by Mercado Pago:'],
        ['Bronze:', 'Bronze:'], ['R$ 4,90 (10 Créditos)', 'R$ 4.90 (10 credits)'], ['Prata:', 'Silver:'], ['R$ 19,90 (50 Créditos) —', 'R$ 19.90 (50 credits) —'], ['Mais Popular', 'Most popular'], ['Ouro:', 'Gold:'], ['R$ 34,90 (100 Créditos)', 'R$ 34.90 (100 credits)'],
        ['🌐 Conta Unificada Keep AI:', '🌐 Unified Keep AI account:'], ['faça login com sua conta Keep AI no modal de recarga para compartilhar e utilizar seus créditos em todos os aplicativos da plataforma 4uLabs.', 'sign in to Keep AI in the top-up dialog to share your credits across 4uLabs apps.'],
        ['8. Perguntas Frequentes (FAQ)', '8. Frequently asked questions (FAQ)'], ['O que é a Espessura de Corte (Kerf)?', 'What is saw kerf?'],
        ['É a largura do corte consumida pela serra, disco ou feixe de laser (geralmente entre 3mm e 4mm para serras de madeira, 2mm para vidro e 1mm para laser). O algoritmo desconta esse espaço para garantir que as peças cortadas tenham as medidas exatas.', 'It is the width removed by the saw, disc or laser beam (typically 3–4 mm for wood saws, 2 mm for glass and 1 mm for laser). The algorithm allows for this gap when arranging parts.'],
        ['O que é o Refilo de Borda?', 'What is edge trim?'], ['É uma pequena margem (geralmente 10mm) descartada em torno de toda a chapa bruta para eliminar quinas batidas, lascadas ou defeitos de transporte antes do esquadrejamento.', 'It is a small margin (usually 10 mm) removed around the raw sheet to eliminate damaged or chipped edges before squaring.'],
        ['Como usar no celular ou tablet na oficina?', 'How do I use it on a phone or tablet in the workshop?'], ['O Corte Fácil Pro é um PWA (Progressive Web App). Basta abrir o site no navegador do celular (Chrome ou Safari) e clicar em "Adicionar à Tela de Início" ou no botão "Instalar Aplicativo". Ele funcionará em tela cheia como um app nativo.', 'Corte Fácil Pro is a Progressive Web App. Open it in Chrome or Safari and choose "Add to Home Screen" or "Install app" to use it in a standalone window.'],
        ['O que acontece se a peça for maior que a chapa?', 'What happens if a part is larger than the sheet?'], ['O sistema exibirá um aviso impedindo a inserção de peças com dimensões superiores à chapa bruta configurada.', 'The system displays a warning when a part exceeds the configured raw sheet dimensions.'], ['ABRIR OTIMIZADOR DE CORTE', 'OPEN CUTTING OPTIMIZER'],
        ['Editar', 'Edit'], ['Duplicar', 'Duplicate'], ['Excluir', 'Delete'], ['Salvar alterações', 'Save changes'], ['Cancelar edição', 'Cancel editing'],
        ['Nenhuma', 'None'], ['Nenhum', 'None'], ['Superior', 'Top'], ['Inferior', 'Bottom'], ['Esquerda', 'Left'], ['Direita', 'Right'],
        ['Parâmetros de corte', 'Cutting parameters'], ['Exemplos de projeto', 'Sample projects'], ['Experimentar um projeto', 'Try a sample project'],
        ['Selecionar peça', 'Select part'], ['Selecione uma peça no mapa ou na lista.', 'Select a part on the map or in the list.'],
        ['Plano de corte', 'Cutting plan'], ['Tela cheia', 'Full screen'], ['Sair da tela cheia', 'Exit full screen'], ['Ver na lista', 'View in list'],
        ['Loja de Apps', 'App store'], ['Sobre 4U', 'About 4U'], ['Aplicativos, suporte e comunidade', 'Apps, support and community'], ['Apoiar / PayPal', 'Support / PayPal'],
        ['Adicione pelo menos uma peça antes de otimizar!', 'Add at least one part before optimizing!'], ['Créditos insuficientes! Recarregue para continuar.', 'Insufficient credits! Top up to continue.'],
        ['Informe dimensões válidas (L e H > 0)!', 'Enter valid dimensions (width and height > 0)!'], ['Plano de corte otimizado com sucesso!', 'Cutting plan optimized successfully!'],
        ['Lista de peças limpa.', 'Parts list cleared.'], ['Deseja realmente limpar todas as peças da lista?', 'Do you really want to clear all parts?'],
        ['Projeto importado com sucesso!', 'Project imported successfully!'], ['Arquivo JSON inválido!', 'Invalid JSON file!'], ['Erro ao processar planilha Excel!', 'Error processing the spreadsheet!'],
        ['Preencha e-mail e senha!', 'Enter your email and password!'], ['Conectado ao Keep AI!', 'Signed in to Keep AI!'], ['Conta criada com sucesso!', 'Account created successfully!'], ['Falha na autenticação', 'Authentication failed'],
        ['Erro ao conectar ao servidor', 'Error connecting to the server'], ['Deseja realmente desconectar sua conta Keep AI deste dispositivo?', 'Do you really want to sign out of Keep AI on this device?'], ['Desconectado com sucesso!', 'Signed out successfully!'],
        ['GERANDO PIX...', 'GENERATING PIX...'], ['PIX gerado! Aguardando pagamento...', 'PIX generated! Waiting for payment...'], ['Erro ao gerar PIX', 'Error generating PIX'], ['Erro de conexão ao gerar PIX', 'Connection error generating PIX'], ['Chave PIX Copiada!', 'PIX code copied!'],
        ['Conectado ao ecossistema Keep AI', 'Connected to the Keep AI ecosystem'], ['DESCONECTAR', 'SIGN OUT'], ['Acesse ou crie sua conta para salvar, unificar e usar seus créditos em todos os apps da 4uLabs:', 'Sign in or create an account to use your shared credits across 4uLabs apps:'],
        ['Senha Keep AI', 'Keep AI password'], ['ENTRAR', 'SIGN IN'], ['CADASTRAR', 'REGISTER']
    ];
    const normalize = value => String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
    PAIRS.push(...[["Plano de corte e aproveitamento de chapas", "Sheet cutting and material utilization"], ["Saldo de otimizações", "Optimization balance"], ["Comprar créditos", "Buy credits"], ["Instalar", "Install"], ["Projeto neste navegador", "Project in this browser"], ["Alterações não exportadas", "Unexported changes"], ["Projeto exportado", "Project exported"], ["Etapas do projeto", "Project steps"], ["Ações do aplicativo", "Application actions"], ["Nome do projeto", "Project name"], ["Cliente / Marcenaria", "Client / workshop"], ["Ex: Armário da cozinha", "E.g. Kitchen cabinet"], ["Madeira / MDF / MDP / Compensado", "Wood / MDF / MDP / plywood"], ["Vidro / Espelho", "Glass / mirror"], ["Metal / Aço / Alumínio", "Metal / steel / aluminum"], ["Acrílico / ACM / Plásticos", "Acrylic / ACM / plastics"], ["Chapa personalizada", "Custom sheet"], ["Tamanhos de mercado", "Standard sheet sizes"], ["Serra / Kerf (mm)", "Saw kerf (mm)"], ["Refilo (mm)", "Edge trim (mm)"], ["Permitir rotação das peças", "Allow piece rotation"], ["Algoritmo", "Algorithm"], ["Automático (menor desperdício)", "Automatic (least waste)"], ["Retângulos máximos (Laser/CNC)", "Maximal rectangles (Laser/CNC)"], ["Faixas (Shelf Packing)", "Shelf packing"], ["Custos e orçamento", "Costs and budget"], ["Preço por chapa (R$)", "Price per sheet (R$)"], ["Fita de borda (R$/m)", "Edge banding (R$/m)"], ["Ex: 210,00", "E.g. 210.00"], ["Ex: 1,60", "E.g. 1.60"], ["Exemplos completos com peças, acabamentos e plano de corte.", "Complete examples with parts, finishes and cutting plans."], ["Armário MDF", "MDF cabinet"], ["Vidros", "Glass"], ["Chapas de aço", "Steel sheets"], ["Ler rascunho IA", "Read sketch with AI"], ["Ex: Porta, tampo, lateral", "E.g. Door, top, side panel"], ["Quantidade", "Quantity"], ["Fita de borda", "Edge banding"], ["4 lados", "4 edges"], ["Peças do projeto", "Project parts"], ["tipos ·", "types ·"], ["unidades", "units"], ["Importar e exportar projeto", "Import and export project"], ["Importar planilha", "Import spreadsheet"], ["Selecione uma peça no mapa para conferir seus detalhes.", "Select a part on the map to view its details."], ["Tela cheia", "Full screen"], ["Abrir mapa em tela cheia", "Open map in full screen"], ["Chapas", "Sheets"], ["Adicione suas peças e gere o plano de corte.", "Add your parts and generate the cutting plan."], ["Seu plano começa aqui", "Your plan starts here"], ["Configure a chapa e adicione suas peças. Ou experimente um projeto completo na aba Chapa.", "Configure the sheet and add parts, or try a complete example in the Sheet tab."], ["Imprimir ordem de corte", "Print cutting order"], ["Gerar plano de corte", "Generate cutting plan"], ["Chapa exibida", "Displayed sheet"], ["Aumentar zoom", "Zoom in"], ["Diminuir zoom", "Zoom out"], ["Ajuda do Corte Fácil", "Corte Fácil help"], ["Apoiar o projeto", "Support this project"], ["Tutorial", "Tutorial"], ["Portal 4U", "4U Portal"], ["Loja de Apps", "App store"], ["Sobre 4U", "About 4U"], ["Política de Privacidade", "Privacy policy"], ["Fita de borda:", "Edge banding:"], ["Peça selecionada", "Selected part"], ["Custos", "Costs"], ["Plano atualizado", "Plan up to date"]]);
    PAIRS.push(['Opcional','Optional'],['Guilhotina 2D','Guillotine 2D'],['Projeto nesta aba','Project in this tab'],['tipos','types'],['Inserir peça na lista','Add piece to list'],['Links oficiais 4u-Labs','Official 4u-Labs links']);
    PAIRS.push(...[["O projeto permanece nesta aba. Exporte o arquivo JSON para guardar uma cópia e reabri-la depois.", "The project remains in this tab. Export a JSON file to save a copy and reopen it later."], ["Ao usar o leitor de rascunhos, a imagem é enviada ao serviço de IA para extração das medidas. Os pagamentos são processados pelo Mercado Pago.", "When using the sketch reader, the image is sent to the AI service to extract dimensions. Payments are processed by Mercado Pago."]]);
    PAIRS.push(['Projeto neste navegador','Project in this browser'],['CorteFácil Pro - Otimizador 2D','CorteFácil Pro - 2D cutting optimizer']);
    const PT = new Map(PAIRS.map(([pt, en]) => [normalize(pt), en]));
    const EN = new Map(PAIRS.map(([pt, en]) => [normalize(en), pt]));
    const PATTERNS = [
        [/^(\d+) Créditos$/, '$1 credits', /^(\d+) credits$/, '$1 Créditos'],
        [/^Chapa (\d+) de (\d+)$/, 'Sheet $1 of $2', /^Sheet (\d+) of (\d+)$/, 'Chapa $1 de $2'],
        [/^(\d+) peças alocadas$/, '$1 parts placed', /^(\d+) parts placed$/, '$1 peças alocadas'],
        [/^(\d+) lados \($/, '$1 sides (', /^(\d+) sides \($/, '$1 lados ('],
        [/^Peças do Projeto \((\d+) itens\)$/, 'Project parts ($1 items)', /^Project parts \((\d+) items\)$/, 'Peças do Projeto ($1 itens)'],
        [/^© (\d{4}) CorteFácil Pro • Desenvolvido com inteligência geométrica pelo ecossistema$/, '© $1 CorteFácil Pro • Geometric intelligence by', /^© (\d{4}) CorteFácil Pro • Geometric intelligence by$/, '© $1 CorteFácil Pro • Desenvolvido com inteligência geométrica pelo ecossistema'],
        [/^(\d+) peças importadas da planilha!$/, '$1 parts imported from spreadsheet!', /^(\d+) parts imported from spreadsheet!$/, '$1 peças importadas da planilha!'],
        [/^Otimização concluída!$/, 'Optimization complete!', /^Optimization complete!$/, 'Otimização concluída!'],
        [/^(\d+) Chapas$/, '$1 sheets', /^(\d+) sheets$/, '$1 Chapas'],
        [/^\| Aproveitamento:$/, '| Utilization:', /^\| Utilization:$/, '| Aproveitamento:'],
        [/^\| Desperdício:$/, '| Waste:', /^\| Waste:$/, '| Desperdício:']
    ];
    function normalizeLanguage(value) { return /^en(?:-|$)/i.test(String(value || '')) ? 'en' : 'pt-BR'; }
    function translateText(value, language) {
        const raw = String(value == null ? '' : value), key = normalize(raw), english = normalizeLanguage(language) === 'en';
        if (!key) return raw;
        let result = english ? PT.get(key) : EN.get(key);
        if (result === undefined) {
            for (const [ptRegex, enReplacement, enRegex, ptReplacement] of PATTERNS) {
                const regex = english ? ptRegex : enRegex;
                if (regex.test(key)) { result = key.replace(regex, english ? enReplacement : ptReplacement); break; }
            }
        }
        if (result === undefined) return raw;
        return raw.replace(/\S[\s\S]*\S|\S/, result);
    }
    function createI18n(win) {
        const doc = win.document;
        let storage;
        try { storage = win.localStorage; } catch (_) { storage = { getItem() { return null; }, setItem() {} }; }
        let language = 'pt-BR', observer = null, pending = false, applying = false;
        try { language = normalizeLanguage(storage.getItem('cortefacil_lang') || storage.getItem('4u_lang') || storage.getItem('lang') || doc.documentElement.lang); } catch (_) {}
        const ignored = 'script,style,noscript,textarea,input,code,pre,[data-user-content],[data-i18n-ignore],#ocrPreviewTbody';
        const originals = new WeakMap(), attributes = new WeakMap();
        function isIgnored(element, forAttribute = false) { const selector = forAttribute ? 'script,style,noscript,code,pre,[data-user-content],[data-i18n-ignore],#ocrPreviewTbody' : ignored; return !element || Boolean(element.closest && element.closest(selector)); }
        function translateNode(node) {
            if (isIgnored(node.parentElement)) return;
            const current = node.nodeValue;
            let original = originals.get(node);
            if (!original || (current !== original.pt && current !== original.en)) {
                const pt = translateText(current, 'pt-BR');
                original = { pt, en: translateText(pt, 'en') }; originals.set(node, original);
            }
            const next = language === 'en' ? original.en : original.pt;
            if (current !== next) node.nodeValue = next;
        }
        function translateAttributes(element) {
            if (isIgnored(element, true)) return;
            let records = attributes.get(element);
            if (!records) { records = {}; attributes.set(element, records); }
            for (const attr of ['placeholder', 'title', 'aria-label', 'alt', 'data-label']) {
                if (!element.hasAttribute(attr)) continue;
                const value = element.getAttribute(attr);
                let record = records[attr];
                if (!record || (value !== record.pt && value !== record.en)) {
                    const pt = translateText(value, 'pt-BR'); record = { pt, en: translateText(pt, 'en') }; records[attr] = record;
                }
                const next = language === 'en' ? record.en : record.pt;
                if (value !== next) element.setAttribute(attr, next);
            }
        }
        function observe() {
            if (observer && doc.documentElement) observer.observe(doc.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'title', 'aria-label', 'alt', 'data-label'] });
        }
        function apply(root = doc) {
            if (applying) return;
            applying = true;
            if (observer) observer.disconnect();
            try {
                const start = root.nodeType === 9 ? (root.body || root.documentElement) : root;
                if (!start) return;
                if (start.nodeType === 3) translateNode(start);
                else {
                    if (start.nodeType === 1) translateAttributes(start);
                    const walker = doc.createTreeWalker(start, win.NodeFilter ? win.NodeFilter.SHOW_TEXT : 4);
                    let text;
                    while ((text = walker.nextNode())) translateNode(text);
                    if (start.querySelectorAll) start.querySelectorAll('[placeholder],[title],[aria-label],[alt],[data-label]').forEach(translateAttributes);
                }
                doc.documentElement.lang = language;
                if (doc.querySelectorAll) doc.querySelectorAll('[data-corte-lang]').forEach(button => {
                    const active = normalizeLanguage(button.getAttribute('data-corte-lang')) === language;
                    button.setAttribute('aria-pressed', String(active));
                });
            } finally { applying = false; observe(); }
        }
        function schedule() {
            if (pending || applying) return;
            pending = true;
            Promise.resolve().then(() => { pending = false; apply(); });
        }
        function setLanguage(value, persist = true) {
            const next = normalizeLanguage(value), changed = next !== language;
            language = next;
            if (persist) { try { storage.setItem('cortefacil_lang', language); storage.setItem('4u_lang', language === 'en' ? 'en' : 'pt'); storage.setItem('lang', language === 'en' ? 'en' : 'pt'); } catch (_) {} }
            apply();
            if (changed && win.CustomEvent) win.dispatchEvent(new win.CustomEvent('cortefacil:languagechange', { detail: { language } }));
        }
        function init() {
            apply();
            if (win.MutationObserver) { observer = new win.MutationObserver(schedule); observe(); }
            doc.addEventListener('click', event => {
                const button = event.target && event.target.closest ? event.target.closest('[data-corte-lang]') : null;
                if (button) { event.preventDefault(); setLanguage(button.getAttribute('data-corte-lang')); }
            });
            win.addEventListener('storage', event => { if (['cortefacil_lang', '4u_lang', 'lang'].includes(event.key) && event.newValue) setLanguage(event.newValue, false); });
        }
        const api = { t(pt, en) { return language === 'en' ? (en === undefined ? translateText(pt, 'en') : en) : pt; }, apply, setLanguage, get language() { return language; } };
        if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init, { once: true }); else init();
        return api;
    }
    return { PAIRS, normalizeLanguage, translateText, createI18n };
});
