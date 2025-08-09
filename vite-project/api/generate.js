// api/generate.js
import { getRecipeSuggestions } from './getRecipeSuggestions.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ recipes: [], error: 'No ingredients provided' });
    }

    const recipes = await getRecipeSuggestions(ingredients);
    return res.status(200).json({ recipes });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ recipes: [], error: 'Internal server error' });
  }
}
