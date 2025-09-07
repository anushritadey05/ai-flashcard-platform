const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  card: { type: mongoose.Schema.Types.ObjectId, ref: 'Flashcard' },
  date: { type: Date, default: Date.now },
  correct: Boolean
});

module.exports = mongoose.model('Session', SessionSchema);