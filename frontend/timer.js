// ====================
// SISTEMA DE TIMER DE 5 MINUTOS
// ====================

const TIMER_DURATION = 5 * 60; // 5 minutos em segundos
let remainingTime = TIMER_DURATION;
let timerInterval = null;

const timerDisplay = document.getElementById('timerDisplay');
const timerText = document.getElementById('timerText');
const blurOverlay = document.getElementById('blurOverlay');

// ====================
// PROTEÇÃO CONTRA SCREENSHOT
// ====================

// Detectar tentativas de screenshot
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

// Detectar perda de foco
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

// Desabilitar F12 e ferramentas de desenvolvedor
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
// FUNÇÃO DO TIMER
// ====================

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (timerInterval) return; // Já está rodando
    
    timerInterval = setInterval(() => {
        remainingTime--;
        timerText.textContent = formatTime(remainingTime);
        
        // Mudanças de cor conforme o tempo
        if (remainingTime <= 60) {
            timerDisplay.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
            timerDisplay.style.animation = 'pulse 1s infinite';
        } else if (remainingTime <= 180) {
            timerDisplay.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
        }
        
        // Quando o tempo acabar
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            showTimeoutScreen();
        }
    }, 1000);
}

function showTimeoutScreen() {
    // Ativar blur completo
    blurOverlay.style.display = 'flex';
    document.body.style.filter = 'blur(50px)';
    
    blurOverlay.innerHTML = `
        <div style="text-align:center; padding:40px; background:rgba(231,76,60,0.95); border-radius:20px; max-width:500px;">
            <i class="fas fa-clock" style="font-size:100px; margin-bottom:20px; color:white;"></i>
            <h1 style="font-size:2.5em; margin-bottom:20px; color:white;">⏰ TEMPO ESGOTADO!</h1>
            <p style="font-size:1.3em; margin-bottom:30px; color:white;">
                Seus 5 minutos de acesso aos executores e scripts terminaram.
            </p>
            <button onclick="returnToHome()" style="
                padding: 20px 40px;
                font-size: 1.3em;
                font-weight: bold;
                background: white;
                color: #e74c3c;
                border: none;
                border-radius: 15px;
                cursor: pointer;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                <i class="fas fa-home"></i> Voltar ao Início
            </button>
        </div>
    `;
    
    // Limpar localStorage
    localStorage.removeItem('lagteck_unlock_time');
}

function returnToHome() {
    window.location.href = 'index.html';
}

// ====================
// VERIFICAÇÃO DE ACESSO
// ====================

function checkAccess() {
    const unlockTime = localStorage.getItem('lagteck_unlock_time');
    
    if (!unlockTime) {
        // Não foi desbloqueado, redirecionar para home
        showNotification('⚠️ Acesso negado! Desbloqueie primeiro.', 'warning');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }
    
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - parseInt(unlockTime)) / 1000);
    
    if (elapsedTime >= TIMER_DURATION) {
        // Tempo já expirou
        showTimeoutScreen();
        return;
    }
    
    // Calcular tempo restante
    remainingTime = TIMER_DURATION - elapsedTime;
    timerText.textContent = formatTime(remainingTime);
    
    // Iniciar timer
    startTimer();
}

// ====================
// SISTEMA DE NOTIFICAÇÕES
// ====================

function showNotification(message, type = 'info') {
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
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

// Adicionar animações
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
// INICIALIZAÇÃO
// ====================

// Verificar acesso ao carregar página
checkAccess();

console.log('%c⚠️ LAG TECK - SISTEMA PROTEGIDO ⚠️', 'color: #e74c3c; font-size: 20px; font-weight: bold;');
console.log('%cTimer de 5 minutos ativado!', 'color: #e74c3c; font-size: 14px;');
