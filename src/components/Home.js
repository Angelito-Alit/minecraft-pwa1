import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import CameraCapture from './CameraCapture';
import DeviceFeatures from './DeviceFeatures';

function Home() {
  const [playerName, setPlayerName] = useState('');
  const [worldData, setWorldData] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState({});
  const [showCamera, setShowCamera] = useState(false);
  const [showDeviceFeatures, setShowDeviceFeatures] = useState(false);

  useEffect(() => {
    // Obtiene información del dispositivo
    const getDeviceInfo = async () => {
      const features = {
        battery: 'getBattery' in navigator ? 'Disponible' : 'No disponible',
        vibration: 'vibrate' in navigator ? 'Disponible' : 'No disponible',
        geolocation: 'geolocation' in navigator ? 'Disponible' : 'No disponible',
        camera: 'mediaDevices' in navigator ? 'Disponible' : 'No disponible'
      };
      if ('getBattery' in navigator) {
        try {
          const battery = await navigator.getBattery();
          features.battery = `${Math.round(battery.level * 100)}% - ${battery.charging ? 'Cargando' : 'Descargando'}`;
        } catch (error) {
          features.battery = 'Error obteniendo info';
        }
      }

      setDeviceInfo(features);
    };

    getDeviceInfo();
    loadWorldData();
  }, []);

  // Carga datos del mundo desde Firebase
  const loadWorldData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'worlds'));
      const worlds = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      if (worlds.length > 0) {
        setWorldData(worlds[0]);
      }
    } catch (error) {
      console.log('Error cargando mundo:', error);
      setWorldData({
        name: 'Mi Mundo',
        seed: '12345',
        difficulty: 'Normal'
      });
    }
  };

  // Crea un nuevo mundo
  const createNewWorld = async () => {
    const newWorld = {
      name: playerName || 'Mundo Nuevo',
      seed: Math.floor(Math.random() * 1000000),
      difficulty: 'Normal',
      createdAt: new Date()
    };

    try {
      await addDoc(collection(db, 'worlds'), newWorld);
      setWorldData(newWorld);
      showNotification('¡Nuevo mundo creado!');
    } catch (error) {
      console.log('Error creando mundo:', error);
      localStorage.setItem('currentWorld', JSON.stringify(newWorld));
      setWorldData(newWorld);
      showNotification('Mundo creado (sin conexión)');
    }
  };

  // Muestra notificación
  const showNotification = (message) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Minecraft PWA', {
        body: message,
        icon: '/logo192.png'
      });
    }
  };

  // Usa vibración si está disponible
  const handleVibration = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  };

 
  const handlePhotoTaken = (photoData) => {
    console.log('Foto tomada:', photoData.substring(0, 50) + '...');
    setShowCamera(false);
  };

  return (
    <div className="home">
      {/* Header */}
      <header className="home-header">
        <h1>⛏️ MINECRAFT PWA</h1>
        <p>Bienvenido al mundo de bloques</p>
      </header>

      {/* Información del mundo actual */}
      <div className="block-card">
        <h2>🌍 Tu Mundo</h2>
        {worldData ? (
          <div>
            <p><strong>Nombre:</strong> {worldData.name}</p>
            <p><strong>Semilla:</strong> {worldData.seed}</p>
            <p><strong>Dificultad:</strong> {worldData.difficulty}</p>
          </div>
        ) : (
          <p>No hay mundo cargado</p>
        )}
      </div>

      {/* Crear jugador/mundo */}
      <div className="block-card">
        <h2>👤 Jugador</h2>
        <input
          type="text"
          placeholder="Tu nombre"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="minecraft-input"
        />
        <button 
          onClick={createNewWorld}
          className="minecraft-btn"
          onMouseDown={handleVibration}
        >
          🆕 Crear Mundo Nuevo
        </button>
      </div>

      {/* Navegación principal */}
      <div className="block-card">
        <h2>🎮 Menú Principal</h2>
        <Link to="/inventory" className="minecraft-btn">
          🎒 Inventario
        </Link>
        <Link to="/recipes" className="minecraft-btn">
          📝 Recetas
        </Link>
      </div>

      {/* Uso real del hardware */}
      <div className="block-card">
        <h2>📱 Hardware del Dispositivo</h2>
        <div className="hardware-buttons">
          <button 
            onClick={() => setShowCamera(!showCamera)}
            className="minecraft-btn"
          >
            📸 {showCamera ? 'Cerrar' : 'Abrir'} Cámara
          </button>
          <button 
            onClick={() => setShowDeviceFeatures(!showDeviceFeatures)}
            className="minecraft-btn"
          >
            🔧 {showDeviceFeatures ? 'Ocultar' : 'Mostrar'} Sensores
          </button>
        </div>
        
        <div className="device-features">
          <p>🔋 Batería: {deviceInfo.battery}</p>
          <p>📳 Vibración: {deviceInfo.vibration}</p>
          <p>🗺️ Ubicación: {deviceInfo.geolocation}</p>
          <p>📸 Cámara: {deviceInfo.camera}</p>
        </div>
      </div>

      {/* Componente de cámara */}
      {showCamera && (
        <CameraCapture onPhotoTaken={handlePhotoTaken} />
      )}

      {/* Componente de características del dispositivo */}
      {showDeviceFeatures && (
        <DeviceFeatures />
      )}

      <style jsx>{`
        .home {
          padding: 20px;
          padding-bottom: 100px;
        }

        .home-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .home-header h1 {
          font-size: 28px;
          margin-bottom: 8px;
        }

        .home-header p {
          font-size: 14px;
          opacity: 0.8;
        }

        .minecraft-input {
          width: 100%;
          max-width: 300px;
          padding: 12px;
          margin: 12px 0;
          font-family: inherit;
          font-size: 14px;
          background: #37474F;
          border: 2px solid #546E7A;
          color: white;
          border-radius: 4px;
        }

        .minecraft-input::placeholder {
          color: #90A4AE;
        }

        .hardware-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .device-features p {
          margin: 8px 0;
          font-size: 12px;
          text-align: left;
        }

        @media (max-width: 768px) {
          .home {
            padding: 10px;
          }
          
          .hardware-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;  