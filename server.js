const express = require('express');
const path = require('path');
const webpush = require('web-push');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// Configuración de Web Push usando variables de entorno
webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL || 'tu-email@ejemplo.com'}`,
  process.env.REACT_APP_VAPID_PUBLIC_KEY || 'clave-publica-demo',
  process.env.VAPID_PRIVATE_KEY || 'clave-privada-demo'
);
let subscriptions = [];

// API para datos del servidor (SSR)
app.get('/api/server-data', (req, res) => {
  const serverData = {
    timestamp: new Date().toISOString(),
    serverInfo: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: process.platform
    },
    gameData: {
      playersOnline: Math.floor(Math.random() * 100) + 1,
      worldSeed: '12345',
      difficulty: 'Normal',
      gameMode: 'Survival'
    }
  };
  
  res.json(serverData);
});

// API para obtener estadísticas del mundo
app.get('/api/world-stats', (req, res) => {
  const stats = {
    blocksPlaced: Math.floor(Math.random() * 10000) + 1000,
    itemsCrafted: Math.floor(Math.random() * 5000) + 500,
    monstersDefeated: Math.floor(Math.random() * 2000) + 200,
    distanceTraveled: Math.floor(Math.random() * 50000) + 5000,
    timeAlive: Math.floor(Math.random() * 720) + 60, // minutos
    level: Math.floor(Math.random() * 50) + 1
  };
  
  res.json(stats);
});

// API para suscripciones push
app.post('/api/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  
  res.status(201).json({
    message: 'Suscripción exitosa',
    subscriptionId: subscriptions.length
  });
});

// API para enviar notificaciones
app.post('/api/send-notification', async (req, res) => {
  const { title, message } = req.body;
  
  const payload = JSON.stringify({
    title: title || 'Minecraft PWA',
    body: message || '¡Nueva actualización disponible!',
    icon: '/logo192.png',
    badge: '/logo192.png'
  });

  try {
    // Envía a todas las suscripciones
    const promises = subscriptions.map(subscription => {
      return webpush.sendNotification(subscription, payload);
    });
    
    await Promise.all(promises);
    res.json({ message: 'Notificaciones enviadas', count: subscriptions.length });
  } catch (error) {
    console.error('Error enviando notificaciones:', error);
    res.status(500).json({ error: 'Error enviando notificaciones' });
  }
});
app.get('/api/offline-data', (req, res) => {
  const offlineData = {
    lastSync: new Date().toISOString(),
    cachedWorlds: [
      { name: 'Mi Mundo', seed: '12345', difficulty: 'Normal' },
      { name: 'Mundo Creativo', seed: '67890', difficulty: 'Pacífico' }
    ],
    playerInventory: [
      { id: 'dirt', name: 'Tierra', emoji: '🟤', quantity: 64 },
      { id: 'stone', name: 'Piedra', emoji: '⬛', quantity: 32 },
      { id: 'wood', name: 'Madera', emoji: '🟫', quantity: 16 }
    ]
  };
  
  res.json(offlineData);
});

// SSR básico - genera contenido del lado del servidor
app.get('/ssr/*', (req, res) => {
  const requestedPath = req.params[0];
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Minecraft PWA - ${requestedPath}</title>
      <style>
        body { 
          font-family: 'Courier New', monospace; 
          background: #2E7D32;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .server-content {
          max-width: 600px;
          margin: 0 auto;
          background: #1B5E20;
          padding: 20px;
          border-radius: 8px;
        }
      </style>
    </head>
    <body>
      <div class="server-content">
        <h1>⛏️ Minecraft PWA</h1>
        <h2>Página generada en el servidor</h2>
        <p><strong>Ruta:</strong> /${requestedPath}</p>
        <p><strong>Generado:</strong> ${new Date().toLocaleString('es-ES')}</p>
        <p><strong>Servidor:</strong> Node.js Express</p>
        <p><strong>Modo:</strong> Server-Side Rendering (SSR)</p>
        <hr>
        <p>Esta página fue renderizada en el servidor antes de enviarse al cliente.</p>
        <a href="/" style="color: #4CAF50;">← Volver a la aplicación</a>
      </div>
    </body>
    </html>
  `;
  
  res.send(htmlContent);
});

// Manejador para todas las demás rutas (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📱 PWA disponible en http://localhost:${PORT}`);
  console.log(`🔧 API disponible en http://localhost:${PORT}/api`);
});