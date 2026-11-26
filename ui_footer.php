<?php
/**
 * UI Footer - Corte Fácil Pro
 * Padrão 4U.IA.BR Premium
 */
?>
        </div> <!-- Fim .container -->
    </div> <!-- Fim .main-content -->

    <footer class="footer-clean">
        <div class="footer-links-row">
            <a href="tutorial.php" class="footer-link">Ajuda do Corte Fácil</a>
            <a href="#" id="openPrivacyModal" class="footer-link">Privacidade</a>
            <a href="#" id="openTermsModal" class="footer-link">Termos</a>
            <a href="https://www.paypal.com/ncp/payment/L7YRCS984T33N" target="_blank" rel="noopener noreferrer" class="footer-link">Apoiar o projeto</a>
        </div>
        <details class="ecosystem-links"><summary>4u-Labs — Aplicativos, suporte e comunidade</summary><nav aria-label="Links oficiais 4u-Labs">
            <a href="https://4u.ia.br/" target="_blank" rel="noopener noreferrer">Portal 4U</a>
            <a href="https://4u.ia.br/loja/index.php" target="_blank" rel="noopener noreferrer">Loja de Apps</a>
            <a href="https://4u.ia.br/suporte.html" target="_blank" rel="noopener noreferrer">Central de Ajuda</a>
            <a href="https://4u.ia.br/sobre.html" target="_blank" rel="noopener noreferrer">Sobre 4U</a>
            <a href="https://4u.ia.br/termos.html" target="_blank" rel="noopener noreferrer">Termos 4U</a>
            <a href="https://4u.ia.br/politica.html" target="_blank" rel="noopener noreferrer">Privacidade 4U</a>
            <a href="https://github.com/4u-Labs" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://4u-labs.github.io/" target="_blank" rel="noopener noreferrer">Blog Dev</a>
            <a href="https://alternativeto.net/user/4u-ia-br/added/" target="_blank" rel="noopener noreferrer">AlternativeTo</a>
            <a href="https://www.youtube.com/@fbr4g4" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href="https://www.instagram.com/fbr4g4/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.facebook.com/fbr4g4/" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://x.com/fbr4g4" target="_blank" rel="noopener noreferrer">X / Twitter</a>
            <a href="https://www.linkedin.com/in/fbr4g4/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </nav></details>
        <span>© <?php echo date('Y'); ?> CorteFácil · <a href="https://4u.ia.br/" target="_blank" rel="noopener noreferrer">4u-Labs</a></span>
    </footer>

    <!-- Banner de Instalação PWA Inteligente -->
    <div id="installBanner" class="install-banner glass cyber-border" style="display: none;">
        <div class="install-content">
            <div class="install-icon">
                <img src="images/icon-192.png" alt="App Icon">
            </div>
            <div class="install-text">
                <strong>CorteFácil Pro no seu Celular!</strong>
                <p>Use offline e acesse mais rápido.</p>
            </div>
        </div>
        <div class="install-actions">
            <button id="btnNotNow" class="close-payment" style="margin-top:0; text-decoration:none;">Agora não</button>
            <button id="btnInstall" class="control-button optimize small-btn">INSTALAR APP</button>
        </div>
    </div>

    <!-- Toasts (Feedback) -->
    <div id="toastContainer"></div>

    <script src="i18n.js?v=<?php echo filemtime(__DIR__ . '/i18n.js'); ?>"></script>
    <script src="workspace-core.js?v=<?php echo filemtime(__DIR__ . '/workspace-core.js'); ?>"></script>
    <script src="optimizer.js?v=<?php echo filemtime(__DIR__ . '/optimizer.js'); ?>"></script>
    <script src="script.js?v=<?php echo filemtime(__DIR__ . '/script.js'); ?>"></script>
    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' });
        }
    </script>
</body>
</html>
