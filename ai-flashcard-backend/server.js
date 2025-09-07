const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/flashcards', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Root route for sanity check
app.get('/', (req, res) => {
  res.send('API is running');
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/flashcards', require('./routes/flashcards'));
app.use('/api/decks', require('./routes/decks'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));