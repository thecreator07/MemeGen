export function buildAdPrompt(
  headline: string,
  description: string,
  cta: string,
  iteration: number
) {
  return `
You are a professional AI creative designer tasked with generating a polished, modern advertisement image.

Context:
- You are given the product image, a template image, and (if available) the previous ad image.
- Each iteration should keep the brand identity consistent, but refine and improve the design.

Ad Content:
- Headline: ${headline}
- Description: ${description}
- Call to Action (CTA): ${cta}

Design Rules:
- Maintain product as focal point.
- Use the template structure for layout and color guidance.
- Each iteration ${iteration} must introduce subtle creative changes:
  • Adjust background (gradient, texture, lighting, or patterns)
  • Slightly modify typography (style, size, or placement)
  • Refine layout spacing and alignment
  • Experiment with accent colors while keeping brand consistency
- Avoid watermarks, logos, or repetitive identical layouts.
- Ensure the design feels like a **refined evolution** of the last output but different in layout and design elements.

Output:
- Only return the generated advertisement image.
  `;
}
