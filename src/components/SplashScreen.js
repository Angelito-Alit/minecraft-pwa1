import React, { useState, useEffect } from 'react';
import './SplashScreen.css';

function SplashScreen() {
  const [loadingText, setLoadingText] = useState('Generando mundo...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messages = [
      'Generando mundo...',
      'Colocando bloques...',
      'Creando criaturas...',
      '¡Listo para jugar!'
    ];

    let messageIndex = 0;
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += 25;
      setProgress(currentProgress);
      
      if (messageIndex < messages.length) {
        setLoadingText(messages[messageIndex]);
        messageIndex++;
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 750);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="logo">
          <div className="minecraft-block">⬛</div>
          <h1>MINECRAFT PWA</h1>
        </div>
        <div className="loading-container">
          <div className="loading-text">{loadingText}</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{width: `${progress}%`}}
            ></div>
          </div>
          <div className="progress-text">{progress}%</div>
        </div>
        <div className="decorative-blocks">
          <span>🟫</span>
          <span>🟩</span>
          <span>⬛</span>
          <span>🟤</span>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;