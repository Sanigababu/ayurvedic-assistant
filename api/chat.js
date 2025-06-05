import { createClient } from '@ai-sdk/xai';

export const runtime = 'edge';

const client = createClient({
  model: 'grok-3',
});

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',        
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Only POST requests are allowed' }),
      { status: 405, headers }
    );
  }

  try {
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
- Redirect questions outside Ayurveda to medical professionals.`,
    };

    const fullMessages = [SYSTEM_MESSAGE, ...messages];

    // Call Grok 3 chat model
    const response = await client.chat.full(fullMessages);

    // Extract reply content
    const reply = response.choices[0].message.content;

    return new Response(JSON.stringify({ response: reply }), { headers });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { status: 500, headers }
    );
  }
}

