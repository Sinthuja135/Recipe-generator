import React, { useState } from 'react';
import { IngredientInput } from './components/IngredientInput';
import { IngredientTags } from './components/IngredientTags';
import { RecipeCard } from './components/RecipeCard';
import { fetchRecipes } from './recipes';
import './styles/App.css';

export default function App() {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const addIngredient = (ingredient) => {
    const normalized = ingredient.trim().toLowerCase();
    if (normalized && !ingredients.includes(normalized)) {
      setIngredients([...ingredients, normalized]);
    }
  };

  const removeIngredient = (ingredientToRemove) => {
    setIngredients(ingredients.filter((ing) => ing !== ingredientToRemove));
  };

  const generateRecipes = async () => {
    setLoading(true);
    try {
      const data = await fetchRecipes(ingredients);
      
      // Always create a new array reference
      setRecipes([...(data.recipes || [])]);
    } catch (err) {
      console.error(err);
      setRecipes([]);
    }
    setLoading(false);
  };

  return (
    <main className="app-container">
        <div className="app-wrapper">
        <h1 className="title">Leftover Recipe Generator</h1>
        <IngredientInput onAdd={addIngredient} disabled={loading} />
        <IngredientTags ingredients={ingredients} onRemove={removeIngredient} />
        <button
          className="generate-button"
          onClick={generateRecipes}
          disabled={ingredients.length === 0 || loading}
        >
          {loading ? 'Generating...' : 'Generate Recipes'}
        </button>

        <div className="recipes-list">
          {recipes.length === 0 && !loading && (
            <p>No recipes generated yet. Add ingredients and hit generate!</p>
          )}
          {recipes.map((recipe, i) => (
            <RecipeCard key={i} recipe={recipe} />
          ))}
        </div>
        </div>
    </main>
  );
}
