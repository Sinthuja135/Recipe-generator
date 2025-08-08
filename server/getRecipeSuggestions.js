import fetch from 'node-fetch';

// Helper: extract JSON array from messy API output text
function extractJsonArray(text) {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start !== -1 && end !== -1 && end > start) {
    const jsonString = text.substring(start, end + 1);
    try {
      return JSON.parse(jsonString);
    } catch (err) {
      console.error('Failed to parse extracted JSON:', err);
      return null;
    }
  }
  return null;
}

export async function getRecipeSuggestions(ingredients) {
  const prompt = `
You are a creative recipe generator that ONLY outputs a JSON array of exactly 6 recipes in this format:

[
  {
    "title": "...",
    "usedIngredients": ["..."],
    "missingIngredients": ["..."],
    "instructions": ["step 1", "step 2", ...]
  }
]

DO NOT add any explanation or extra text outside the JSON.

User ingredients: ${ingredients.join(', ')}.
Generate 6 simple recipes using most or all of these ingredients.
`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'content-type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Anthropic API error:', errText);
    return [];
  }

  const data = await response.json();

  // Adjust this line to the exact field your API returns the text in:
  const textOutput = data?.completion || data?.choices?.[0]?.message?.content || data?.content?.[0]?.text || '';

  const parsed = extractJsonArray(textOutput);
  if (parsed) {
    return parsed;
  }

  // fallback: wrap full text in instructions array if parsing fails
  return [{
    title: 'Unstructured Output',
    usedIngredients: [],
    missingIngredients: [],
    instructions: [textOutput || 'No valid instructions received.'],
  }];
}
