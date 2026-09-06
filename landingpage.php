<?php
/**
 * Landing Page - Corte Fácil Pro
 * Padrão Premium 4U.IA.BR
 */
$pageTitle = "CorteFácil Pro - Economia Inteligente";
include 'ui_header.php';
?>

<style>
    .hero { min-height: 80vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
    .hero h1 { font-size: 3rem; margin-bottom: 20px; }
    .hero p { font-size: 1.2rem; color: #ccc; max-width: 600px; margin-bottom: 40px; }
    .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 60px 0; }
    .feature-card { padding: 30px; text-align: center; }
    .feature-card i { font-size: 2.5rem; margin-bottom: 20px; color: var(--primary-color); }
    .feature-card h3 { margin-bottom: 15px; }
</style>

<div class="hero">
    <h1>Corte Inteligente,<br><span class="title-highlight">Desperdício Zero.</span></h1>
    <p>Otimize seus planos de corte de MDF, Alumínio e Vidro em segundos com tecnologia de ponta.</p>
    <a href="index.php" class="control-button optimize" style="font-size: 1.2rem; padding: 15px 40px; border-radius: 30px;">
        COMEÇAR AGORA GRATUITAMENTE
    </a>
</div>

<div class="feature-grid">
    <div class="feature-card glass card">
        <i class="fa-solid fa-bolt"></i>
        <h3>Super Rápido</h3>
        <p>Encontre o melhor encaixe em menos de 1 segundo.</p>
    </div>
    <div class="feature-card glass card">
        <i class="fa-solid fa-leaf"></i>
        <h3>Sustentável</h3>
        <p>Reduza as sobras e economize dinheiro e material.</p>
    </div>
    <div class="feature-card glass card">
        <i class="fa-solid fa-mobile-screen"></i>
        <h3>WebMCP Ready</h3>
        <p>Pronto para dispositivos móveis e agentes de IA.</p>
    </div>
</div>

<?php 
include 'ui_modals.php';
include 'ui_footer.php'; 
?>
