import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [craftedCount, setCraftedCount] = useState(0);

  // Recetas del juego
  const defaultRecipes = [
    {
      id: 1,
      name: 'Mesa de Trabajo',
      category: 'tools',
      ingredients: ['🟫', '🟫', '🟫', '🟫'],
      result: '📦',
      description: 'Básica para crear otros items'
    },
    {
      id: 2,
      name: 'Pico de Madera',
      category: 'tools',
      ingredients: ['🟫', '🟫', '🟫', '🪵', '🪵'],
      result: '⛏️',
      description: 'Para minar piedra y minerales'
    },
    {
      id: 3,
      name: 'Espada de Hierro',
      category: 'weapons',
      ingredients: ['⚪', '⚪', '🪵'],
      result: '⚔️',
      description: 'Arma básica de combate'
    },
    {
      id: 4,
      name: 'Pan',
      category: 'food',
      ingredients: ['🌾', '🌾', '🌾'],
      result: '🍞',
      description: 'Restaura puntos de hambre'
    },
    {
      id: 5,
      name: 'Antorcha',
      category: 'decoration',
      ingredients: ['⚫', '🪵'],
      result: '🕯️',
      description: 'Proporciona luz'
    },
    {
      id: 6,
      name: 'Cama',
      category: 'decoration',
      ingredients: ['🟩', '🟩', '🟩', '🟫', '🟫', '🟫'],
      result: '🛏️',
      description: 'Para dormir y establecer punto de aparición'
    },
    {
      id: 7,
      name: 'Horno',
      category: 'tools',
      ingredients: ['⬛', '⬛', '⬛', '⬛', '⬛', '⬛', '⬛', '⬛'],
      result: '🔥',
      description: 'Para fundir minerales y cocinar comida'
    },
    {
      id: 8,
      name: 'Escalera',
      category: 'decoration',
      ingredients: ['🪵', '🪵', '🪵', '🪵', '🪵', '🪵', '🪵'],
      result: '🪜',
      description: 'Para subir y bajar niveles'
    },
    {
      id: 9,
      name: 'Cofre',
      category: 'decoration',
      ingredients: ['🟫', '🟫', '🟫', '🟫', '🟫', '🟫', '🟫', '🟫'],
      result: '📦',
      description: 'Almacena items'
    },
    {
      id: 10,
      name: 'Espada de Diamante',
      category: 'weapons',
      ingredients: ['💎', '💎', '🪵'],
      result: '⚔️',
      description: 'Arma poderosa'
    }
  ];

  const categories = [
    { id: 'all', name: 'Todas', emoji: '📋' },
    { id: 'tools', name: 'Herramientas', emoji: '🔨' },
    { id: 'weapons', name: 'Armas', emoji: '⚔️' },
    { id: 'food', name: 'Comida', emoji: '🍎' },
    { id: 'decoration', name: 'Decoración', emoji: '🏠' }
  ];

  useEffect(() => {
    loadRecipes();
    loadCraftedCount();
  }, []);

  // Carga recetas desde localStorage o usa las predefinidas
  const loadRecipes = () => {
    const savedRecipes = localStorage.getItem('recipes');
    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes));
    } else {
      setRecipes(defaultRecipes);
      localStorage.setItem('recipes', JSON.stringify(defaultRecipes));
    }
  };

  // Carga contador de items creados
  const loadCraftedCount = () => {
    const count = localStorage.getItem('craftedCount');
    if (count) {
      setCraftedCount(parseInt(count));
    }
  };

  // Filtra recetas por búsqueda y categoría
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Crea una receta
  const craftRecipe = (recipe) => {
    // Vibración
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
    
    // Notificación
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Minecraft PWA', {
        body: `¡Creaste ${recipe.name}! ${recipe.result}`,
        icon: '/logo192.png',
        tag: 'craft-' + recipe.id,
        vibrate: [100, 50, 100]
      });
    }

    // Actualiza contador
    const newCount = craftedCount + 1;
    setCraftedCount(newCount);
    localStorage.setItem('craftedCount', newCount.toString());

    // Efecto visual
    const button = document.querySelector(`#craft-${recipe.id}`);
    if (button) {
      button.style.background = '#4CAF50';
      button.textContent = '✅ ¡Creado!';
      setTimeout(() => {
        button.style.background = '';
        button.textContent = '🔨 Crear';
      }, 1000);
    }

    // Añade al inventario si existe
    addToInventory(recipe.result);
  };

  // Añade item al inventario
  const addToInventory = (itemEmoji) => {
    const savedInventory = localStorage.getItem('inventory');
    let inventory = savedInventory ? JSON.parse(savedInventory) : Array(36).fill(null);
    
    const firstEmpty = inventory.findIndex(slot => slot === null);
    if (firstEmpty !== -1) {
      inventory[firstEmpty] = {
        emoji: itemEmoji,
        name: 'Item Creado',
        quantity: 1,
        id: Date.now()
      };
      localStorage.setItem('inventory', JSON.stringify(inventory));
    }
  };

  return (
    <div className="recipes-page">
      {/* Header */}
      <div className="recipes-header">
        <Link to="/" className="back-btn">← Volver</Link>
        <h1>📝 Recetas</h1>
      </div>

      {/* Estadísticas */}
      <div className="stats-banner">
        🔨 Items creados: {craftedCount}
      </div>

      {/* Buscador y filtros */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Buscar receta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                if ('vibrate' in navigator) {
                  navigator.vibrate(50);
                }
              }}
              className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
            >
              {category.emoji} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de recetas */}
      <div className="recipes-list">
        {filteredRecipes.length === 0 ? (
          <div className="no-recipes">
            <p>❌ No se encontraron recetas</p>
            <p style={{fontSize: '10px', opacity: 0.7}}>
              Intenta con otro término de búsqueda
            </p>
          </div>
        ) : (
          filteredRecipes.map((recipe, index) => (
            <div 
              key={recipe.id} 
              className="recipe-card"
              style={{animationDelay: `${index * 0.05}s`}}
            >
              <div className="recipe-header">
                <h3>{recipe.result} {recipe.name}</h3>
                <span className="recipe-category">
                  {categories.find(c => c.id === recipe.category)?.emoji}
                </span>
              </div>
              
              <div className="recipe-content">
                <div className="ingredients">
                  <h4>Ingredientes:</h4>
                  <div className="ingredients-grid">
                    {recipe.ingredients.map((ingredient, idx) => (
                      <div key={idx} className="ingredient-slot">
                        {ingredient}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="recipe-arrow">→</div>
                
                <div className="result">
                  <h4>Resultado:</h4>
                  <div className="result-item">{recipe.result}</div>
                </div>
              </div>
              
              <p className="recipe-description">{recipe.description}</p>
              
              <button
                id={`craft-${recipe.id}`}
                onClick={() => craftRecipe(recipe)}
                className="craft-btn"
              >
                🔨 Crear
              </button>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .recipes-page {
          padding: 20px;
          padding-bottom: 100px;
          min-height: 100vh;
        }

        .recipes-header {
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

        .stats-banner {
          background: #1B5E20;
          padding: 12px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 20px;
          font-size: 14px;
          border: 2px solid #2E7D32;
        }

        .search-section {
          margin-bottom: 30px;
          text-align: center;
        }

        .search-input {
          width: 100%;
          max-width: 400px;
          padding: 12px;
          margin-bottom: 16px;
          font-family: inherit;
          font-size: 14px;
          background: #37474F;
          border: 2px solid #546E7A;
          color: white;
          border-radius: 4px;
        }

        .search-input::placeholder {
          color: #90A4AE;
        }

        .search-input:focus {
          outline: none;
          border-color: #4CAF50;
        }

        .category-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }

        .filter-btn {
          background: #6D4C41;
          border: 2px solid #5D4037;
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          background: #8D6E63;
          transform: translateY(-2px);
        }

        .filter-btn:active {
          transform: translateY(0);
        }

        .filter-btn.active {
          background: #4CAF50;
          border-color: #388E3C;
          box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
        }

        .recipes-list {
          max-width: 800px;
          margin: 0 auto;
        }

        .no-recipes {
          text-align: center;
          opacity: 0.7;
          font-size: 14px;
          padding: 40px 20px;
          background: #37474F;
          border-radius: 8px;
        }

        .no-recipes p {
          margin: 8px 0;
        }

        .recipe-card {
          background: #3E2723;
          border: 3px solid #2E1B14;
          margin-bottom: 16px;
          padding: 16px;
          border-radius: 8px;
          animation: fadeInUp 0.3s ease forwards;
          opacity: 0;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
          from {
            opacity: 0;
            transform: translateY(20px);
          }
        }

        .recipe-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .recipe-header h3 {
          margin: 0;
          font-size: 16px;
        }

        .recipe-category {
          font-size: 20px;
        }

        .recipe-content {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 16px;
          align-items: center;
          margin-bottom: 12px;
        }

        .ingredients h4,
        .result h4 {
          margin: 0 0 8px 0;
          font-size: 12px;
          opacity: 0.8;
        }

        .ingredients-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          max-width: 120px;
        }

        .ingredient-slot {
          aspect-ratio: 1;
          background: #6D4C41;
          border: 2px solid #4E2A1C;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: transform 0.2s;
        }

        .ingredient-slot:hover {
          transform: scale(1.1);
        }

        .recipe-arrow {
          font-size: 20px;
          opacity: 0.7;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }

        .result-item {
          background: #1B5E20;
          border: 2px solid #2E7D32;
          border-radius: 4px;
          padding: 12px;
          text-align: center;
          font-size: 24px;
          max-width: 60px;
          margin: 0 auto;
        }

        .recipe-description {
          font-size: 12px;
          opacity: 0.8;
          margin: 12px 0;
          text-align: center;
        }

        .craft-btn {
          width: 100%;
          background: #FF9800;
          border: 3px solid #F57C00;
          color: white;
          padding: 12px;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
          font-size: 14px;
          transition: all 0.2s;
        }

        .craft-btn:hover {
          background: #FFB74D;
          transform: scale(1.02);
          box-shadow: 0 4px 8px rgba(255, 152, 0, 0.3);
        }

        .craft-btn:active {
          transform: scale(0.98);
        }

        @media (max-width: 768px) {
          .recipe-content {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .recipe-arrow {
            transform: rotate(90deg);
          }

          .ingredients-grid {
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
}

export default Recipes;