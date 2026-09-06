<?php
/**
 * UI Header - Corte Fácil Pro
 * Padrão 4U.IA.BR Premium
 */
$v = file_exists('style.css') ? filemtime('style.css') : time();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title><?php echo $pageTitle ?? 'CorteFácil Pro - Otimizador 2D'; ?></title>
    
    <!-- PWA & SEO -->
    <link href="images/icon-192.png" rel="icon" sizes="192x192" type="image/png"/>
    <link href="images/icon-512.png" rel="icon" sizes="512x512" type="image/png"/>
    <link href="manifest.json" rel="manifest"/>
    <meta name="description" content="O melhor otimizador de plano de corte 2D para marcenaria e serralheria. Economize material com o CorteFácil Pro.">
    
    <!-- OpenGraph / Social -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="CorteFácil Pro Edition - Otimização Inteligente">
    <meta property="og:description" content="Economize até 30% de material nos seus planos de corte. Rápido, preciso e profissional.">
    <meta property="og:image" content="images/icon-512.png">
    
    <!-- WebMCP Ready (GEO Optimization) -->
    <meta name="ai-service" content="2D Cutting Optimization">
    <meta name="ai-endpoint" content="api.php">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Orbitron:wght@400..900&display=swap" rel="stylesheet">
    
    <!-- Libs -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
    <!-- Estilos -->
    <link href="style.css?v=<?php echo $v; ?>" rel="stylesheet"/>
</head>
<body class="cyber-theme">
    <div class="cyber-bg"></div>
    <div class="main-content">
        <div class="container glass">
            <!-- Cabeçalho -->
            <div class="main-header">
                <h1 id="mainLogo" title="Clique 5 vezes para acesso bônus">
                    <i class="fa-solid fa-scissors"></i> Corte<span class="title-highlight">Fácil</span> 
                    <span class="pro-edition">Pro Edition</span>
                </h1>
                <div class="header-controls">
                    <div id="creditDisplay" class="credit-badge glass" title="Saldo de Otimizações">
                        <i class="fa-solid fa-gem" style="color: #00e5ff;"></i> 
                        <span id="creditBalance">...</span>
                        <button id="topUpBtn" class="topup-btn" title="Comprar Créditos">
                            <i class="fa-solid fa-plus-circle"></i>
                        </button>
                    </div>
                    <span class="save-status unsaved" id="saveStatus"><i class="fa-regular fa-floppy-disk"></i> Sincronizando...</span>
                    <!-- Links de Navegação -->
                    <div class="nav-links-modular">
                        <a class="control-button secondary small-btn" href="index.php">
                            <i class="fa-solid fa-calculator"></i>
                            <span class="btn-text">App</span>
                        </a>
                        <a class="control-button secondary small-btn" href="tutorial.php">
                            <i class="fa-solid fa-circle-question"></i>
                            <span class="btn-text">Ajuda</span>
                        </a>
                    </div>
                </div>
            </div>
