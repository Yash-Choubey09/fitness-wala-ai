import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const FITNESS_SYSTEM_PROMPT = `You are FitWala AI — a professional, motivational AI Fitness Coach with deep expertise in:
- Gym workouts and exercise programming
- Diet and nutrition plans (fat loss, muscle gain, maintenance)
- Supplement guidance
- Recovery and sleep optimization
- Yoga and mobility
- Body recomposition

Guidelines for responses:
- Always give structured, practical answers
- Use bullet points and short paragraphs for readability
- Be concise — avoid long paragraphs
- If the user asks a non-fitness question, politely redirect them
- Be encouraging and motivating
- Use metric and imperial units where appropriate
- When suggesting workouts, include sets, reps, and rest periods
- When suggesting diet, include macros where relevant`;

export async function getAIResponse(userMessage, history = []) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Build full prompt with conversation history
  const conversationHistory = history
    .map(h => `${h.role === 'user' ? 'User' : 'FitWala AI'}: ${h.text}`)
    .join('\n');

  const fullPrompt = `${FITNESS_SYSTEM_PROMPT}

${conversationHistory ? `Previous conversation:\n${conversationHistory}\n` : ''}
User: ${userMessage}
FitWala AI:`;

  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  return response.text();
}
