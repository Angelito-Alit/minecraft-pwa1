import React, { useState, useEffect } from 'react';

function DeviceFeatures() {
  const [deviceInfo, setDeviceInfo] = useState({});
  const [location, setLocation] = useState(null);
  const [batteryInfo, setBatteryInfo] = useState(null);
  const [motionData, setMotionData] = useState(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    detectDeviceFeatures();
    getBatteryInfo();
    startMotionListening();
  }, []);

  const detectDeviceFeatures = () => {
    const features = {
      camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      geolocation: 'geolocation' in navigator,
      vibration: 'vibrate' in navigator,
      battery: 'getBattery' in navigator,
      deviceMotion: 'DeviceMotionEvent' in window,
      deviceOrientation: 'DeviceOrientationEvent' in window,
      notification: 'Notification' in window,
      storage: 'localStorage' in window,
      online: 'onLine' in navigator
    };
    setDeviceInfo(features);
  };

  // Obtiene información de la batería
  const getBatteryInfo = async () => {
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        setBatteryInfo({
          level: Math.round(battery.level * 100),
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        });
        const updateBattery = () => {
          setBatteryInfo({
            level: Math.round(battery.level * 100),
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime
          });
        };

        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      } catch (error) {
        console.log('Error obteniendo info de batería:', error);
      }
    }
  };

  // Obtiene ubicación GPS
  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp).toLocaleString('es-ES')
          });
          if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
          }
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Minecraft PWA', {
              body: `📍 Ubicación obtenida: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
              icon: '/logo192.png'
            });
          }
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          alert(' Error obteniendo ubicación: ' + error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    }
  };

  // Prueba vibración
  const testVibration = () => {
    if ('vibrate' in navigator) {
      // Patrón de vibración tipo Minecraft
      navigator.vibrate([200, 100, 200, 100, 400]);
    } else {
      alert('❌ Vibración no disponible en este dispositivo');
    }
  };

  const startMotionListening = () => {
    if ('DeviceMotionEvent' in window) {
      const handleMotion = (event) => {
        setMotionData({
          acceleration: {
            x: event.acceleration?.x?.toFixed(2) || 0,
            y: event.acceleration?.y?.toFixed(2) || 0,
            z: event.acceleration?.z?.toFixed(2) || 0
          },
          rotation: {
            alpha: event.rotationRate?.alpha?.toFixed(2) || 0,
            beta: event.rotationRate?.beta?.toFixed(2) || 0,
            gamma: event.rotationRate?.gamma?.toFixed(2) || 0
          }
        });
      };

      window.addEventListener('devicemotion', handleMotion);
      setIsListening(true);

      setTimeout(() => {
        window.removeEventListener('devicemotion', handleMotion);
        setIsListening(false);
      }, 10000);
    }
  };

  // Solicita permisos de notificación
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('Minecraft PWA', {
          body: '🔔 ¡Notificaciones activadas correctamente!',
          icon: '/logo192.png'
        });
        if ('vibrate' in navigator) {
          navigator.vibrate(200);
        }
      }
    }
  };

  const getNetworkInfo = () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return null;
  };

  const networkInfo = getNetworkInfo();

  return (
    <div className="device-features">
      <h2>📱 Características del Dispositivo</h2>
      <div className="feature-section">
        <h3>🔋 Batería</h3>
        {batteryInfo ? (
          <div className="battery-info">
            <div className="battery-level">
              <div className="battery-bar">
                <div 
                  className="battery-fill"
                  style={{ width: `${batteryInfo.level}%` }}
                ></div>
              </div>
              <span>{batteryInfo.level}%</span>
            </div>
            <p>Estado: {batteryInfo.charging ? '🔌 Cargando' : '🔋 Descargando'}</p>
          </div>
        ) : (
          <p>❌ Información de batería no disponible</p>
        )}
      </div>
      <div className="feature-section">
        <h3>🗺️ Ubicación GPS</h3>
        <button onClick={getLocation} className="minecraft-btn">
          📍 Obtener Ubicación Actual
        </button>
        {location && (
          <div className="location-info">
            <p><strong>Latitud:</strong> {location.latitude.toFixed(6)}</p>
            <p><strong>Longitud:</strong> {location.longitude.toFixed(6)}</p>
            <p><strong>Precisión:</strong> ±{location.accuracy.toFixed(0)}m</p>
            <p><strong>Obtenida:</strong> {location.timestamp}</p>
          </div>
        )}
      </div>
      <div className="feature-section">
        <h3>📳 Vibración</h3>
        <button onClick={testVibration} className="minecraft-btn">
          📳 Probar Vibración
        </button>
        <p>Estado: {deviceInfo.vibration ? '✅ Disponible' : '❌ No disponible'}</p>
      </div>

      <div className="feature-section">
        <h3>🔔 Notificaciones</h3>
        <button onClick={requestNotificationPermission} className="minecraft-btn">
          🔔 Activar Notificaciones
        </button>
        <p>Estado: {Notification.permission === 'granted' ? '✅ Permitidas' : '❌ No permitidas'}</p>
      </div>



      <style jsx>{`
        .device-features {
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
        }

        .feature-section {
          background: #3E2723;
          border: 3px solid #2E1B14;
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
        }

        .feature-section h3 {
          margin: 0 0 12px 0;
          font-size: 14px;
        }

        .battery-info {
          text-align: center;
        }

        .battery-level {
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: center;
          margin-bottom: 8px;
        }

        .battery-bar {
          width: 100px;
          height: 20px;
          background: #424242;
          border: 2px solid #616161;
          border-radius: 4px;
          overflow: hidden;
        }

        .battery-fill {
          height: 100%;
          background: linear-gradient(90deg, #F44336, #FF9800, #4CAF50);
          transition: width 0.3s ease;
        }

        .location-info,
        .motion-data,
        .network-info {
          background: #2E7D32;
          padding: 8px 12px;
          border-radius: 4px;
          margin-top: 8px;
          font-size: 12px;
        }

        .location-info p,
        .motion-data p,
        .network-info p {
          margin: 4px 0;
        }

        .motion-data h4 {
          margin: 8px 0 4px 0;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .device-features {
            padding: 10px;
          }
          
          .feature-section {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default DeviceFeatures;