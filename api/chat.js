import { createChat } from 'ai';

export const runtime = 'edge';

// Initialize Grok 3 chat client once
const chat = createChat({
  model: 'grok-3',
});

// Common headers with CORS
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',        // Allow all origins for development
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // Only allow POST
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

    // Call Grok 3 chat model via Vercel AI SDK
    const response = await chat({ messages: fullMessages });

    const reply = response.choices[0].message.content;

    return new Response(JSON.stringify({ response: reply }), { headers });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers,
    });
  }
}

    messages: [SYSTEM_MESSAGE, ...messages],
  });

  return new StreamingTextResponse(response);
}
