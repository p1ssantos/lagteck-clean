// ========================================
// SISTEMA DE VERIFICAÇÃO DE CÓDIGO
// ========================================

const API_URL = 'https://seu-backend.com/api'; // ALTERE PARA SEU DOMÍNIO

// Abrir modal de código
function openCodeModal() {
    document.getElementById('codeModal').style.display = 'flex';
    document.getElementById('codeInput').focus();
}

// Fechar modal
function closeCodeModal() {
    document.getElementById('codeModal').style.display = 'none';
    document.getElementById('codeInput').value = '';
}

// Verificar código
async function verifyCode() {
    const codeInput = document.getElementById('codeInput');
    const code = codeInput.value.trim().toUpperCase();

    if (!code || code.length !== 9) {
        showNotification('⚠️ Código inválido! Formato: XXXX-XXXX', 'warning');
        return;
    }

    // Mostrar loading
    showNotification('🔄 Verificando código...', 'info');

    try {
        const response = await fetch(`${API_URL}/code/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code })
        });

        const data = await response.json();

        if (response.ok && data.valid) {
            // Código válido
            showNotification('✅ Código válido! Redirecionando...', 'success');
            
            // Salvar timestamp de desbloqueio
            localStorage.setItem('lagteck_unlock_time', Date.now());
            
            closeCodeModal();
            
            setTimeout(() => {
                window.location.href = 'executors.html';
            }, 1000);
        } else {
            // Código inválido ou expirado
            showNotification(`❌ ${data.message || 'Código inválido ou expirado!'}`, 'warning');
            codeInput.value = '';
            codeInput.focus();
        }
    } catch (error) {
        console.error('Erro ao verificar código:', error);
        showNotification('❌ Erro ao verificar código. Tente novamente.', 'warning');
    }
}

// Permitir Enter para verificar
document.addEventListener('DOMContentLoaded', () => {
    const codeInput = document.getElementById('codeInput');
    if (codeInput) {
        codeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                verifyCode();
            }
        });

        // Auto-formatar código
        codeInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
            if (value.length > 4) {
                value = value.slice(0, 4) + '-' + value.slice(4, 8);
            }
            e.target.value = value;
        });
    }
});

// Fechar modal ao clicar fora
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('codeModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeCodeModal();
            }
        });
    }
});
