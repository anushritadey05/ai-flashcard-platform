const mongoose = require('mongoose');
const DeckSchema = new mongoose.Schema({
  name: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // for authentication
});
module.exports = mongoose.model('Deck', DeckSchema);