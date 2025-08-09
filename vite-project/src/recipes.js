// export async function getRecipes(ingredients) {
//   try {
//     const response = await fetch('http://localhost:5174/api/generate', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ ingredients })
//     });
//     console.log('FE: response status', response.status);
//     const data = await response.json();
//     console.log('FE: data', data);
//     return data.recipes || [];
//   } catch (error) {
//     console.error('FE fetch error', error);
//     return [];
//   }
// }

export async function fetchRecipes(ingredients) {
  try {
    const response = await fetch(`/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return { recipes: [] };
  }
}
