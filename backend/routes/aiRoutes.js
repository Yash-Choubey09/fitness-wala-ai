import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Intelligent keyword-based fallback responses
function getFallback(message) {
  const msg = (message || "").toLowerCase();

  if (msg.includes("chest") || msg.includes("push") || msg.includes("bench")) {
    return `🔥 Chest Workout Plan:
• Bench Press – 4×8 reps
• Incline DB Press – 3×10 reps
• Chest Fly – 3×12 reps
• Push-ups – 3×15 reps

💡 Tip: Focus on progressive overload each week.`;
  }

  if (msg.includes("back") || msg.includes("pull") || msg.includes("row")) {
    return `🔥 Back Workout Plan:
• Deadlift – 4×6 reps
• Pull-ups – 3×8 reps
• Barbell Row – 3×10 reps
• Lat Pulldown – 3×12 reps

💡 Tip: Keep your back straight on all pulling movements.`;
  }

  if (msg.includes("leg") || msg.includes("squat") || msg.includes("glute")) {
    return `🔥 Leg Workout Plan:
• Squat – 4×8 reps
• Romanian Deadlift – 3×10 reps
• Leg Press – 3×12 reps
• Calf Raises – 4×15 reps

💡 Tip: Never skip leg day — they're your biggest muscle group!`;
  }

  if (msg.includes("diet") || msg.includes("food") || msg.includes("eat") || msg.includes("fat loss") || msg.includes("weight loss")) {
    return `🥗 Fat Loss Diet Plan:
• Breakfast: 3 eggs + oats + black coffee
• Lunch: Grilled chicken + rice + salad
• Snack: Greek yogurt + nuts
• Dinner: Fish + steamed veggies

💡 Tip: Aim for 500 calorie deficit daily. Drink 3–4L water.`;
  }

  if (msg.includes("muscle") || msg.includes("bulk") || msg.includes("gain")) {
    return `💪 Muscle Gain Plan:
• Caloric Surplus: +300–500 cal/day
• Protein: 2g per kg of bodyweight
• Training: 4–5 days/week (push/pull/legs)
• Sleep: 7–9 hours per night

💡 Tip: Compound lifts first, isolations last.`;
  }

  if (msg.includes("cardio") || msg.includes("run") || msg.includes("endurance")) {
    return `🏃 Cardio Plan:
• 3×/week: 30-min moderate jog
• 2×/week: 20-min HIIT intervals
• Daily: 8,000–10,000 steps

💡 Tip: Morning cardio on empty stomach burns more fat.`;
  }

  // Generic fallback
  return `🔥 Quick Fitness Plan:
• Push-ups – 3×15 reps
• Squats – 3×20 reps
• Plank – 3×45 seconds
• Jumping Jacks – 3×30 seconds

💡 Tip: Stay consistent — 30 minutes a day is all you need to start!`;
}

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ reply: "Please send a message." });
    }

    console.log("📩 Incoming message:", message);

    // ✅ CORRECT standard HF Inference API URL
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `You are a fitness coach. Answer this fitness question clearly and practically: ${message}`,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
          },
        }),
      }
    );

    // Safe raw text read before parse
    const text = await response.text();
    console.log("HF RAW RESPONSE:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("❌ Non-JSON response:", text);
      throw new Error("Invalid JSON from API");
    }

    // Handle model loading (HF returns error when model is loading)
    if (data.error && data.error.includes("loading")) {
      console.warn("⏳ Model is loading, using fallback...");
      return res.json({ reply: getFallback(message) });
    }

    let reply = "";
    if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text;
    } else if (data.generated_text) {
      reply = data.generated_text;
    } else if (data.error) {
      throw new Error(data.error);
    }

    if (!reply || reply.trim().length < 5) {
      throw new Error("Empty or too short response");
    }

    console.log("✅ AI reply sent");
    res.json({ reply: reply.trim() });

  } catch (error) {
    console.error("❌ AI ERROR:", error.message);
    // Always return intelligent fitness-specific fallback
    res.json({ reply: getFallback(req.body?.message) });
  }
});

export default router;
