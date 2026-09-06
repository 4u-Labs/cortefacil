<div align="center">

# 🪚 CorteFácil Pro
### **Otimizador 2D de Planos de Corte Universal & Leitor de Rascunhos com IA**

<p align="center">
  <a href="https://4u.ia.br/app/cortefacil/"><img src="https://img.shields.io/badge/🌐_Acessar_App_Online-4U.IA.BR-00e5ff?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Acessar App Online" /></a>
  <a href="https://orcid.org/0009-0004-5936-5060"><img src="https://img.shields.io/badge/ORCID-0009--0004--5936--5060-A6CE39?style=for-the-badge&logo=orcid&logoColor=white" alt="ORCID iD" /></a>
  <img src="https://img.shields.io/badge/PHP-8.x-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP 8" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/AI-OpenAI_GPT--4o_Vision-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI Vision" />
  <img src="https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA" />
</p>

<!-- Typing SVG Animation -->
<p align="center">
  <a href="https://4u.ia.br/app/cortefacil/">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&duration=2800&pause=900&color=50FA7B&center=true&vCenter=true&width=750&lines=Economize+at%C3%A9+30%25+de+material+em+seus+planos+de+corte...;Leitor+de+Rascunhos+e+Listas+Manuscritas+com+IA+(Vision+OCR)...;Suporte+Universal%3A+MDF%2C+Compensado%2C+Vidro%2C+A%C3%A7o+e+Acr%C3%ADlico...;Ordem+de+Servi%C3%A7o+A4+para+Oficina+%26+PIX+Autom%C3%A1tico." alt="Typing SVG" />
  </a>
</p>

</div>

---

## 🌟 Principais Recursos

### 🧠 1. Leitor de Rascunhos & Listas com IA (Vision OCR Pro)
- Tire uma foto do caderno de anotações na bancada, use o visor da **câmera ao vivo (WebRTC)** ou cole um print com **Ctrl + V**.
- A IA extrai automaticamente **Comprimento**, **Largura**, **Quantidade**, **Sentido de Rotação** e **Fitas de Borda** (1C, 2C, 4L).
- Conversão inteligente de unidades (`mm`, `cm`, `m`).
- Tabela interativa de conferência com opção de *Adicionar à Lista Atual* ou *Substituir Lista*.

### 🪵 2. Motor Multi-Material Universal 2D
- **Madeira / MDF / MDP / Compensado**: Controle de veio da madeira, serra (kerf) e fitas de borda.
- **Vidro / Espelho**: Algoritmo de corte linear de ponta a ponta (Guilhotina 2D).
- **Metal / Aço / Alumínio**: Otimização para corte a Laser, Plasma e Puncionadeira (MaxRects).
- **Acrílico / ACM / Plásticos**: Configuração personalizada de folgas e refilos.

### 📐 3. Algoritmos de Corte Avançados
- **Automático Multi-Heurístico**: Testa múltiplos arranjos e seleciona automaticamente o menor desperdício.
- **Guilhotina 2D (FFD / BFD)**: Cortes contínuos de ponta a ponta ideais para esquadrejadeiras e seccionadoras manuais.
- **Maximal Rectangles (MaxRects)**: Empacotamento livre para centros de usinagem CNC e mesas de laser.
- **Shelf Packing (Faixas)**: Agrupamento linear por faixas de altura.

### 🎯 4. Fitas de Borda & Estimativa de Orçamento
- Marcação individual por lado: Superior (L1), Inferior (L2), Esquerda (H1), Direita (H2) ou 4 Lados.
- Cálculo automático da metragem linear total de fita necessária.
- Estimativa do custo total do projeto (Chapas brutas + Fitas de borda).

### 🖨️ 5. Ordem de Serviço A4 Profissional
- Geração de relatório de corte limpo para impressão em folhas A4 ou PDF.
- Diagramas de corte com etiquetas, medidas e indicação gráfica das fitas de borda aplicadas.

### 💎 6. Sistema de Créditos & PIX Integrado
- Checkout transparente com liberação imediata via Mercado Pago PIX.
- Geração dinâmica de QR Code e chave Copia e Cola.
- Conta unificada Keep AI para salvar e compartilhar créditos no ecossistema 4uLabs.

---

## 🚀 Demonstração Rápida (1-Clique)

O app conta com projetos completos de demonstração prontos para teste imediato:
- 🪵 **Armário Completo em MDF 15mm (2750×1830 mm)** com 10 tipos de peças estruturadas.
- 🪟 **Esquadrias & Vidros Float (3210×2200 mm)** para vidraçarias.
- ⚙️ **Gabinetes & Chapas de Aço (3000×1200 mm)** para serralherias e caldeirarias.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3 Moderno (Glassmorphism & Cyberpunk Theme), JavaScript ES6+ Puro (sem frameworks pesados).
- **Canvas API**: Renderização 2D de alta performance com suporte a Zoom, Pan e Labels comutáveis.
- **Backend**: PHP 8.x, SQLite 3 (Cofre Local e Controle de Sessão).
- **IA Vision**: OpenAI API (`gpt-4o-mini` Vision OCR) com prompts estruturados em JSON.
- **PWA**: Service Worker para cache, suporte offline e instalação como aplicativo nativo.

---

## 📁 Estrutura do Projeto

```text
cortefacil/
├── api.php                 # Endpoint de status, créditos e execução
├── api_mp_create.php       # Criação de cobrança PIX (Mercado Pago)
├── api_mp_check.php        # Verificação em tempo real do pagamento
├── api_mp_webhook.php      # Webhook de notificações de pagamento
├── api_ocr_sketch.php      # Endpoint de Visão Computacional (OpenAI Vision)
├── index.php               # Interface principal da aplicação
├── tutorial.php            # Central de Ajuda & Guia Completo
├── ui_header.php           # Cabeçalho modular e controles superiores
├── ui_modals.php           # Modais (OCR, PIX, Termos e Privacidade)
├── ui_footer.php           # Rodapé padrão 4U.IA.BR
├── script.js               # Motor de cálculo 2D, Canvas e interações
├── style.css               # Folha de estilos responsiva Cyber / Glass
├── manifest.json           # Manifesto PWA
├── sw.js                   # Service Worker para funcionamento offline
└── lib_db.php              # Camada de persistência SQLite
```

---

## ⚙️ Instalação e Configuração Local

1. Clone o repositório:
```bash
git clone git@github.com:4u-Labs/cortefacil.git
cd cortefacil
```

2. Crie o arquivo `.env` a partir do modelo:
```bash
cp .env.example .env
```

3. Configure suas chaves no `.env`:
```env
ADMIN_PASS=sua_senha_admin
OPENAI_API_KEY=sk-proj-sua-chave-openai
MP_PUBLIC_KEY=APP_USR-sua-chave-publica
MP_ACCESS_TOKEN=APP_USR-seu-access-token
APP_ENV=production
```

4. Inicie o servidor PHP embutido:
```bash
php -S localhost:8080
```
Acesse no navegador: `http://localhost:8080`

---

## 📜 Licença & Créditos

Desenvolvido por **[4U.IA.BR](https://4u.ia.br)**  
**Autor:** Fabiano Braga ([ORCID: 0009-0004-5936-5060](https://orcid.org/0009-0004-5936-5060))  
Todos os direitos reservados.

