import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Home from './components/Home';
import Inventory from './components/Inventory';
import Recipes from './components/Recipes';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Detecta si hay internet
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Minecraft PWA', {
          body: '🟢 Conexión restaurada',
          icon: '/logo192.png',
          tag: 'online-status'
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Minecraft PWA', {
          body: '🔴 Sin conexión - Modo offline activado',
          icon: '/logo192.png',
          tag: 'offline-status'
        });
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Pide permisos para notificaciones
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Registra Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registrado:', registration);
        })
        .catch(error => {
          console.log('Error registrando Service Worker:', error);
        });
    }
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="App">
      {!isOnline && (
        <div className="offline-banner">
          📡 Sin conexión - Modo offline
        </div>
      )}
      
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/recipes" element={<Recipes />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;