import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Registro del Service Worker y configuración PWA
import { messaging } from './firebase';
import { getToken, onMessage } from 'firebase/messaging';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Configuración de notificaciones push
async function setupNotifications() {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
      });
      
      if (token) {
        console.log('Token FCM:', token);
        fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token })
        });
      }
    }
  } catch (error) {
    console.log('Error configurando notificaciones:', error);
  }
}

// Escucha mensajes cuando la app está en primer plano
onMessage(messaging, (payload) => {
  console.log('Mensaje recibido:', payload);
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: '/logo192.png',
      badge: '/logo192.png'
    });
  }
});

// Inicializa notificaciones
setupNotifications();
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  
  // Guarda el evento para mostrarlo después
  window.deferredPrompt = e;
  
  // Muestra botón de instalación personalizado
  showInstallButton();
});

function showInstallButton() {
  const installButton = document.createElement('button');
  installButton.innerText = '📱 Instalar App';
  installButton.className = 'install-btn';
  installButton.style.cssText = `
    position: fixed;
    bottom: 80px;
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
  `;
  
  installButton.addEventListener('click', async () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const choiceResult = await window.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuario instaló la PWA');
      }
      
      window.deferredPrompt = null;
      installButton.remove();
    }
  });
  
  document.body.appendChild(installButton);
}