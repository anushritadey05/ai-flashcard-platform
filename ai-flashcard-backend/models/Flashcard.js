const mongoose = require('mongoose');
const FlashcardSchema = new mongoose.Schema({
  question: String,
  answer: String,
  tags: [String],
  learned: { type: Boolean, default: false },
  deck: { type: mongoose.Schema.Types.ObjectId, ref: 'Deck' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // for authentication
});
module.exports = mongoose.model('Flashcard', FlashcardSchema);