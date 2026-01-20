// ====================
// SISTEMA DE PROTEÇÃO CONTRA SCREENSHOT
// ====================

// Detectar tentativas de screenshot
const blurOverlay = document.getElementById('blurOverlay');

// Detectar Print Screen (Windows)
document.addEventListener('keyup', (e) => {
    if (e.key === 'PrintScreen') {
        activateBlur();
    }
});

// Detectar atalhos de screenshot
document.addEventListener('keydown', (e) => {
    // Windows: Win + Shift + S, Alt + Print
    if ((e.key === 'PrintScreen') || 
        (e.shiftKey && e.metaKey && e.key === 's') ||
        (e.shiftKey && e.metaKey && e.key === 'S')) {
        e.preventDefault();
        activateBlur();
    }
    
    // Mac: Cmd + Shift + 3, Cmd + Shift + 4, Cmd + Shift + 5
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        activateBlur();
    }
});

// Detectar perda de foco (pode indicar screenshot)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        activateBlur();
        setTimeout(() => {
            deactivateBlur();
        }, 3000);
    }
});

function activateBlur() {
    blurOverlay.style.display = 'flex';
    blurOverlay.innerHTML = '<div style="text-align:center;"><i class="fas fa-lock" style="font-size:80px;margin-bottom:20px;"></i><br>⚠️ SCREENSHOT BLOQUEADO ⚠️<br><small style="font-size:16px;margin-top:10px;display:block;">Conteúdo protegido</small></div>';
    document.body.style.filter = 'blur(50px)';
}

function deactivateBlur() {
    blurOverlay.style.display = 'none';
    document.body.style.filter = 'none';
}

// Desabilitar clique direito
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showNotification('⚠️ Clique direito desabilitado!', 'warning');
});

// Desabilitar F12 e outras ferramentas de desenvolvedor
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
        showNotification('⚠️ Ferramentas de desenvolvedor desabilitadas!', 'warning');
    }
});

// ====================
// SISTEMA DE DESBLOQUEIO
// ====================

let progressValue = 0;
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const unlockBtn = document.getElementById('unlockBtn');
const tiktokBtn = document.getElementById('tiktokBtn');

// Função para seguir no TikTok
function followTikTok() {
    // SUBSTITUA ESTE LINK PELO SEU LINK DO TIKTOK
    const tiktokURL = 'https://www.tiktok.com/@SEU_PERFIL';
    
    // Abrir TikTok em nova aba
    window.open(tiktokURL, '_blank');
    
    // Iniciar progresso
    startProgress();
}

function startProgress() {
    if (progressValue >= 100) return;
    
    showNotification('✅ Progresso iniciado! Aguarde...', 'success');
    tiktokBtn.disabled = true;
    tiktokBtn.style.opacity = '0.5';
    tiktokBtn.style.cursor = 'not-allowed';
    
    const interval = setInterval(() => {
        progressValue += 10;
        progressBar.style.width = progressValue + '%';
        progressText.textContent = progressValue + '%';
        
        if (progressValue >= 100) {
            clearInterval(interval);
            unlockBtn.disabled = false;
            unlockBtn.innerHTML = '<i class="fas fa-unlock"></i> LIBERAR';
            showNotification('🎉 Barra completa! Clique em LIBERAR!', 'success');
        }
    }, 300);
}

// Função para desbloquear conteúdo
function unlockContent() {
    // Salvar timestamp de desbloqueio
    const unlockTime = Date.now();
    localStorage.setItem('lagteck_unlock_time', unlockTime);
    
    showNotification('🚀 Redirecionando para executores...', 'success');
    
    setTimeout(() => {
        window.location.href = 'executors.html';
    }, 1000);
}

// ====================
// SISTEMA DE NOTIFICAÇÕES
// ====================

function showNotification(message, type = 'info') {
    // Remover notificação anterior se existir
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 20px 30px;
        background: ${type === 'success' ? '#27ae60' : type === 'warning' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 10px;
        font-weight: bold;
        font-size: 1.1em;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ====================
// VERIFICAÇÃO DE LOGO
// ====================

const mainLogo = document.getElementById('mainLogo');
if (mainLogo) {
    mainLogo.onerror = function() {
        this.style.display = 'none';
    };
    
    mainLogo.onload = function() {
        const placeholder = document.querySelector('.logo-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }
    };
}

// ====================
// INICIALIZAÇÃO
// ====================

console.log('%c⚠️ LAG TECK - SISTEMA PROTEGIDO ⚠️', 'color: #e74c3c; font-size: 20px; font-weight: bold;');
console.log('%cQualquer tentativa de copiar ou modificar este código é monitorada.', 'color: #e74c3c; font-size: 14px;');
