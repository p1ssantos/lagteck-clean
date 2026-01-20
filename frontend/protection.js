// ========================================
// LAG TECK - PROTEÇÃO AVANÇADA ANTI-SCREENSHOT
// ========================================

class ScreenshotProtection {
    constructor() {
        this.blurOverlay = document.getElementById('blurOverlay');
        this.init();
    }

    init() {
        this.preventKeyboardScreenshots();
        this.preventContextMenu();
        this.preventDevTools();
        this.detectVolumeChanges();
        this.detectGestures();
        this.preventPrint();
        this.detectFocusLoss();
        this.preventCopy();
        this.monitorScreenRecording();
    }

    // Prevenir screenshots por teclado (Windows, Mac, Android, iOS)
    preventKeyboardScreenshots() {
        document.addEventListener('keyup', (e) => {
            // PrintScreen
            if (e.key === 'PrintScreen') {
                this.activateBlur('Screenshot detectado!');
            }
        });

        document.addEventListener('keydown', (e) => {
            // Windows: Win + Shift + S, Alt + Print, Shift + Print
            if ((e.key === 'PrintScreen') || 
                (e.shiftKey && e.metaKey && e.key === 's') ||
                (e.shiftKey && e.metaKey && e.key === 'S') ||
                (e.altKey && e.key === 'PrintScreen') ||
                (e.shiftKey && e.key === 'PrintScreen')) {
                e.preventDefault();
                this.activateBlur('Screenshot bloqueado!');
            }
            
            // Mac: Cmd + Shift + 3, 4, 5, 6
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && ['3', '4', '5', '6'].includes(e.key)) {
                e.preventDefault();
                this.activateBlur('Screenshot bloqueado!');
            }

            // Android/iOS: Power + Volume Down combinação
            if (e.key === 'VolumeDown' && this.powerPressed) {
                e.preventDefault();
                this.activateBlur('Screenshot bloqueado!');
            }
        });
    }

    // Detectar mudanças de volume (Android screenshot)
    detectVolumeChanges() {
        let lastVolume = null;
        let volumeCheckInterval = null;

        // Tentar detectar mudanças rápidas de volume
        if ('mediaDevices' in navigator) {
            volumeCheckInterval = setInterval(() => {
                if (document.hidden) {
                    this.activateBlur('Atividade suspeita detectada!');
                }
            }, 100);
        }

        // Detectar teclas de volume
        document.addEventListener('keydown', (e) => {
            if (e.key === 'VolumeUp' || e.key === 'VolumeDown' || e.key === 'VolumeMute') {
                this.suspiciousActivity = true;
                setTimeout(() => {
                    if (document.hidden || !document.hasFocus()) {
                        this.activateBlur('Screenshot bloqueado!');
                    }
                }, 50);
            }
        });
    }

    // Detectar gestures (iOS/Android screenshot swipes)
    detectGestures() {
        let touchStartY = 0;
        let touchStartX = 0;
        let touchStartTime = 0;

        document.addEventListener('touchstart', (e) => {
            if (e.touches.length >= 3) {
                // 3+ dedos pode ser screenshot
                this.activateBlur('Gesto de screenshot detectado!');
            }
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            touchStartTime = Date.now();
        });

        document.addEventListener('touchmove', (e) => {
            if (e.touches.length >= 2) {
                const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
                const deltaTime = Date.now() - touchStartTime;

                // Swipe rápido de cima para baixo (Android screenshot gesture)
                if (deltaY > 100 && deltaTime < 300) {
                    this.activateBlur('Gesto suspeito detectado!');
                }
            }
        });

        // Detectar "shake" do dispositivo (alguns apps de screenshot)
        if (window.DeviceMotionEvent) {
            let lastAcceleration = null;
            window.addEventListener('devicemotion', (e) => {
                const acceleration = e.accelerationIncludingGravity;
                if (lastAcceleration) {
                    const deltaX = Math.abs(acceleration.x - lastAcceleration.x);
                    const deltaY = Math.abs(acceleration.y - lastAcceleration.y);
                    const deltaZ = Math.abs(acceleration.z - lastAcceleration.z);

                    if (deltaX > 15 || deltaY > 15 || deltaZ > 15) {
                        this.activateBlur('Movimento suspeito detectado!');
                    }
                }
                lastAcceleration = acceleration;
            });
        }
    }

    // Prevenir menu de contexto (clique direito)
    preventContextMenu() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showNotification('⚠️ Clique direito desabilitado!', 'warning');
            return false;
        });

        // Prevenir long press em mobile
        document.addEventListener('touchstart', (e) => {
            this.longPressTimer = setTimeout(() => {
                e.preventDefault();
                this.showNotification('⚠️ Long press bloqueado!', 'warning');
            }, 500);
        });

        document.addEventListener('touchend', () => {
            clearTimeout(this.longPressTimer);
        });
    }

    // Prevenir DevTools
    preventDevTools() {
        // F12, Ctrl+Shift+I/J/C, Cmd+Option+I/J/C
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12' || 
                ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) ||
                ((e.ctrlKey || e.metaKey) && ['U', 'u', 'S', 's'].includes(e.key))) {
                e.preventDefault();
                this.showNotification('⚠️ DevTools bloqueado!', 'warning');
                return false;
            }
        });

        // Detectar DevTools aberto (via tamanho da tela)
        const detectDevTools = () => {
            const widthThreshold = window.outerWidth - window.innerWidth > 160;
            const heightThreshold = window.outerHeight - window.innerHeight > 160;
            
            if (widthThreshold || heightThreshold) {
                this.activateBlur('DevTools detectado!');
            }
        };

        setInterval(detectDevTools, 1000);

        // Detectar debugger
        setInterval(() => {
            const before = Date.now();
            debugger;
            const after = Date.now();
            if (after - before > 100) {
                this.activateBlur('Debugger detectado!');
            }
        }, 1000);
    }

    // Prevenir impressão
    preventPrint() {
        window.addEventListener('beforeprint', (e) => {
            e.preventDefault();
            this.activateBlur('Impressão bloqueada!');
            return false;
        });

        window.addEventListener('afterprint', (e) => {
            this.activateBlur('Impressão bloqueada!');
        });
    }

    // Detectar perda de foco
    detectFocusLoss() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.activateBlur('Perda de foco detectada!');
                setTimeout(() => {
                    this.deactivateBlur();
                }, 3000);
            }
        });

        window.addEventListener('blur', () => {
            this.activateBlur('Janela perdeu foco!');
            setTimeout(() => {
                this.deactivateBlur();
            }, 2000);
        });
    }

    // Prevenir cópia de texto
    preventCopy() {
        document.addEventListener('copy', (e) => {
            e.preventDefault();
            this.showNotification('⚠️ Cópia desabilitada!', 'warning');
            return false;
        });

        document.addEventListener('cut', (e) => {
            e.preventDefault();
            return false;
        });

        // Desabilitar seleção de texto
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.mozUserSelect = 'none';
        document.body.style.msUserSelect = 'none';
    }

    // Monitorar gravação de tela (experimental)
    monitorScreenRecording() {
        if ('mediaDevices' in navigator && 'getDisplayMedia' in navigator.mediaDevices) {
            const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
            navigator.mediaDevices.getDisplayMedia = () => {
                this.activateBlur('Gravação de tela detectada!');
                return Promise.reject(new Error('Gravação bloqueada'));
            };
        }
    }

    // Ativar blur
    activateBlur(message = '⚠️ SCREENSHOT BLOQUEADO ⚠️') {
        this.blurOverlay.style.display = 'flex';
        this.blurOverlay.innerHTML = `
            <div style="text-align:center; padding: 40px; background: rgba(239, 68, 68, 0.95); border-radius: 20px; max-width: 500px;">
                <i class="fas fa-lock" style="font-size:80px; margin-bottom:20px; color:white;"></i>
                <h1 style="font-size:2em; margin-bottom:20px; color:white;">${message}</h1>
                <p style="font-size:1.2em; color:white;">Conteúdo protegido contra captura</p>
            </div>
        `;
        document.body.style.filter = 'blur(50px)';
        document.body.style.pointerEvents = 'none';
    }

    // Desativar blur
    deactivateBlur() {
        this.blurOverlay.style.display = 'none';
        document.body.style.filter = 'none';
        document.body.style.pointerEvents = 'auto';
    }

    // Mostrar notificação
    showNotification(message, type = 'info') {
        const existingNotif = document.querySelector('.notification');
        if (existingNotif) existingNotif.remove();
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 20px 30px;
            background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#ef4444' : '#3b82f6'};
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
}

// Inicializar proteção
document.addEventListener('DOMContentLoaded', () => {
    new ScreenshotProtection();
    console.log('%c⚠️ LAG TECK - PROTEÇÃO ATIVA ⚠️', 'color: #ef4444; font-size: 20px; font-weight: bold;');
});
