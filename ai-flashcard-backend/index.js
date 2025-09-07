const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('API Running!'));

const authRoutes = require('./routes/auth');
const flashcardRoutes = require('./routes/flashcard');
const aiRoutes = require('./routes/ai');
const sessionRoutes = require('./routes/session');
const adaptiveRoutes = require('./routes/adaptive');

app.use('/api/auth', authRoutes);
app.use('/api/flashcard', flashcardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/adaptive', adaptiveRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));