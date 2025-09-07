const express = require('express');
const Flashcard = require('../models/Flashcard');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all flashcards for the logged-in user (optionally by deck)
router.get('/', auth, async (req, res) => {
  try {
    const query = { user: req.user.id };
    if (req.query.deck) query.deck = req.query.deck;
    const flashcards = await Flashcard.find(query);
    res.json(flashcards);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flashcards.' });
  }
});

// Add a flashcard
router.post('/', auth, async (req, res) => {
  try {
    const { question, answer, tags, deck } = req.body;
    const flashcard = new Flashcard({
      question,
      answer,
      tags,
      deck,
      user: req.user.id,
    });
    await flashcard.save();
    res.status(201).json(flashcard);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create flashcard.' });
  }
});

// Edit a flashcard
router.put('/:id', auth, async (req, res) => {
  try {
    const { question, answer, tags, deck } = req.body;
    const updatedCard = await Flashcard.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { question, answer, tags, deck },
      { new: true }
    );
    if (!updatedCard) return res.status(404).json({ error: 'Flashcard not found.' });
    res.json(updatedCard);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update flashcard.' });
  }
});

// Delete a flashcard
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Flashcard.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ error: 'Flashcard not found.' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete flashcard.' });
  }
});

// Toggle learned/unlearned
router.put('/:id/learned', auth, async (req, res) => {
  try {
    const card = await Flashcard.findOne({ _id: req.params.id, user: req.user.id });
    if (!card) return res.status(404).json({ error: 'Flashcard not found.' });
    card.learned = !card.learned;
    await card.save();
    res.json(card);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update learned status.' });
  }
});

module.exports = router;