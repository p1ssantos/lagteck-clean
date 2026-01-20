# 🎮 LAG TECK - Sistema de Executores

![Status](https://img.shields.io/badge/Status-Ativo-success)
![Versão](https://img.shields.io/badge/Vers%C3%A3o-1.0.0-blue)
![Licença](https://img.shields.io/badge/Licen%C3%A7a-Privada-red)

## 📋 Sobre o Projeto

Site profissional da **LAG TECK** com sistema de desbloqueio via TikTok, timer de 5 minutos e proteção avançada contra screenshots. O site oferece acesso controlado a executores para diferentes plataformas (Android, iOS e PC).

## ✨ Funcionalidades Implementadas

### ✅ Página Inicial (index.html)
- ✔️ Logo grande da LAG TECK (personalizável)
- ✔️ Botão "SIGA ESSA CONTA" para TikTok
- ✔️ Barra de progresso animada (0% a 100%)
- ✔️ Sistema de desbloqueio inteligente
- ✔️ Botão "LIBERAR" ativado após 100%
- ✔️ Links para redes sociais (Discord, Facebook, Instagram, TikTok, Email)
- ✔️ Marca d'água "LAG TECK" diagonal em roxo claro

### ✅ Página de Executores (executors.html)
- ✔️ **Executor DELTA**: Botões para Android e iOS
- ✔️ **Executor KRLN**: Botões para Android e iOS
- ✔️ **Executor XENO**: Botão para PC com aviso animado
- ✔️ Timer de 5 minutos visível
- ✔️ Botão centralizado "Ir para os Scripts"
- ✔️ Mesmos links de redes sociais do rodapé

### ✅ Página de Scripts (scripts.html)
- ✔️ Aviso de "PÁGINA EM CONSTRUÇÃO"
- ✔️ 5 placeholders para scripts futuros
- ✔️ Timer de 5 minutos visível
- ✔️ Design consistente com outras páginas

### ✅ Proteções de Segurança
- ✔️ **Proteção contra Print Screen**: Tela borrada ao tentar screenshot
- ✔️ **Bloqueio de atalhos**: Windows (Win+Shift+S) e Mac (Cmd+Shift+3/4/5)
- ✔️ **Timer de 5 minutos**: Acesso limitado após desbloqueio
- ✔️ **Tela de timeout**: Aviso quando o tempo expira
- ✔️ **Clique direito desabilitado**: Protege contra inspeção
- ✔️ **F12 bloqueado**: Impede abertura de DevTools
- ✔️ **Proteção @media print**: CSS especial para impressão

### ✅ Design e Estética
- ✔️ Tema roxo claro (#e6d9ff) em todas as páginas
- ✔️ Marca d'água "LAG TECK" diagonal visível
- ✔️ Animações suaves e modernas
- ✔️ Responsivo para mobile, tablet e desktop
- ✔️ Ícones Font Awesome integrados
- ✔️ Gradientes coloridos nos botões

## 🚀 Como Configurar

### 1. Adicionar sua Logo
Coloque seu arquivo de logo na pasta raiz com o nome:
```
logo.png
```

### 2. Configurar Links das Redes Sociais

#### No arquivo `index.html`, `executors.html` e `scripts.html`:

**Discord:**
```html
<a href="https://discord.gg/SEU_SERVIDOR" target="_blank" class="discord-link">
```

**Facebook:**
```html
<a href="https://facebook.com/SUA_PAGINA" target="_blank" title="Facebook">
```

**Instagram:**
```html
<a href="https://instagram.com/SEU_PERFIL" target="_blank" title="Instagram">
```

**TikTok:**
```html
<a href="https://tiktok.com/@SEU_PERFIL" target="_blank" title="TikTok">
```

**Email:**
```html
<a href="mailto:seu@email.com" title="Email">
```

### 3. Configurar Link do TikTok para Desbloqueio

No arquivo `js/main.js`, linha ~60:
```javascript
function followTikTok() {
    const tiktokURL = 'https://www.tiktok.com/@SEU_PERFIL'; // ALTERE AQUI
    window.open(tiktokURL, '_blank');
    startProgress();
}
```

### 4. Configurar Links dos Executores

No arquivo `executors.html`, altere os links dos botões:

```html
<!-- DELTA -->
<a href="https://LINK_DELTA_ANDROID_AQUI" class="executor-btn android" target="_blank">
<a href="https://LINK_DELTA_IOS_AQUI" class="executor-btn ios" target="_blank">

<!-- KRLN -->
<a href="https://LINK_KRLN_ANDROID_AQUI" class="executor-btn android" target="_blank">
<a href="https://LINK_KRLN_IOS_AQUI" class="executor-btn ios" target="_blank">

<!-- XENO -->
<a href="https://LINK_XENO_PC_AQUI" class="executor-btn pc" target="_blank">
```

## 📁 Estrutura de Arquivos

```
lag-teck/
│
├── index.html              # Página inicial com desbloqueio
├── executors.html          # Página de executores
├── scripts.html            # Página de scripts (em construção)
├── logo.png               # Sua logo (ADICIONAR)
│
├── css/
│   └── style.css          # Estilos completos do site
│
├── js/
│   ├── main.js            # JavaScript da página inicial
│   └── timer.js           # Sistema de timer de 5 minutos
│
└── README.md              # Este arquivo
```

## 🌐 Como Publicar

### Opção 1: GitHub Pages
```bash
# 1. Criar repositório no GitHub
git init
git add .
git commit -m "LAG TECK - Versão 1.0"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/lag-teck.git
git push -u origin main

# 2. Ir em Settings > Pages
# 3. Selecionar branch "main" e pasta "/ (root)"
# 4. Salvar e aguardar deploy
```

### Opção 2: Vercel
```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Fazer login
vercel login

# 3. Deploy
vercel

# 4. Para produção
vercel --prod
```

### Opção 3: Netlify
```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Fazer login
netlify login

# 3. Deploy
netlify deploy

# 4. Para produção
netlify deploy --prod
```

## ⚙️ Funcionamento do Sistema

### Fluxo de Navegação
```
1. index.html (Página Inicial)
   ↓ (Clicar "SIGA ESSA CONTA")
   ↓ (Barra de progresso 0% → 100%)
   ↓ (Clicar "LIBERAR")
   ↓
2. executors.html (5 minutos de acesso)
   ↓ (Clicar "Ir para os Scripts")
   ↓
3. scripts.html (5 minutos de acesso)
   ↓ (Após 5 minutos)
   ↓
   Tela de Timeout → Voltar ao início
```

### Sistema de Timer
- ⏰ **Duração**: 5 minutos (300 segundos)
- 🔒 **Armazenamento**: localStorage do navegador
- ⚠️ **Aviso**: Muda de cor nos últimos 3 minutos
- 🚨 **Timeout**: Tela borrada com mensagem de tempo esgotado

### Proteções Ativas
1. **Screenshot Prevention**: Detecta Print Screen e atalhos
2. **DevTools Block**: F12 e Ctrl+Shift+I bloqueados
3. **Right Click Disabled**: Clique direito desabilitado
4. **Print Protection**: CSS especial para impressão
5. **Visibility Detection**: Detecta mudança de aba

## 🎨 Personalização de Cores

No arquivo `css/style.css`:

```css
:root {
    --primary-purple: #e6d9ff;      /* Fundo roxo claro */
    --dark-purple: #9b59b6;         /* Roxo escuro */
    --accent-purple: #8e44ad;       /* Roxo de destaque */
    --text-dark: #2c3e50;           /* Texto escuro */
    --text-light: #ecf0f1;          /* Texto claro */
    --success: #27ae60;             /* Verde sucesso */
    --warning: #e74c3c;             /* Vermelho aviso */
}
```

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Animações, gradientes, responsividade
- **JavaScript (Vanilla)**: Lógica de negócios
- **Font Awesome 6.4.0**: Ícones
- **LocalStorage API**: Persistência de dados
- **Media Queries**: Design responsivo

## 📱 Responsividade

O site é totalmente responsivo e se adapta a:
- 📱 **Smartphones**: 320px - 767px
- 📱 **Tablets**: 768px - 1023px
- 💻 **Desktop**: 1024px+
- 🖥️ **Telas grandes**: 1920px+

## ⚠️ Recursos Pendentes

### Página de Scripts (scripts.html)
- 🔲 Implementar scripts reais
- 🔲 Sistema de cópia de código
- 🔲 Categorização de scripts
- 🔲 Sistema de busca
- 🔲 Favoritos

### Melhorias Futuras
- 🔲 Sistema de login/registro
- 🔲 Painel administrativo
- 🔲 Analytics de acessos
- 🔲 Sistema de comentários
- 🔲 Versão dark/light mode

## 🔐 Segurança

### Camadas de Proteção Implementadas:
1. ✅ Anti-screenshot (teclado e atalhos)
2. ✅ Timer de sessão (5 minutos)
3. ✅ Proteção contra print
4. ✅ Bloqueio de DevTools
5. ✅ Desabilitação de contexto
6. ✅ Detecção de perda de foco

### Recomendações Adicionais:
- 🔒 Implementar autenticação de usuários
- 🔒 Usar HTTPS sempre
- 🔒 Adicionar rate limiting
- 🔒 Implementar CAPTCHA
- 🔒 Logs de acesso

## 📞 Suporte

Para dúvidas ou problemas:
- 💬 Discord: [Seu servidor]
- 📧 Email: seu@email.com
- 📱 TikTok: @seu_perfil

## 📄 Licença

© 2024 LAG TECK - Todos os direitos reservados.

Este é um projeto privado. Uso não autorizado é proibido.

---

**Desenvolvido com 💜 por LAG TECK**

*Última atualização: 2024*#   l a g t e c k  
 #   l a g t e c k  
 