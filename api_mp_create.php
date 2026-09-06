<?php
/**
 * API Create Payment PIX - Corte Fácil Pro
 * Padrão 4U.IA.BR Premium — Modo Híbrido (Keep AI + Fingerprint)
 */
include 'lib_db.php';
header('Content-Type: application/json');

// --- CORS/Preflight Support ---
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$packageIndex = isset($body['package_index']) ? (int)$body['package_index'] : null;

// Fallback to legacy SKU if sent
if ($packageIndex === null && isset($body['sku'])) {
    $sku = $body['sku'];
    if ($sku === 'starter') $packageIndex = 0;
    else if ($sku === 'pro') $packageIndex = 1;
    else if ($sku === 'unlimited' || $sku === 'gold') $packageIndex = 2;
}

if ($packageIndex === null) {
    $packageIndex = 1; // Default is Prata (50 credits)
}

$packages = [
    0 => ['credits' => 10,  'price' => 4.90,  'label' => 'Bronze — 10 créditos'],
    1 => ['credits' => 50,  'price' => 19.90, 'label' => 'Prata — 50 créditos'],
    2 => ['credits' => 100, 'price' => 34.90, 'label' => 'Ouro — 100 créditos'],
];

if (!isset($packages[$packageIndex])) {
    die(json_encode(['status' => 'error', 'message' => 'Pacote inválido.']));
}

$package = $packages[$packageIndex];
$amountBRL = $package['price'];
$credits = $package['credits'];
$label = $package['label'];

// --- Detect user context ---
$keepaiUser = null;
$bearerToken = null;

$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
if (preg_match('/Bearer\s+(.+)/i', $authHeader, $m)) {
    $bearerToken = trim($m[1]);
}
if (!$bearerToken) {
    $bearerToken = $body['keepai_token'] ?? $_GET['keepai_token'] ?? $_POST['keepai_token'] ?? null;
}

if ($bearerToken) {
    $keepaiDb = __DIR__ . '/../keepai/database/keepai.db';
    if (file_exists($keepaiDb)) {
        try {
            $kpdo = new PDO("sqlite:$keepaiDb");
            $kpdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $stmt = $kpdo->prepare("SELECT * FROM users WHERE token = ?");
            $stmt->execute([$bearerToken]);
            $keepaiUser = $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            // Silently fail to anonymous mode
        }
    }
}

// Fingerprint is always a fallback/local identification
$fingerprint = $body['fingerprint'] ?? $_GET['fingerprint'] ?? 'unknown';
$localUid = generate_super_hash($fingerprint);

$mpToken = get_env_var('MP_ACCESS_TOKEN');
if (!$mpToken) {
    // If not in local .env, try loading from Keep AI config
    $keepaiConfig = __DIR__ . '/../keepai/api/config.php';
    if (file_exists($keepaiConfig)) {
        $configContent = file_get_contents($keepaiConfig);
        if (preg_match("/define\('MP_ACCESS_TOKEN',\s*'([^']+)'\)/", $configContent, $matches)) {
            $mpToken = $matches[1];
        }
    }
}

if (!$mpToken) {
    die(json_encode(['status' => 'error', 'message' => 'Token do MP não configurado no .env']));
}

// Set up identification reference for webhook
if ($keepaiUser) {
    $extRef = "keepai:" . $keepaiUser['id'] . ":" . $packageIndex;
    $payerEmail = $keepaiUser['email'] ?: 'comprador@keepai.app';
} else {
    $extRef = "local:" . $fingerprint . ":" . $packageIndex;
    $payerEmail = 'comprador@keepai.app';
}

$mpPayload = [
    'transaction_amount'  => (float)$amountBRL,
    'description'         => "CorteFácil Pro — {$label}",
    'payment_method_id'   => 'pix',
    'external_reference'  => $extRef,
    'notification_url'    => "https://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) . "/api_mp_webhook.php",
    'payer' => [
        'email'           => $payerEmail,
        'first_name'      => 'Cliente',
        'last_name'       => 'CorteFácil',
        'identification'  => ['type' => 'CPF', 'number' => '00000000000'],
    ],
    'metadata' => [
        'credits'         => $credits,
        'package_label'   => $label,
        'is_hybrid'       => true,
    ],
];

$ch = curl_init('https://api.mercadopago.com/v1/payments');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($mpPayload),
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $mpToken,
        'X-Idempotency-Key: cortefacil-' . ($keepaiUser ? 'k' . $keepaiUser['id'] : 'l' . $localUid) . '-' . time(),
    ],
    CURLOPT_TIMEOUT        => 20,
    CURLOPT_SSL_VERIFYPEER => false,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 201) {
    $err = json_decode($response, true);
    die(json_encode([
        'status' => 'error',
        'message' => 'Erro ao gerar PIX: ' . ($err['message'] ?? 'Tente novamente.'),
        'debug' => $err
    ]));
}

$mpData     = json_decode($response, true);
$paymentId  = $mpData['id'];
$pixQrCode  = $mpData['point_of_interaction']['transaction_data']['qr_code'] ?? '';
$pixQrB64   = $mpData['point_of_interaction']['transaction_data']['qr_code_base64'] ?? '';
$expiresAt  = $mpData['date_of_expiration'] ?? '';

// Save pending transaction local
try {
    $stmt = $pdo->prepare('INSERT OR IGNORE INTO payments (id, user_id, sku, status, amount) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([(string)$paymentId, $localUid, "pkg_" . $packageIndex, 'pending', $amountBRL]);
} catch (Exception $e) {
    // Silently ignore or log db insertion error
}

// If it's a Keep AI user, also log a pending transaction in keepai.db
if ($keepaiUser && isset($kpdo)) {
    try {
        $stmt = $kpdo->prepare('INSERT OR IGNORE INTO transactions (user_id, mp_payment_id, package_label, amount_brl, credits_added, status) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([$keepaiUser['id'], (string)$paymentId, $label, $amountBRL, $credits, 'pending']);
    } catch (Exception $e) {
        // Ignore
    }
}

echo json_encode([
    'status'         => 'success',
    'payment_id'     => $paymentId,
    'qr_code'        => $pixQrCode,
    'qr_code_base64' => $pixQrB64,
    'amount_brl'     => $amountBRL,
    'credits'        => $credits,
    'label'          => $label,
    'expires_at'     => $expiresAt,
]);
