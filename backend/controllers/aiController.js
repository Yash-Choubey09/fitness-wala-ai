import { GoogleGenerativeAI } from '@google/generative-ai';

// ───────────────────────────────────────────────────────────────────────────────
// Master Fitness Protocols (Fallback Data)
// ───────────────────────────────────────────────────────────────────────────────
const PROTOCOLS = {
  days: `**Optimal Training Frequency**\n\n* **Beginner:** 3 days per week (Full Body).\n* **Intermediate:** 4-5 days per week (Upper/Lower).\n* **Advanced:** 5-6 days per week (PPL SPLITS).`,
  wider_shoulders: `**Width Protocol**\n\n* **Lateral Raises** — 4x15-20 (Focus on lean-away variations).\n* **Upright Rows** — 3x12 (Middle delt emphasis).`,
  calves: `**Calf Hypertrophy**\n\n* **Standing Raise** — 4x10 (Heavy, 2s stretch).\n* **Seated Raise** — 4x20 (Soleus focus).`,
  deadlifts: `**Deadlift Safety**\n\nDeadlifts are safe if you maintain a neutral spine and engage your lats. Avoid rounding your lower back under heavy load.`,
  eggs: `**Nutritional Powerhouse**\n\nEggs are high-quality protein. 2-4 daily whole eggs are safe and provide essential leucine for growth.`,
  sugar: `**Sugar Cravings**\n\nIncrease protein and hydration to reduce cravings. Thirst is often mistaken for hunger.`,
  sleep: `**Sleep Science**\n\n7.5–9 hours is required for optimal testosterone and GH release. 5 hours is NOT sufficient for recovery.`,
  window: `**Anabolic Window**\n\nThe window is 4-6 hours. Total daily protein is more important than immediate post-workout timing.`,
  protein: `**Protein Intake**\n\nAim for 1g per lb of bodyweight. It is safe for healthy kidneys and ensures muscle retention.`,
  chest: `**Chest Protocol**\n\nFlat Bench, Incline DB Press, and Dips. Retract your scapula to protect shoulders.`,
  back: `**Back Expansion**\n\nPull-ups for width, Rows for thickness. Pull with your elbows to isolate the lats.`,
  leg: `**Leg Foundation**\n\nSquats and RDLs. Depth is more important than weight for true hypertrophy.`,
  creatine: `**Creatine Guide**\n\n5g Monohydrate daily. Increases ATP and intracellular hydration. Safe and effective.`,
  belly_fat: `**Belly Fat Truth**\n\nYou cannot spot reduce. You must be in a caloric deficit until total body fat drops enough to show abs.`,
  default: `I am FitWala AI. I can guide you on Muscle Growth, Fat Loss, and Supplement Science. Ask me about a specific body part.`
};

const getProtocol = (msg) => {
  const q = msg.toLowerCase();
  if (q.includes('shoulder')) return PROTOCOLS.wider_shoulders;
  if (q.includes('calf')) return PROTOCOLS.calves;
  if (q.includes('deadlift')) return PROTOCOLS.deadlifts;
  if (q.includes('egg')) return PROTOCOLS.eggs;
  if (q.includes('sugar') || q.includes('craving')) return PROTOCOLS.sugar;
  if (q.includes('sleep') || q.includes('hour')) return PROTOCOLS.sleep;
  if (q.includes('window')) return PROTOCOLS.window;
  if (q.includes('kidney') || (q.includes('protein') && q.includes('safe'))) return PROTOCOLS.protein;
  if (q.includes('chest') || q.includes('pec')) return PROTOCOLS.chest;
  if (q.includes('back') || q.includes('row')) return PROTOCOLS.back;
  if (q.includes('leg') || q.includes('squat')) return PROTOCOLS.leg;
  if (q.includes('creatine')) return PROTOCOLS.creatine;
  if (q.includes('belly fat')) return PROTOCOLS.belly_fat;
  if (q.includes('days') && q.includes('train')) return PROTOCOLS.days;
  return PROTOCOLS.default;
};

// ───────────────────────────────────────────────────────────────────────────────
// Controllers
// ───────────────────────────────────────────────────────────────────────────────

export const chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    
    // Check for Gemini Key
    const geminiKey = process.env.GEMINI_API_KEY;
    const isMocked = !geminiKey || geminiKey === 'mocked_key_for_now' || geminiKey === 'YOUR_GEMINI_API_KEY';

    if (isMocked) {
      return res.json({ reply: getProtocol(message) });
    }

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `System: You are "Fitness Wala AI", a professional coach. 
    User: "${message}". 
    Provide a concise, expert, science-based answer in Markdown.`;

    const result = await model.generateContent(prompt);
    res.json({ reply: result.response.text() });

  } catch (error) {
    res.json({ reply: getProtocol(req.body.message) });
  }
};

export const generateWorkoutPlan = async (req, res) => {
  try {
    const { goal } = req.body;
    const mockedPlan = {
      message: `${goal} protocol generated.`,
      workouts: [
        { id: 1, name: 'Barbell Bench Press', sets: 4, reps: '8-10', restTime: '90s', youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
        { id: 2, name: 'Lat Pulldown', sets: 3, reps: '10-12', restTime: '60s', youtubeUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc' }
      ]
    };
    res.json(mockedPlan);
  } catch (error) {
    res.status(500).json({ message: 'Generation failed' });
  }
};
