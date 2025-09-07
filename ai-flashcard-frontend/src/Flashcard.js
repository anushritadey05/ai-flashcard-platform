import React, { useState } from 'react';
import './Flashcard.css';

export default function Flashcard({ card }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(f => !f)}>
      <div className="front">{card.question}</div>
      <div className="back">{card.answer}</div>
    </div>
  );
}