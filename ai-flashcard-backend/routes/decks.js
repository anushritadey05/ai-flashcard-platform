const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const router = express.Router();

const DeckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});
const Deck = mongoose.models.Deck || mongoose.model('Deck', DeckSchema);

// Get all decks for user
router.get('/', auth, async (req, res) => {
  const decks = await Deck.find({ user: req.user.id });
  res.json(decks);
});

// Add new deck
router.post('/', auth, async (req, res) => {
  const deck = new Deck({ name: req.body.name, user: req.user.id });
  await deck.save();
  res.json(deck);
});

// Edit deck name
router.put('/:id', auth, async (req, res) => {
  const deck = await Deck.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { name: req.body.name },
    { new: true }
  );
  res.json(deck);
});

// Delete deck
router.delete('/:id', auth, async (req, res) => {
  await Deck.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.json({ success: true });
});

module.exports = router;