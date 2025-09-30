import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Configuración de notificaciones locales
async function setupNotifications() {
  try {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        new Notification('Minecraft PWA', {
          body: '🔔 ¡Notificaciones activadas!',
          icon: '/logo192.png',
          badge: '/logo192.png',
          vibrate: [200, 100, 200]
        });
      }
    }
  } catch (error) {
    console.log('Error configurando notificaciones:', error);
  }
}

// Registra Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker registrado:', registration.scope);
        
        // Verifica actualizaciones
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nueva versión disponible
              if (confirm('Nueva versión disponible. ¿Actualizar ahora?')) {
                window.location.reload();
              }
            }
          });
        });
      })
      .catch(error => {
        console.log('❌ Error registrando Service Worker:', error);
      });
  });
}

// Inicializa notificaciones después de 2 segundos
setTimeout(setupNotifications, 2000);

// Maneja el evento de instalación de la PWA
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
  
  // Muestra botón de instalación personalizado
  showInstallButton();
});

function showInstallButton() {
  // Verifica si ya existe el botón
  if (document.querySelector('.install-btn')) return;
  
  const installButton = document.createElement('button');
  installButton.innerText = '📱 Instalar App';
  installButton.className = 'install-btn';
  installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    border: none;
    padding: 12px 16px;
    border-radius: 25px;
    font-family: 'Press Start 2P', monospace;
    font-size: 10px;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    animation: bounce 2s infinite;
  `;
  
  installButton.addEventListener('click', async () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const choiceResult = await window.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ Usuario instaló la PWA');
        
        // Notificación de instalación exitosa
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Minecraft PWA', {
            body: '🎉 ¡App instalada exitosamente!',
            icon: '/logo192.png',
            vibrate: [200, 100, 200, 100, 200]
          });
        }
      } else {
        console.log('❌ Usuario canceló la instalación');
      }
      
      window.deferredPrompt = null;
      installButton.remove();
    }
  });
  
  document.body.appendChild(installButton);
}

// Maneja cuando la app ya fue instalada
window.addEventListener('appinstalled', () => {
  console.log('✅ PWA instalada');
  
  // Oculta el botón de instalación si existe
  const installBtn = document.querySelector('.install-btn');
  if (installBtn) {
    installBtn.remove();
  }
  
  // Notificación
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Minecraft PWA', {
      body: '🎉 App instalada. ¡Ahora puedes usarla desde tu pantalla de inicio!',
      icon: '/logo192.png',
      tag: 'app-installed'
    });
  }
});

// Detecta cambios en la conexión
window.addEventListener('online', () => {
  console.log('🟢 Conexión restaurada');
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Minecraft PWA', {
      body: '🟢 Conexión a internet restaurada',
      icon: '/logo192.png',
      tag: 'connection-status'
    });
  }
});

window.addEventListener('offline', () => {
  console.log('🔴 Sin conexión');
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Minecraft PWA', {
      body: '🔴 Modo offline activado',
      icon: '/logo192.png',
      tag: 'connection-status'
    });
  }
});

// Log de información del dispositivo
console.log('📱 Información del dispositivo:');
console.log('- User Agent:', navigator.userAgent);
console.log('- Platform:', navigator.platform);
console.log('- Online:', navigator.onLine);
console.log('- Service Worker:', 'serviceWorker' in navigator ? '✅' : '❌');
console.log('- Notificaciones:', 'Notification' in window ? '✅' : '❌');
console.log('- Cámara:', navigator.mediaDevices ? '✅' : '❌');
console.log('- GPS:', 'geolocation' in navigator ? '✅' : '❌');
console.log('- Vibración:', 'vibrate' in navigator ? '✅' : '❌');
console.log('- Batería:', 'getBattery' in navigator ? '✅' : '❌');