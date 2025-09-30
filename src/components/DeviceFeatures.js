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
      camera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
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
    if (!('getBattery' in navigator)) {
      console.log('Battery API no soportada');
      return;
    }

    try {
      const battery = await navigator.getBattery();
      const updateBatteryInfo = () => {
        setBatteryInfo({
          level: Math.round(battery.level * 100),
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        });
      };

      updateBatteryInfo();

      battery.addEventListener('levelchange', updateBatteryInfo);
      battery.addEventListener('chargingchange', updateBatteryInfo);
    } catch (error) {
      console.log('Error obteniendo info de batería:', error);
    }
  };

  // Obtiene ubicación GPS
  const getLocation = () => {
    if (!('geolocation' in navigator)) {
      alert('❌ Geolocalización no disponible en este navegador');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(position.timestamp).toLocaleString('es-ES')
        });
        
        // Vibración si está disponible
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
        
        // Notificación si está permitida
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Minecraft PWA', {
            body: `📍 Ubicación obtenida: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
            icon: '/logo192.png'
          });
        }
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
        let errorMsg = 'Error obteniendo ubicación: ';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg += 'Permiso denegado';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg += 'Información no disponible';
            break;
          case error.TIMEOUT:
            errorMsg += 'Tiempo de espera agotado';
            break;
          default:
            errorMsg += error.message;
        }
        
        alert('📍 ' + errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Prueba vibración
  const testVibration = () => {
    if (!('vibrate' in navigator)) {
      alert('❌ Vibración no disponible en este dispositivo');
      return;
    }

    try {
      // Patrón de vibración tipo Minecraft
      const vibrated = navigator.vibrate([200, 100, 200, 100, 400]);
      
      if (vibrated) {
        // Muestra feedback visual
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Minecraft PWA', {
            body: '📳 Vibración activada',
            icon: '/logo192.png',
            tag: 'vibration-test'
          });
        }
      }
    } catch (error) {
      console.error('Error en vibración:', error);
      alert('❌ Error al vibrar: ' + error.message);
    }
  };

  const startMotionListening = () => {
    if (!('DeviceMotionEvent' in window)) {
      console.log('Device Motion no soportado');
      return;
    }

    try {
      const handleMotion = (event) => {
        if (event.acceleration || event.rotationRate) {
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
        }
      };

      window.addEventListener('devicemotion', handleMotion);
      setIsListening(true);

      setTimeout(() => {
        window.removeEventListener('devicemotion', handleMotion);
        setIsListening(false);
      }, 10000);
    } catch (error) {
      console.error('Error iniciando motion listener:', error);
    }
  };

  // Solicita permisos de notificación
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('❌ Notificaciones no soportadas en este navegador');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        new Notification('Minecraft PWA', {
          body: '🔔 ¡Notificaciones activadas correctamente!',
          icon: '/logo192.png'
        });
        
        if ('vibrate' in navigator) {
          navigator.vibrate(200);
        }
      } else {
        alert('ℹ️ Permisos de notificación: ' + permission);
      }
    } catch (error) {
      console.error('Error solicitando permisos:', error);
      alert('❌ Error al solicitar permisos de notificación');
    }
  };

  const getNetworkInfo = () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      return {
        effectiveType: connection.effectiveType || 'desconocido',
        downlink: connection.downlink || 'N/A',
        rtt: connection.rtt || 'N/A',
        saveData: connection.saveData || false
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
                  style={{ 
                    width: `${batteryInfo.level}%`,
                    background: batteryInfo.level > 50 ? '#4CAF50' : 
                               batteryInfo.level > 20 ? '#FF9800' : '#F44336'
                  }}
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
        <p>Estado: {Notification.permission === 'granted' ? '✅ Permitidas' : 
                   Notification.permission === 'denied' ? '❌ Bloqueadas' : 
                   '⚠️ No configuradas'}</p>
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
          transition: width 0.3s ease, background 0.3s ease;
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