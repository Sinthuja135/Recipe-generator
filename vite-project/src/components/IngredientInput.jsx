import React, { useState } from 'react';
import '../styles/IngredientInput.css';

export function IngredientInput({ onAdd, disabled }) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input);
      setInput('');
    }
  };

  const onEnterPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="ingredient-input">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onEnterPress}
        placeholder="Add an ingredient (e.g., tomato)"
        disabled={disabled}
      />
      <button onClick={handleAdd} disabled={disabled || !input.trim()}>
        Add
      </button>
    </div>
  );
}
