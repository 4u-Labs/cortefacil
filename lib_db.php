<?php
/**
 * Database Library - Corte Fácil Pro
 * Padrão 4U.IA.BR Premium
 */

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0777, true);
}
$dbPath = $dataDir . '/dados.db';

try {
    $pdo = new PDO("sqlite:$dbPath");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY, 
        is_pro INTEGER DEFAULT 0, 
        bonus_active INTEGER DEFAULT 0,
        credits INTEGER DEFAULT 5,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
    
    // Tabela de Pagamentos
    $pdo->exec("CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        sku TEXT,
        status TEXT,
        amount REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
} catch (PDOException $e) {
    header('Content-Type: application/json');
    die(json_encode(['status' => 'error', 'message' => 'Erro DB: ' . $e->getMessage()]));
}

// Funções Utilitárias
function get_env_var($key, $default = null) {
    $envPath = __DIR__ . '/.env';
    if (file_exists($envPath)) {
        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
                list($name, $value) = explode('=', $line, 2);
                $value = trim($value, " \t\n\r\0\x0B\"'");
                if (trim($name) === $key) return $value;
            }
        }
    }
    return $default;
}

function generate_super_hash($browser_fingerprint) {
    $ip = $_SERVER['REMOTE_ADDR'];
    $salt = get_env_var('ADMIN_PASS', 'Fbr4g4@');
    return substr(hash('sha256', $ip . $browser_fingerprint . $salt), 0, 12);
}

// --- Rotinas de Manutenção (A cada 100 requisições) ---
if (rand(1, 100) === 1) {
    maintenance_routine();
}

function maintenance_routine() {
    global $dbPath, $dataDir;
    
    // 1. Backup Automático (Retenção 3 dias)
    $today = date('Y-m-d');
    $backupFile = $dataDir . "/backup_codes_{$today}.db";
    if (!file_exists($backupFile)) {
        copy($dbPath, $backupFile);
    }
    
    // Limpar backups antigos (> 3 dias)
    $files = glob($dataDir . "/backup_codes_*.db");
    foreach ($files as $file) {
        if (time() - filemtime($file) > 3 * 24 * 60 * 60) {
            @unlink($file);
        }
    }
    
    // 2. Cleanup (Uploads/Temporários > 24h)
    $tempDir = __DIR__ . '/temp';
    if (is_dir($tempDir)) {
        $files = glob($tempDir . "/*");
        foreach ($files as $file) {
            if (time() - filemtime($file) > 24 * 60 * 60) {
                @unlink($file);
            }
        }
    }
}
?>
