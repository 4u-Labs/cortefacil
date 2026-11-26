<?php
/**
 * UI Header - Corte Fácil Pro
 * Padrão 4U.IA.BR Premium
 */
$v = filemtime(__DIR__ . '/style.css');
$workspacePage = basename($_SERVER['SCRIPT_NAME'] ?? 'index.php') === 'index.php';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title><?php echo $pageTitle ?? 'CorteFácil Pro - Otimizador 2D'; ?></title>

    <!-- PWA & SEO -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=20261120-2">
    <link rel="icon" type="image/x-icon" href="/favicon.ico?v=20261120-2">
    <link href="manifest.json" rel="manifest"/>
    <link rel="canonical" href="https://4u.ia.br/app/cortefacil/">
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
    <?php if ($workspacePage): ?><link href="workspace.css?v=<?php echo filemtime(__DIR__ . '/workspace.css'); ?>" rel="stylesheet"><?php endif; ?>
</head>
<body class="cyber-theme<?php echo $workspacePage ? ' workspace-page' : ''; ?>">
    <div class="cyber-bg"></div>
    <div class="main-content">
        <div class="container <?php echo $workspacePage ? 'workspace-shell' : 'glass'; ?>">
            <header class="main-header">
                <div class="workspace-brand"><h1 id="mainLogo" title="Clique 5 vezes para acesso bônus"><i class="fa-solid fa-scissors" aria-hidden="true"></i> Corte<span class="title-highlight">Fácil</span> <span class="pro-edition">Pro</span></h1><p class="workspace-tagline">Plano de corte e aproveitamento de chapas</p></div>
                <div class="header-controls">
                    <div id="creditDisplay" class="credit-badge" title="Saldo de otimizações"><i class="fa-solid fa-gem" aria-hidden="true"></i> <span id="creditBalance">...</span><button id="topUpBtn" class="topup-btn" type="button" title="Comprar créditos" aria-label="Comprar créditos"><i class="fa-solid fa-plus-circle" aria-hidden="true"></i></button></div>
                    <span class="save-status unsaved" id="saveStatus" role="status"><i class="fa-regular fa-floppy-disk" aria-hidden="true"></i> Projeto local</span>
                    <nav class="nav-links-modular" aria-label="Ações do aplicativo">
                        <button type="button" class="control-button secondary small-btn" id="installAppButton"><i class="fa-solid fa-download" aria-hidden="true"></i> <span>Instalar</span></button>
                        <a class="control-button secondary small-btn" href="tutorial.php" title="Central de ajuda"><i class="fa-regular fa-circle-question" aria-hidden="true"></i><span>Ajuda</span></a>
                        <a class="control-button secondary small-btn support-link" href="https://www.paypal.com/ncp/payment/L7YRCS984T33N" target="_blank" rel="noopener noreferrer"><i class="fa-regular fa-heart" aria-hidden="true"></i><span>Apoiar</span></a>
                    </nav>
                    <div class="corte-language" role="group" aria-label="Idioma / Language"><button type="button" data-corte-lang="pt-BR" aria-pressed="true" lang="pt-BR">PT</button><span aria-hidden="true">|</span><button type="button" data-corte-lang="en" aria-pressed="false" lang="en">EN</button></div>
                </div>
            </header>
