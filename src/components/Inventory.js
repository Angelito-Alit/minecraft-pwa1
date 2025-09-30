import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Inventory() {
  const [inventory, setInventory] = useState(Array(36).fill(null));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [location, setLocation] = useState(null);

  // Items disponibles
  const availableItems = [
    { id: 'dirt', name: 'Tierra', emoji: '🟤' },
    { id: 'stone', name: 'Piedra', emoji: '⬛' },
    { id: 'wood', name: 'Madera', emoji: '🟫' },
    { id: 'grass', name: 'Pasto', emoji: '🟩' },
    { id: 'water', name: 'Agua', emoji: '🟦' },
    { id: 'diamond', name: 'Diamante', emoji: '💎' },
    { id: 'gold', name: 'Oro', emoji: '🟨' },
    { id: 'coal', name: 'Carbón', emoji: '⚫' },
    { id: 'iron', name: 'Hierro', emoji: '⚪' },
    { id: 'redstone', name: 'Redstone', emoji: '🔴' }
  ];

  useEffect(() => {
    loadInventory();
    getLocation();
  }, []);

  // Carga inventario desde localStorage
  const loadInventory = () => {
    const savedInventory = localStorage.getItem('inventory');
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    }
  };

  // Guarda inventario en localStorage
  const saveInventory = (newInventory) => {
    setInventory(newInventory);
    localStorage.setItem('inventory', JSON.stringify(newInventory));
  };

  // Obtiene ubicación del dispositivo
  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude.toFixed(2),
            lng: position.coords.longitude.toFixed(2)
          });
        },
        (error) => {
          console.log('Error obteniendo ubicación:', error);
        }
      );
    }
  };

  // Añade item al inventario
  const addItem = (item) => {
    const newInventory = [...inventory];
    const firstEmpty = newInventory.findIndex(slot => slot === null);
    
    if (firstEmpty !== -1) {
      newInventory[firstEmpty] = {
        ...item,
        quantity: 1,
        id: Date.now()
      };
      saveInventory(newInventory);
      
      // Vibración
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }

      // Notificación
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Minecraft PWA', {
          body: `Añadido: ${item.name}`,
          icon: '/logo192.png',
          tag: 'inventory-add'
        });
      }
    } else {
      alert('❌ Inventario lleno');
    }
  };

  // Remueve item del inventario
  const removeItem = (slotIndex) => {
    const newInventory = [...inventory];
    newInventory[slotIndex] = null;
    saveInventory(newInventory);
    setSelectedSlot(null);

    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50]);
    }
  };

  // Usa un item
  const useItem = (slotIndex) => {
    const item = inventory[slotIndex];
    if (item) {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Minecraft PWA', {
          body: `Usaste ${item.name}!`,
          icon: '/logo192.png',
          tag: 'item-use'
        });
      }
      
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 50, 50]);
      }
    }
  };

  return (
    <div className="inventory-page">
      {/* Header */}
      <div className="inventory-header">
        <Link to="/" className="back-btn">← Volver</Link>
        <h1>🎒 Inventario</h1>
      </div>

      {location && (
        <div className="location-info">
          📍 Ubicación: {location.lat}, {location.lng}
        </div>
      )}

      {/* Grid del inventario */}
      <div className="inventory-container">
        <h2>Tus Items ({inventory.filter(i => i !== null).length}/36)</h2>
        <div className="inventory-grid">
          {inventory.map((item, index) => (
            <div
              key={index}
              className={`inventory-slot ${selectedSlot === index ? 'selected' : ''}`}
              onClick={() => setSelectedSlot(selectedSlot === index ? null : index)}
            >
              {item ? (
                <div className="item">
                  <div className="item-emoji">{item.emoji}</div>
                  <div className="item-quantity">{item.quantity}</div>
                </div>
              ) : (
                <div className="empty-slot">+</div>
              )}
            </div>
          ))}
        </div>

        {/* Acciones para item seleccionado */}
        {selectedSlot !== null && inventory[selectedSlot] && (
          <div className="item-actions">
            <h3>{inventory[selectedSlot].name}</h3>
            <button 
              onClick={() => useItem(selectedSlot)}
              className="minecraft-btn"
            >
              ✨ Usar
            </button>
            <button 
              onClick={() => removeItem(selectedSlot)}
              className="minecraft-btn danger"
            >
              🗑️ Eliminar
            </button>
          </div>
        )}
      </div>

      {/* Items disponibles para añadir */}
      <div className="available-items">
        <h2>Añadir Items</h2>
        <div className="items-list">
          {availableItems.map((item) => (
            <button
              key={item.id}
              onClick={() => addItem(item)}
              className="item-btn"
            >
              {item.emoji} {item.name}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .inventory-page {
          padding: 20px;
          padding-bottom: 100px;
          min-height: 100vh;
        }

        .inventory-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .back-btn {
          color: white;
          text-decoration: none;
          font-size: 16px;
          padding: 8px;
        }

        .location-info {
          background: #2E7D32;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          margin-bottom: 20px;
          text-align: center;
        }

        .inventory-container {
          margin-bottom: 30px;
        }

        .inventory-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 4px;
          max-width: 400px;
          margin: 0 auto 20px;
        }

        .inventory-slot {
          aspect-ratio: 1;
          background: #424242;
          border: 2px solid #616161;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }

        .inventory-slot:hover {
          background: #616161;
          transform: scale(1.05);
        }

        .inventory-slot.selected {
          border-color: #4CAF50;
          background: #4CAF50;
          box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
        }

        .item {
          text-align: center;
        }

        .item-emoji {
          font-size: 20px;
        }

        .item-quantity {
          font-size: 10px;
          position: absolute;
          bottom: 2px;
          right: 2px;
          background: rgba(0,0,0,0.7);
          border-radius: 2px;
          padding: 1px 3px;
        }

        .empty-slot {
          opacity: 0.3;
          font-size: 24px;
        }

        .item-actions {
          text-align: center;
          padding: 16px;
          background: #37474F;
          border-radius: 8px;
          margin: 16px auto;
          max-width: 300px;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .item-actions h3 {
          margin: 0 0 12px 0;
          font-size: 14px;
        }

        .minecraft-btn.danger {
          background: #F44336;
          border-color: #D32F2F;
        }

        .minecraft-btn.danger:hover {
          background: #E57373;
        }

        .available-items {
          text-align: center;
        }

        .items-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 8px;
          max-width: 600px;
          margin: 0 auto;
        }

        .item-btn {
          background: #6D4C41;
          border: 2px solid #5D4037;
          color: white;
          padding: 12px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          transition: all 0.2s;
        }

        .item-btn:hover {
          background: #8D6E63;
          transform: translateY(-2px);
        }

        .item-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .inventory-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          
          .items-list {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

export default Inventory;