<?php
/**
 * Página de Entrada - Corte Fácil Pro
 * Conversão e SEO
 */
$v = time();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CorteFácil Pro - Otimização Profissional de Plano de Corte</title>
    
    <!-- SEO -->
    <meta name="description" content="Otimize seus planos de corte e economize material. Ferramenta profissional para marcenarias e serralherias.">
    <link rel="stylesheet" href="style.css?v=<?php echo $v; ?>">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Orbitron:wght@700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <style>
        .landing-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 40px 20px;
        }
        .hero-title {
            font-size: 3rem;
            margin-bottom: 20px;
            color: #fff;
        }
        .hero-subtitle {
            font-size: 1.2rem;
            color: var(--secondary-color);
            max-width: 600px;
            margin-bottom: 40px;
        }
        .cta-button {
            padding: 18px 40px;
            font-size: 1.2rem;
            text-decoration: none;
            background: var(--primary-color);
            color: #000;
            border-radius: 50px;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 0 20px rgba(80, 250, 123, 0.4);
        }
        .cta-button:hover {
            transform: scale(1.05);
            box-shadow: 0 0 30px rgba(80, 250, 123, 0.6);
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            max-width: 1000px;
            margin-top: 80px;
        }
        .feature-item i {
            font-size: 2.5rem;
            color: var(--primary-color);
            margin-bottom: 15px;
        }
        .feature-item h3 { color: #fff; margin-bottom: 10px; }
    </style>
</head>
<body class="cyber-theme">
    <div class="cyber-bg"></div>
    
    <div class="landing-container">
        <h1 class="hero-title"><i class="fa-solid fa-scissors"></i> Corte<span class="title-highlight">Fácil</span> Pro</h1>
        <p class="hero-subtitle">Mmaximize sua produção e reduza o desperdício de material com o algoritmo mais rápido do mercado.</p>
        
        <a href="index.php" class="cta-button">ABRIR OTIMIZADOR <i class="fa-solid fa-chevron-right"></i></a>
        
        <div class="feature-grid">
            <div class="feature-item glass">
                <i class="fa-solid fa-bolt"></i>
                <h3>Rápido</h3>
                <p>Cálculos instantâneos mesmo para listas complexas de peças.</p>
            </div>
            <div class="feature-item glass">
                <i class="fa-solid fa-leaf"></i>
                <h3>Ecológico</h3>
                <p>Menos desperdício de MDF e material, mais economia para você.</p>
            </div>
            <div class="feature-item glass">
                <i class="fa-solid fa-mobile-screen-button"></i>
                <h3>Mobile First</h3>
                <p>Use diretamente do seu celular na oficina.</p>
            </div>
        </div>
    </div>
</body>
</html>
