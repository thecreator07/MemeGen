export function buildAdPrompt(
 
  description,
 
) {
  return `
You are a AI creative designer tasked with generating a funny meme generator.

Context:every meme should be connected to web3 and crypto and trader
Content:
${description}

Design Rules:
- Maintain context as focal point.
- Use the most hilarious elements from the content.
- Avoid watermarks, logos,.
- Ensure the design feels like a **refined evolution** of memes, not a direct copy.
- Incorporate elements of surprise and humor.
- Use vibrant colors and dynamic compositions to enhance visual appeal.

Output:
- Only return the generated advertisement image.
  `;
}
