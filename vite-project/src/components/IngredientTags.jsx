import React from 'react';
import '../styles/IngredientTags.css';

export function IngredientTags({ ingredients, onRemove }) {
  return (
    <div className="ingredient-tags">
      {ingredients.map((ingredient, idx) => (
        <div key={idx} className="ingredient-tag">
          {ingredient}
          <button className="remove-btn" onClick={() => onRemove(ingredient)}>
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
