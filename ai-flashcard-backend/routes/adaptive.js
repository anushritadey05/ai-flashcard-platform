const router = require('express').Router();
const Session = require('../models/Session');
const Flashcard = require('../models/Flashcard');
const auth = require('../middleware/auth');

router.get('/next', auth, async (req, res) => {
  const cards = await Flashcard.find({ owner: req.userId });
  const sessions = await Session.find({ user: req.userId });
  const stats = {};
  cards.forEach(card => { stats[card._id] = { correct: 0, total: 0, card }; });
  sessions.forEach(session => {
    if (stats[session.card]) {
      stats[session.card].total += 1;
      if (session.correct) stats[session.card].correct += 1;
    }
  });
  const sorted = Object.values(stats)
    .sort((a, b) => {
      const ratioA = a.total ? a.correct / a.total : 0;
      const ratioB = b.total ? b.correct / b.total : 0;
      if (ratioA !== ratioB) return ratioA - ratioB;
      return a.total - b.total;
    })
    .map(s => s.card);
  res.json(sorted.slice(0, 5));
});

module.exports = router;