// api/chat.js
import { createChat } from '@vercel/ai';

export const runtime = 'edge'; // Run as edge function for speed

// Initialize Grok 3 model chat client
const chat = createChat({
  model: 'grok-3',
});

// Define the API handler
export default async function handler(req) {
  try {
    // Parse incoming JSON body with chat messages
    const { messages } = await req.json();

    // Insert system prompt as the first message
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

    // Combine system message with user messages
    const fullMessages = [SYSTEM_MESSAGE, ...messages];

    // Call the Grok 3 model via Vercel AI SDK
    const response = await chat({
      messages: fullMessages,
    });

    // Extract the assistant's reply text
    const reply = response.choices[0].message.content;

    // Return the reply as JSON
    return new Response(JSON.stringify({ response: reply }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Handle errors gracefully
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
