import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Recetas predefinidas
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
  }, []);

  // Carga recetas desde Firebase o usa las predefinidas
  const loadRecipes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const firebaseRecipes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (firebaseRecipes.length > 0) {
        setRecipes(firebaseRecipes);
      } else {
        setRecipes(defaultRecipes);
      }
    } catch (error) {
      console.log('Error cargando recetas:', error);
      // Usa recetas locales si no hay conexión
      const savedRecipes = localStorage.getItem('recipes');
      if (savedRecipes) {
        setRecipes(JSON.parse(savedRecipes));
      } else {
        setRecipes(defaultRecipes);
      }
    }
  };

  // Guarda nueva receta personalizada
  const saveCustomRecipe = async (recipe) => {
    try {
      await addDoc(collection(db, 'recipes'), recipe);
      loadRecipes(); // Recarga las recetas
    } catch (error) {
      console.log('Error guardando receta:', error);
      // Guarda localmente si no hay conexión
      const currentRecipes = [...recipes, recipe];
      setRecipes(currentRecipes);
      localStorage.setItem('recipes', JSON.stringify(currentRecipes));
    }
  };

  // Filtra recetas por búsqueda y categoría
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Crea una receta (simulación)
  const craftRecipe = (recipe) => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
    // Notificación
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Minecraft PWA', {
        body: `¡Creaste ${recipe.name}!`,
        icon: '/logo192.png'
      });
    }

    // Efecto visual simple
    const button = document.querySelector(`#craft-${recipe.id}`);
    if (button) {
      button.style.background = '#4CAF50';
      setTimeout(() => {
        button.style.background = '';
      }, 500);
    }
  };

  return (
    <div className="recipes-page">
      {/* Header */}
      <div className="recipes-header">
        <Link to="/" className="back-btn">← Volver</Link>
        <h1>📝 Recetas</h1>
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
              onClick={() => setSelectedCategory(category.id)}
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
          <p className="no-recipes">No se encontraron recetas</p>
        ) : (
          filteredRecipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
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
                    {recipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="ingredient-slot">
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
        }

        .filter-btn.active {
          background: #4CAF50;
          border-color: #388E3C;
        }

        .recipes-list {
          max-width: 800px;
          margin: 0 auto;
        }

        .no-recipes {
          text-align: center;
          opacity: 0.7;
          font-size: 14px;
        }

        .recipe-card {
          background: #3E2723;
          border: 3px solid #2E1B14;
          margin-bottom: 16px;
          padding: 16px;
          border-radius: 8px;
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
        }

        .recipe-arrow {
          font-size: 20px;
          opacity: 0.7;
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