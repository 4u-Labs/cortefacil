<?php
/**
 * API Principal - Corte Fácil Pro
 * Padrão 4U.IA.BR Premium — Modo Híbrido (Keep AI + Fingerprint)
 */
include 'lib_db.php';
header('Content-Type: application/json');
session_start();

// --- Rate Limiting ---
if (!isset($_SESSION['req_time'])) {
    $_SESSION['req_time'] = time();
    $_SESSION['req_count'] = 0;
}
if (time() === $_SESSION['req_time']) {
    $_SESSION['req_count']++;
    if ($_SESSION['req_count'] > 20) {
        http_response_code(429);
        die(json_encode(['status' => 'error', 'message' => 'Muitas requisições.']));
    }
} else {
    $_SESSION['req_time'] = time();
    $_SESSION['req_count'] = 1;
}

$action     = $_GET['action'] ?? $_POST['action'] ?? null;
$fingerprint = $_POST['fingerprint'] ?? $_GET['fingerprint'] ?? 'unknown';

// --- Modo Híbrido: Bearer Token Keep AI (opcional) ---
$keepaiUser  = null;
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
            // fallback silencioso para fingerprint
        }
    }
}

// --- Super Hash ID (fingerprint local) ---
$id = generate_super_hash($fingerprint);

switch ($action) {
    case 'check_status':
        try {
            if ($keepaiUser) {
                // Modo Keep AI: retorna saldo unificado
                echo json_encode([
                    'status'  => 'success',
                    'data'    => [
                        'is_pro'       => ($keepaiUser['credits'] >= 9999) ? 1 : 0,
                        'bonus_active' => 0,
                        'credits'      => (int)$keepaiUser['credits'],
                        'email'        => $keepaiUser['email']
                    ],
                    'uid'     => $id,
                    'mode'    => 'keepai'
                ]);
            } else {
                // Modo fingerprint local
                $stmt = $pdo->prepare("SELECT is_pro, bonus_active, credits FROM users WHERE id = :id");
                $stmt->execute(['id' => $id]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                if (!$user) {
                    $stmt = $pdo->prepare("INSERT INTO users (id, credits) VALUES (:id, 5)");
                    $stmt->execute(['id' => $id]);
                    $user = ['is_pro' => 0, 'bonus_active' => 0, 'credits' => 5];
                }
                echo json_encode(['status' => 'success', 'data' => $user, 'uid' => $id, 'mode' => 'local']);
            }
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'use_credit':
        try {
            if ($keepaiUser) {
                // Debitar do keepai.db
                $kpdo->beginTransaction();
                $stmt = $kpdo->prepare("UPDATE users SET credits = MAX(0, credits - 1), updated_at = datetime('now') WHERE id = ?");
                $stmt->execute([$keepaiUser['id']]);

                $stmt2 = $kpdo->prepare("INSERT INTO transactions (user_id, mp_payment_id, package_label, amount_brl, credits_added, status) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt2->execute([
                    $keepaiUser['id'],
                    'CORTE-' . time() . '-' . rand(1000, 9999),
                    'Consumo CorteFácil Pro',
                    0.00,
                    -1,
                    'approved'
                ]);
                $kpdo->commit();

                $stmt3 = $kpdo->prepare("SELECT credits FROM users WHERE id = ?");
                $stmt3->execute([$keepaiUser['id']]);
                $newCredits = (int)$stmt3->fetchColumn();

                echo json_encode(['status' => 'success', 'credits_remaining' => $newCredits]);
            } else {
                // Debitar do dados.db local
                $stmt = $pdo->prepare("UPDATE users SET credits = MAX(0, credits - 1) WHERE id = :id AND is_pro = 0 AND bonus_active = 0");
                $stmt->execute(['id' => $id]);
                echo json_encode(['status' => 'success']);
            }
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'activate_bonus':
        $pass = $_POST['password'] ?? '';
        if ($pass === get_env_var('ADMIN_PASS', 'Fbr4g4@')) {
            if ($keepaiUser) {
                $kpdo->prepare("UPDATE users SET credits = credits + 50, updated_at = datetime('now') WHERE id = ?")
                     ->execute([$keepaiUser['id']]);
            } else {
                $stmt = $pdo->prepare("UPDATE users SET bonus_active = 1, credits = 9999 WHERE id = :id");
                $stmt->execute(['id' => $id]);
            }
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Senha incorreta.']);
        }
        break;

    default:
        echo json_encode(['status' => 'online', 'mcp' => 'ready']);
        break;
}
?>
