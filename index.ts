import { generateText } from 'ai';

async function main() {
  if (!process.env.AI_GATEWAY_API_KEY) {
    throw new Error(
      'AI_GATEWAY_API_KEY is missing. Add it to .env.local on your machine; never commit that file.',
    );
  }

  const { text } = await generateText({
    model: 'moonshotai/kimi-k3',
    prompt:
      'Invent a completely new holiday. Give it a memorable name, explain what it celebrates, and describe its traditions, food, decorations, and how people celebrate it together.',
  });

  if (!text.trim()) {
    throw new Error('The model returned an empty response.');
  }

  console.log(text);
}

main().catch((error) => {
  console.error('AI Gateway example failed:', error instanceof Error ? error.message : 'Unknown error');
  process.exitCode = 1;
});
