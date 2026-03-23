import express from 'express';
import { getAIResponse } from '../utils/gemini.js';

const router = express.Router();

// POST /api/ai/chat — open (no auth required for demo)
router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const reply = await getAIResponse(message.trim(), history || []);
    res.json({ reply });
  } catch (err) {
    console.error('Gemini AI error:', err.message);
    res.status(500).json({ error: 'AI service temporarily unavailable. Please try again.' });
  }
});

export default router;
