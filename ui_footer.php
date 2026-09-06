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
            <a href="https://4u.ia.br" target="_blank" rel="noopener noreferrer" class="footer-link highlight">
                <i class="fa-solid fa-cube"></i> 4u.ia.br
            </a>
            <span style="color: rgba(255,255,255,0.2);">•</span>
            <a href="https://github.com/4u-Labs" target="_blank" rel="noopener noreferrer" class="footer-link">
                <i class="fa-brands fa-github"></i> GitHub @4u-Labs
            </a>
            <span style="color: rgba(255,255,255,0.2);">•</span>
            <a href="tutorial.php" class="footer-link">
                <i class="fa-solid fa-circle-question"></i> Central de Ajuda
            </a>
            <span style="color: rgba(255,255,255,0.2);">•</span>
            <a href="#" id="openPrivacyModal" class="footer-link">
                <i class="fa-solid fa-shield-halved"></i> Privacidade
            </a>
            <span style="color: rgba(255,255,255,0.2);">•</span>
            <a href="#" id="openTermsModal" class="footer-link">
                <i class="fa-solid fa-file-contract"></i> Termos
            </a>
        </div>
        <span>© 2026 CorteFácil Pro • Desenvolvido com inteligência geométrica pelo ecossistema <a href="https://4u.ia.br" target="_blank" rel="noopener noreferrer" style="color: var(--primary-color); text-decoration: none; font-weight: 600;">4u.ia.br</a></span>
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

    <script src="script.js?v=<?php echo filemtime('script.js'); ?>"></script>
    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js');
        }
    </script>
</body>
</html>
