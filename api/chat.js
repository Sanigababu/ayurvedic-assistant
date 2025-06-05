// api/chat.js
import { StreamingTextResponse, streamText } from 'ai';
import { grok } from '@ai-sdk/grok'; // This handles grok-3 without manual API key

export const runtime = 'edge'; // Edge function for better performance

export async function POST(req) {
  const { messages } = await req.json();

  const SYSTEM_MESSAGE = {
    role: 'system',
    content: `You are an Ayurvedic Assistant, an expert in traditional Indian medicine and holistic wellness.

Guidelines:
- Be conversational, natural, and engaging like ChatGPT.
- Only use "Namaste" for initial greetings.
- Provide concise and complete answers.
- Base advice on Ayurvedic principles focusing on natural remedies, herbs, lifestyle, and diet.
- Explain doshas (Vata, Pitta, Kapha), dhatus, and balance.
- Use Sanskrit terms but always explain them.
- Be warm, compassionate, respectful.
- Use headings and bullet points for remedies.
- Emphasize advice is not a substitute for professional medical care.
- Redirect questions outside Ayurveda to medical professionals.`
  };

  const fullMessages = [SYSTEM_MESSAGE, ...messages];

  const result = await streamText({
    model: grok('grok-3'),
    messages: fullMessages,
  });

  return new StreamingTextResponse(result);
}
