import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  throw new Error('OPENROUTER_API_KEY is required to generate Sorbet Skin assets.');
}

const outputDir = join(process.cwd(), 'public', 'assets', 'generated');
const model = process.env.OPENROUTER_IMAGE_MODEL ?? 'google/gemini-3.1-flash-image-preview';

const assets = [
  {
    filename: 'sorbet-hero-lifestyle.png',
    aspectRatio: '16:9',
    prompt:
      'Create an original ecommerce hero image for Sorbet Skin, a playful vegan cruelty-free self-tan and bodycare brand. Bright sorbet colours, whipped shower foam texture, glossy body butter jars and mousse bottles, warm sunlit bathroom counter, no people, no third party logos, premium playful bodycare energy but completely original.',
  },
  {
    filename: 'sorbet-product-collection.png',
    aspectRatio: '4:3',
    prompt:
      'Create an original product collection image for Sorbet Skin: colourful whipped self tan mousse bottles, body butter tubs, lip balm tubes, cleanser and hydrating mask arranged like dessert on a pastel set. Mango, vanilla, raspberry, peach, caramel, cocoa colour cues. No copied packaging, no third party logos, clean ecommerce product photography.',
  },
  {
    filename: 'sorbet-bridal-service.png',
    aspectRatio: '4:3',
    prompt:
      'Create an original warm beauty service editorial image for Sorbet Skin spray tanning appointments. Elegant studio setting, soft robe, tan-safe setup, glowing skin mood without identifiable faces, premium but playful sorbet palette, no text, no logos.',
  },
  {
    filename: 'sorbet-social-tiles.png',
    aspectRatio: '1:1',
    prompt:
      'Create an original square social media style collage for Sorbet Skin bodycare: whipped foam swirls, glossy body butter texture, pastel packaging, fruit-inspired colour blocks mango vanilla raspberry peach, fun stickers and sparkles, no readable text, no logos.',
  },
];

async function generateAsset(asset) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.OPENROUTER_HTTP_REFERER ?? 'https://paullie.com/',
      'X-OpenRouter-Title': 'Sorbet Skin Asset Generation',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: asset.prompt }],
      modalities: ['image', 'text'],
      image_config: {
        aspect_ratio: asset.aspectRatio,
        image_size: process.env.OPENROUTER_IMAGE_SIZE ?? '1K',
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`${asset.filename}: OpenRouter returned ${response.status} ${await response.text()}`);
  }

  const result = await response.json();
  const image = result.choices?.[0]?.message?.images?.[0];
  const dataUrl = image?.image_url?.url ?? image?.imageUrl?.url;
  const match = typeof dataUrl === 'string' ? dataUrl.match(/^data:(.+);base64,(.+)$/) : null;

  if (!match) {
    throw new Error(`${asset.filename}: no base64 image was returned.`);
  }

  await writeFile(join(outputDir, asset.filename), Buffer.from(match[2], 'base64'));
  console.log(`Generated ${asset.filename}`);
}

for (const asset of assets) {
  await generateAsset(asset);
}
