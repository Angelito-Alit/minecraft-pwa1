import React, { useState, useRef, useEffect } from 'react';

function CameraCapture() {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const videoRef = useRef();
  const streamRef = useRef();

  useEffect(() => {
    // Verifica si la API de cámara está disponible
    checkCameraSupport();
  }, []);

  const checkCameraSupport = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('  La cámara no es soportada en este navegador o requiere HTTPS');
      setIsSupported(false);
    } else {
      setIsSupported(true);
    }
  };

  const startCamera = async () => {
    try {
      setError(null);

      // Verificación adicional antes de intentar acceder
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia no está disponible');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Intenta usar cámara trasera en móviles
        } 
      });
      
      streamRef.current = stream;
      setIsActive(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error('Error accediendo a la cámara:', err);
      
      let errorMessage = 'Error: ';
      
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Permiso denegado. Permite el acceso a la cámara.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No se encontró ninguna cámara en el dispositivo.';
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'La cámara está en uso por otra aplicación.';
      } else if (err.name === 'SecurityError') {
        errorMessage += 'Se requiere HTTPS para acceder a la cámara.';
      } else {
        errorMessage += err.message || 'No se pudo acceder a la cámara.';
      }
      
      setError(errorMessage);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  };

  // Limpia el stream cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div style={{
      padding: '20px', 
      textAlign: 'center', 
      background: '#3E2723', 
      borderRadius: '8px',
      margin: '16px 0'
    }}>
      <h3>📸 Cámara del Dispositivo</h3>
      
      {error && (
        <div style={{
          color: '#ff5555', 
          fontSize: '12px',
          background: '#2E1B14',
          padding: '12px',
          borderRadius: '4px',
          margin: '12px 0'
        }}>
          {error}
        </div>
      )}
      
      {!isSupported && (
        <div style={{
          background: '#2E7D32',
          padding: '12px',
          borderRadius: '4px',
          margin: '12px 0',
          fontSize: '12px'
        }}>
          <p>💡 Nota: Para usar la cámara necesitas:</p>
          <ul style={{textAlign: 'left', marginTop: '8px'}}>
            <li>Navegador moderno (Chrome, Firefox, Safari)</li>
            <li>Conexión HTTPS o localhost</li>
            <li>Permisos de cámara habilitados</li>
          </ul>
        </div>
      )}
      
      {!isActive && isSupported && (
        <button onClick={startCamera} className="minecraft-btn">
          📸 Activar Cámara
        </button>
      )}
      
      {isActive && (
        <div>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            style={{
              width: '100%', 
              maxWidth: '400px', 
              height: '300px',
              border: '2px solid #4CAF50',
              borderRadius: '8px',
              background: '#000'
            }}
          />
          <br />
          <button onClick={stopCamera} className="minecraft-btn" style={{marginTop: '10px'}}>
            ⏹️ Cerrar Cámara
          </button>
          <div style={{
            fontSize: '10px',
            marginTop: '8px',
            opacity: 0.7
          }}>
              Cámara activa
          </div>
        </div>
      )}
    </div>
  );
}

export default CameraCapture;