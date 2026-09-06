<?php
/**
 * API Check Payment - Corte Fácil Pro
 * Padrão 4U.IA.BR Premium — Modo Híbrido (Keep AI + Fingerprint)
 */
include 'lib_db.php';
header('Content-Type: application/json');

$fingerprint = $_GET['fingerprint'] ?? 'unknown';
$localUid = generate_super_hash($fingerprint);

$keepaiUser = null;
$bearerToken = null;

$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
if (preg_match('/Bearer\s+(.+)/i', $authHeader, $m)) {
    $bearerToken = trim($m[1]);
}
if (!$bearerToken) {
    $bearerToken = $_GET['keepai_token'] ?? $_POST['keepai_token'] ?? null;
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
            // ignore
        }
    }
}

if ($keepaiUser) {
    // Check in keepai.db
    $stmt = $kpdo->prepare("SELECT * FROM transactions WHERE user_id = ? ORDER BY id DESC LIMIT 1");
    $stmt->execute([$keepaiUser['id']]);
    $transaction = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$transaction) {
        echo json_encode(['status' => 'none']);
    } else {
        echo json_encode(['status' => $transaction['status'], 'label' => $transaction['package_label']]);
    }
} else {
    // Check in local payments
    $stmt = $pdo->prepare("SELECT * FROM payments WHERE user_id = :uid ORDER BY created_at DESC LIMIT 1");
    $stmt->execute(['uid' => $localUid]);
    $payment = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$payment) {
        echo json_encode(['status' => 'none']);
    } else {
        echo json_encode(['status' => $payment['status'], 'sku' => $payment['sku']]);
    }
}
