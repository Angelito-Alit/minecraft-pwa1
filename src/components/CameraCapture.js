import React, { useState, useRef } from 'react';

function CameraCapture() {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef();
  const streamRef = useRef();

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setIsActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
  };

  return (
    <div style={{padding: '20px', textAlign: 'center', background: '#3E2723', borderRadius: '8px'}}>
      <h3>Cámara del Dispositivo</h3>
      
      {error && <p style={{color: '#ff5555', fontSize: '12px'}}>{error}</p>}
      
      {!isActive && (
        <button onClick={startCamera} className="minecraft-btn">
          Activar Cámara
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
            Cerrar Cámara
          </button>
        </div>
      )}
    </div>
  );
}

export default CameraCapture;