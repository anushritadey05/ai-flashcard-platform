const router = require('express').Router();
const Session = require('../models/Session');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const { card, correct } = req.body;
  const session = new Session({ user: req.userId, card, correct });
  await session.save();
  res.json(session);
});

router.get('/', auth, async (req, res) => {
  const sessions = await Session.find({ user: req.userId }).populate('card');
  res.json(sessions);
});

module.exports = router;