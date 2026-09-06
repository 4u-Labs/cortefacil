<?php
/**
 * API Webhook Mercado Pago - Corte Fácil Pro
 * Padrão 4U.IA.BR Premium — Modo Híbrido (Keep AI + Fingerprint)
 */
include 'lib_db.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (isset($data['type']) && $data['type'] === 'payment') {
    $payment_id = $data['data']['id'];
    $mpToken = get_env_var('MP_ACCESS_TOKEN');
    if (!$mpToken) {
        // Fallback to Keep AI config to fetch the MP Access Token
        $keepaiConfig = __DIR__ . '/../keepai/api/config.php';
        if (file_exists($keepaiConfig)) {
            $configContent = file_get_contents($keepaiConfig);
            if (preg_match("/define\('MP_ACCESS_TOKEN',\s*'([^']+)'\)/", $configContent, $matches)) {
                $mpToken = $matches[1];
            }
        }
    }

    if ($mpToken) {
        // Consulta detalhes do pagamento na API do Mercado Pago
        $ch = curl_init("https://api.mercadopago.com/v1/payments/$payment_id");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $mpToken"]);
        $response = curl_exec($ch);
        $payment_info = json_decode($response, true);
        curl_close($ch);

        if (isset($payment_info['status']) && $payment_info['status'] === 'approved') {
            $ext_ref = $payment_info['external_reference'] ?? ''; 
            
            // Check if format is keepai:{user_id}:{package_index} or local:{fingerprint}:{package_index}
            $parts = explode(':', $ext_ref);
            
            if (count($parts) >= 3) {
                $mode = $parts[0];
                $identifier = $parts[1];
                $packageIndex = (int)$parts[2];
                
                $packages = [
                    0 => ['credits' => 10,  'label' => 'Bronze — 10 créditos'],
                    1 => ['credits' => 50,  'label' => 'Prata — 50 créditos'],
                    2 => ['credits' => 100, 'label' => 'Ouro — 100 créditos'],
                ];
                
                $credits = isset($packages[$packageIndex]) ? $packages[$packageIndex]['credits'] : 0;
                $label = isset($packages[$packageIndex]) ? $packages[$packageIndex]['label'] : 'Recarga PIX';
                $amountBRL = (float)($payment_info['transaction_amount'] ?? 0);
                
                if ($mode === 'keepai') {
                    // Update keepai.db
                    $keepaiDb = __DIR__ . '/../keepai/database/keepai.db';
                    if (file_exists($keepaiDb)) {
                        try {
                            $kpdo = new PDO("sqlite:$keepaiDb");
                            $kpdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                            
                            $kpdo->beginTransaction();
                            
                            // Check if transaction was already processed
                            $checkStmt = $kpdo->prepare('SELECT status FROM transactions WHERE mp_payment_id = ?');
                            $checkStmt->execute([(string)$payment_id]);
                            $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);
                            
                            if ($existing && $existing['status'] === 'approved') {
                                // Already processed
                                $kpdo->rollBack();
                            } else {
                                // Add credits to keepai user
                                $stmt = $kpdo->prepare('UPDATE users SET credits = credits + ?, updated_at = datetime("now") WHERE id = ?');
                                $stmt->execute([$credits, $identifier]);
                                
                                // Update or insert transaction
                                if ($existing) {
                                    $stmt = $kpdo->prepare('UPDATE transactions SET status = "approved", credits_added = ?, amount_brl = ? WHERE mp_payment_id = ?');
                                    $stmt->execute([$credits, $amountBRL, (string)$payment_id]);
                                } else {
                                    $stmt = $kpdo->prepare('INSERT INTO transactions (user_id, mp_payment_id, package_label, amount_brl, credits_added, status) VALUES (?, ?, ?, ?, ?, "approved")');
                                    $stmt->execute([$identifier, (string)$payment_id, $label, $amountBRL, $credits]);
                                }
                                $kpdo->commit();
                                file_put_contents('api_logs.txt', date('Y-m-d H:i:s') . " - Keep AI Pago Approved: User $identifier - Pack $packageIndex ($credits credits)\n", FILE_APPEND);
                            }
                        } catch (Exception $e) {
                            if (isset($kpdo) && $kpdo->inTransaction()) $kpdo->rollBack();
                            file_put_contents('api_logs.txt', date('Y-m-d H:i:s') . " - Error Keep AI Webhook: " . $e->getMessage() . "\n", FILE_APPEND);
                        }
                    }
                } else if ($mode === 'local') {
                    // Local anonymous fingerprint mode
                    $id = generate_super_hash($identifier);
                    
                    $pdo->beginTransaction();
                    try {
                        // Check if payment was already processed
                        $checkStmt = $pdo->prepare('SELECT status FROM payments WHERE id = ?');
                        $checkStmt->execute([(string)$payment_id]);
                        $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);
                        
                        if ($existing && $existing['status'] === 'approved') {
                            $pdo->rollBack();
                        } else {
                            // Update local users credits
                            $stmt = $pdo->prepare("INSERT INTO users (id, credits, is_pro) VALUES (:id, :c, 0) 
                                                   ON CONFLICT(id) DO UPDATE SET credits = credits + :c2");
                            $stmt->execute(['id' => $id, 'c' => $credits, 'c2' => $credits]);
                            
                            // Insert or update payment status
                            if ($existing) {
                                $stmt = $pdo->prepare("UPDATE payments SET status = 'approved', amount = :amt WHERE id = :pid");
                                $stmt->execute(['amt' => $amountBRL, 'pid' => (string)$payment_id]);
                            } else {
                                $stmt = $pdo->prepare("INSERT INTO payments (id, user_id, sku, status, amount) VALUES (:pid, :uid, :sku, 'approved', :amt)");
                                $stmt->execute(['pid' => (string)$payment_id, 'uid' => $id, 'sku' => "pkg_" . $packageIndex, 'amt' => $amountBRL]);
                            }
                            $pdo->commit();
                            file_put_contents('api_logs.txt', date('Y-m-d H:i:s') . " - Local Pago Approved: Fingerprint $identifier ($id) - Pack $packageIndex ($credits credits)\n", FILE_APPEND);
                        }
                    } catch (Exception $e) {
                        $pdo->rollBack();
                        file_put_contents('api_logs.txt', date('Y-m-d H:i:s') . " - Error Local Webhook: " . $e->getMessage() . "\n", FILE_APPEND);
                    }
                }
            } else {
                // Fallback support for old external_reference style (fingerprint|sku) just in case
                $parts_old = explode('|', $ext_ref);
                if (count($parts_old) === 2) {
                    list($fingerprint, $sku) = $parts_old;
                    $id = generate_super_hash($fingerprint);
                    
                    $credits = 0;
                    $is_pro = 0;
                    if ($sku === 'starter') $credits = 20;
                    else if ($sku === 'pro') $credits = 60;
                    else if ($sku === 'unlimited') $is_pro = 1;
                    
                    $amountBRL = (float)($payment_info['transaction_amount'] ?? 0);
                    
                    $pdo->beginTransaction();
                    try {
                        $stmt = $pdo->prepare("INSERT INTO users (id, credits, is_pro) VALUES (:id, :c, :p) 
                                               ON CONFLICT(id) DO UPDATE SET credits = credits + :c2, is_pro = MAX(is_pro, :p2)");
                        $stmt->execute(['id' => $id, 'c' => $credits, 'p' => $is_pro, 'c2' => $credits, 'p2' => $is_pro]);
                        
                        $stmt = $pdo->prepare("INSERT OR REPLACE INTO payments (id, user_id, sku, status, amount) VALUES (:pid, :uid, :sku, 'approved', :amt)");
                        $stmt->execute(['pid' => (string)$payment_id, 'uid' => $id, 'sku' => $sku, 'amt' => $amountBRL]);
                        
                        $pdo->commit();
                        file_put_contents('api_logs.txt', date('Y-m-d H:i:s') . " - Old Ref Approved: $id - $sku\n", FILE_APPEND);
                    } catch (Exception $e) {
                        $pdo->rollBack();
                        file_put_contents('api_logs.txt', date('Y-m-d H:i:s') . " - Error Old Webhook: " . $e->getMessage() . "\n", FILE_APPEND);
                    }
                }
            }
        }
    }
}

http_response_code(200);
echo "OK";
