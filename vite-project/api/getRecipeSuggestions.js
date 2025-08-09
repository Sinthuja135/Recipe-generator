import fetch from 'node-fetch';

// Helper: sanitize JSON string to fix common formatting issues
function sanitizeJsonString(jsonString) {
  return jsonString
    .replace(/,\s*([\]}])/g, '$1') // remove trailing commas before ] or }
    .replace(/[\r\n]+/g, ' ')      // replace newlines with spaces
    .trim();
}

// Helper: extract JSON array from messy API output text
function extractJsonArray(text) {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start !== -1 && end !== -1 && end > start) {
    const jsonString = text.substring(start, end + 1);
    try {
      const cleanString = sanitizeJsonString(jsonString);
      return JSON.parse(cleanString);
    } catch (err) {
      console.error('Failed to parse extracted JSON:', err);
      console.log('Raw JSON string:', jsonString);
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

IMPORTANT: The output must be valid JSON. No extra spaces, commas, or explanations.  
Ensure the JSON array and objects are perfectly formatted.

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
