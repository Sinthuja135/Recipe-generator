import React from 'react';
import '../styles/RecipeCard.css';

export function RecipeCard({ recipe }) {
  const usedIngredients = recipe.usedIngredients || [];
  const missingIngredients = recipe.missingIngredients || [];
  const instructions = recipe.instructions || [];

  return (
    <div className="recipe-card">
      <h2 className="recipe-title">{recipe.title}</h2>

      <div className="ingredients-section">
        <div>
          <strong>Used Ingredients:</strong>{' '}
          {usedIngredients.length > 0
            ? usedIngredients.map((ing, idx) => (
                <span key={idx} className="ingredient used">
                  {ing}
                </span>
              ))
            : 'None'}
        </div>

        {missingIngredients.length > 0 && (
          <div>
            <strong>Missing Ingredients:</strong>{' '}
            {missingIngredients.map((ing, idx) => (
              <span key={idx} className="ingredient missing" title="Missing">
                {ing}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="instructions-section">
        <strong>Instructions:</strong>
        <ol className="instructions-list">
          {instructions.map((step, idx) => (
            <li key={idx} className="instructions-step">
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
