import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getRecipeSuggestions } from '../vite-project/src/api/getRecipeSuggestions.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5174;
console.log('Using Anthropic API key:', process.env.ANTHROPIC_API_KEY ? 'Present' : 'Missing');
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('❌ Missing ANTHROPIC_API_KEY in .env file. Copy server/.env.example to server/.env and set your key.');
  process.exit(1);
}

app.post('/api/generate', async (req, res) => {
  try {
    const { ingredients } = req.body;
    console.log('📩 Received request with ingredients:', ingredients);

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ recipes: [], error: 'No ingredients provided' });
    }

    const recipes = await getRecipeSuggestions(ingredients);
    console.log('✅ Recipes prepared:', recipes.length);
    return res.json({ recipes });
  } catch (err) {
    console.error('❌ Backend error', err);
    return res.status(500).json({ recipes: [], error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});