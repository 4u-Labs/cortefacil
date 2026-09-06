<?php
/**
 * API Vision OCR - Leitor de Rascunhos e Listas de Peças
 * Corte Fácil Pro — Padrão 4U.IA.BR Premium
 */
include 'lib_db.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método não permitido. Utilize POST.']);
    exit;
}

// 1. Obter API Key da OpenAI
$apiKey = get_env_var('OPENAI_API_KEY');
if (empty($apiKey) || $apiKey === 'sua_chave_aqui') {
    echo json_encode(['status' => 'error', 'message' => 'Chave de API OpenAI não configurada no .env']);
    exit;
}

// 2. Extrair imagem (Multipart file ou Base64 JSON)
$imageBase64 = null;
$mimeType = 'image/jpeg';
$unitOverride = 'auto'; // auto, mm, cm, m
$customInstructions = '';

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (stripos($contentType, 'application/json') !== false) {
    $rawInput = file_get_contents('php://input');
    $inputData = json_decode($rawInput, true) ?? [];
    
    if (!empty($inputData['image'])) {
        $imgRaw = $inputData['image'];
        if (preg_match('/^data:(image\/[a-zA-Z0-9+]+);base64,(.+)$/', $imgRaw, $matches)) {
            $mimeType = $matches[1];
            $imageBase64 = $matches[2];
        } else {
            $imageBase64 = $imgRaw;
        }
    }
    $unitOverride = $inputData['unit'] ?? 'auto';
    $customInstructions = trim($inputData['instructions'] ?? '');
} else {
    // Form data / Multipart
    $unitOverride = $_POST['unit'] ?? 'auto';
    $customInstructions = trim($_POST['instructions'] ?? '');

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $tmpName = $_FILES['image']['tmp_name'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $detectedMime = finfo_file($finfo, $tmpName);
        finfo_close($finfo);
        
        if (strpos($detectedMime, 'image/') === 0) {
            $mimeType = $detectedMime;
            $fileData = file_get_contents($tmpName);
            $imageBase64 = base64_encode($fileData);
        }
    } else if (!empty($_POST['image'])) {
        $imgRaw = $_POST['image'];
        if (preg_match('/^data:(image\/[a-zA-Z0-9+]+);base64,(.+)$/', $imgRaw, $matches)) {
            $mimeType = $matches[1];
            $imageBase64 = $matches[2];
        } else {
            $imageBase64 = $imgRaw;
        }
    }
}

if (!$imageBase64) {
    echo json_encode(['status' => 'error', 'message' => 'Nenhuma imagem enviada ou formato inválido. Envie uma foto do rascunho.']);
    exit;
}

// 3. Instruções e Prompt do Sistema
$systemPrompt = <<<PROMPT
Você é o motor de Visão Computacional e OCR especializado do "Corte Fácil Pro", um software de otimização de planos de corte de chapas planas (Madeira/MDF, Vidro, Aço/Metal, Acrílico, Granito).
Sua tarefa é analisar a imagem fornecida (foto de caderno, rascunho desenhado à mão, croqui com cotas e setas, lista digitada, nota de encomenda ou print) e extrair com precisão a lista de peças a serem cortadas e, se presente, as dimensões da chapa bruta.

DIRETRIZES DE RECONHECIMENTO E CONVERSÃO:
1. UNIDADES DE MEDIDA:
   - Todas as medidas finais retornadas DEVEM ESTAR EM MILÍMETROS (mm).
   - Se o rascunho estiver em centímetros (ex: "70x45", "120 x 60", "200"), converta para milímetros ("700 x 450", "1200 x 600", "2000").
   - Se estiver em metros (ex: "1.20 x 0.60" ou "2,75 x 1,83"), converta para milímetros ("1200 x 600", "2750 x 1830").
   - Se já estiver em mm (ex: "700 x 450", "2750 x 1830"), mantenha.
   - Se o usuário especificou a unidade na requisição (ex: 'cm' ou 'mm'), respeite rigorosamente essa unidade base.

2. ATRIBUTOS DAS PEÇAS:
   - "name": Nome ou descrição da peça (ex: "Porta", "Lateral", "Prateleira", "Tampo", "Fundo", "Vidro Fixo", "Chapa Base"). Se não tiver nome, use "Peça 1", "Peça 2", etc.
   - "length": Comprimento / Maior dimensão em mm (número inteiro positivo).
   - "width": Largura / Menor dimensão em mm (número inteiro positivo).
   - "quantity": Quantidade de peças idênticas (ex: "2x", "4 pçs", "3 un" -> quantidade numérica inteira >= 1). Padrão: 1.
   - "canRotate": Booleano (true ou false). Se o rascunho indicar que a peça pode girar ou se não houver restrição de veio, coloque true. Se indicar "veio", "sentido do veio", "não girar" ou "grão vertical", coloque false.
   - "edgeBanding": Objeto com os lados que recebem fita de borda (top, bottom, left, right):
     * "1C" ou "1 Comp" -> top: true, bottom: false, left: false, right: false
     * "2C" ou "2 Comp" -> top: true, bottom: true, left: false, right: false
     * "1L" ou "1 Larg" -> top: false, bottom: false, left: true, right: false
     * "2L" ou "2 Larg" -> top: false, bottom: false, left: true, right: true
     * "4L", "Todos", "4 lados", "total" -> top: true, bottom: true, left: true, right: true
     * "1C1L" -> top: true, bottom: false, left: true, right: false
     * "2C1L" -> top: true, bottom: true, left: true, right: false
     * Se nada for informado sobre fita de borda, todos são false.

3. DIMENSÕES DA CHAPA BRUTA (se identificada):
   - Se houver menção ao tamanho da chapa bruta/placa (ex: "Chapa 2750x1830", "Chapa 2,75 x 1,83", "Chapa 3000x1200", "Chapa MDF 15mm"), retorne em "sheet_detected" com length, width, thickness (se houver) e material. Caso contrário, deixe como null.

4. FORMATO DA RESPOSTA:
   - Retorne EXCLUSIVAMENTE um objeto JSON válido no seguinte formato exato (sem texto livre fora do JSON):
{
  "status": "success",
  "sheet_detected": {
    "length": 2750,
    "width": 1830,
    "thickness": 15,
    "material": "MDF Branco TX"
  },
  "unit_applied": "mm",
  "pieces": [
    {
      "name": "Lateral Direita",
      "length": 2000,
      "width": 550,
      "quantity": 2,
      "canRotate": true,
      "edgeBanding": {
        "top": true,
        "bottom": false,
        "left": false,
        "right": false
      }
    }
  ],
  "notes": "Resumo em 1 ou 2 frases amigáveis em português do que foi identificado e se alguma conversão de unidade foi aplicada."
}
PROMPT;

$userPromptText = "Analise este rascunho/lista de corte. Unidade informada pelo usuário: [{$unitOverride}].";
if (!empty($customInstructions)) {
    $userPromptText .= "\nInstruções extras do operador: " . $customInstructions;
}

// 4. Montar Payload Vision para OpenAI
$dataPayload = [
    'model' => 'gpt-4o-mini',
    'messages' => [
        [
            'role' => 'system',
            'content' => $systemPrompt
        ],
        [
            'role' => 'user',
            'content' => [
                [
                    'type' => 'text',
                    'text' => $userPromptText
                ],
                [
                    'type' => 'image_url',
                    'image_url' => [
                        'url' => "data:{$mimeType};base64,{$imageBase64}",
                        'detail' => 'high'
                    ]
                ]
            ]
        ]
    ],
    'temperature' => 0.1,
    'max_tokens' => 3000,
    'response_format' => ['type' => 'json_object']
];

// 5. Executar requisição cURL
$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey
    ],
    CURLOPT_POSTFIELDS => json_encode($dataPayload),
    CURLOPT_TIMEOUT => 45,
    CURLOPT_SSL_VERIFYPEER => true
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr = curl_error($ch);
curl_close($ch);

if ($curlErr) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Falha de comunicação com a IA: ' . $curlErr
    ]);
    exit;
}

if ($httpCode !== 200) {
    $errObj = json_decode($response, true);
    $errMsg = $errObj['error']['message'] ?? "Erro HTTP {$httpCode} na API OpenAI";
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro ao processar imagem com IA: ' . $errMsg
    ]);
    exit;
}

$resData = json_decode($response, true);
$rawContent = $resData['choices'][0]['message']['content'] ?? '{}';
$parsedJson = json_decode($rawContent, true);

if (!$parsedJson || !isset($parsedJson['pieces'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'A IA não conseguiu identificar peças válidas nesta imagem. Tente uma foto mais nítida ou com melhor iluminação.',
        'raw' => $rawContent
    ]);
    exit;
}

// Higienização e sanitização dos dados
$sanitizedPieces = [];
foreach ($parsedJson['pieces'] as $idx => $p) {
    $length = (int)($p['length'] ?? 0);
    $width = (int)($p['width'] ?? 0);
    $qty = max(1, (int)($p['quantity'] ?? 1));
    $name = trim($p['name'] ?? ("Peça " . ($idx + 1)));
    $canRotate = !empty($p['canRotate']);
    
    $eb = $p['edgeBanding'] ?? [];
    $edgeBanding = [
        'top' => !empty($eb['top']),
        'bottom' => !empty($eb['bottom']),
        'left' => !empty($eb['left']),
        'right' => !empty($eb['right'])
    ];

    if ($length > 0 && $width > 0) {
        $sanitizedPieces[] = [
            'id' => 'p_ocr_' . ($idx + 1) . '_' . time(),
            'name' => $name,
            'length' => max($length, $width), // Padroniza maior como comprimento
            'width' => min($length, $width),  // Menor como largura
            'quantity' => $qty,
            'canRotate' => $canRotate,
            'edgeBanding' => $edgeBanding
        ];
    }
}

if (empty($sanitizedPieces)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Nenhuma medida com dimensões válidas foi encontrada no rascunho.',
        'notes' => $parsedJson['notes'] ?? ''
    ]);
    exit;
}

echo json_encode([
    'status' => 'success',
    'pieces' => $sanitizedPieces,
    'sheet_detected' => $parsedJson['sheet_detected'] ?? null,
    'unit_applied' => $parsedJson['unit_applied'] ?? 'mm',
    'notes' => $parsedJson['notes'] ?? ('Identificadas ' . count($sanitizedPieces) . ' peças com sucesso.')
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
