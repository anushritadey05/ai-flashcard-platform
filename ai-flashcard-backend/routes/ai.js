const router = require('express').Router();
const OpenAI = require('openai');
const auth = require('../middleware/auth');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/generate', auth, async (req, res) => {
  const { topic, numCards } = req.body;
  try {
    const prompt = `Generate ${numCards} flashcards about "${topic}". Format: Q: ... A: ...`;

    // For OpenAI v4+
    const aiRes = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: 1000
    });

    // Parse flashcards from aiRes.choices[0].message.content
    const lines = aiRes.choices[0].message.content.split('\n');
    let cards = [];
    for (let i = 0; i < lines.length; i++) {
      if(lines[i].startsWith("Q:")) {
        const question = lines[i].replace("Q:", "").trim();
        const answer = lines[i+1] && lines[i+1].startsWith("A:") ? lines[i+1].replace("A:", "").trim() : "";
        if(question && answer) cards.push({ question, answer });
      }
    }
    res.json(cards);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;