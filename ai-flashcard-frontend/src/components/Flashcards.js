import React, { useState, useEffect } from "react";

const API = "http://localhost:5000/api";

export default function Flashcards({ token, setToken }) {
  const [cards, setCards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [aiTopic, setAiTopic] = useState("");
  const [aiNum, setAiNum] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/flashcard`, {
      headers: { Authorization: token },
    })
      .then(res => res.json())
      .then(setCards);
  }, [token]);

  async function addFlashcard(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${API}/flashcard`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, answer }),
    });
    const data = await res.json();
    setCards([...cards, data]);
    setQuestion("");
    setAnswer("");
    setLoading(false);
  }

  async function generateAI(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${API}/ai/generate`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic: aiTopic, numCards: aiNum }),
    });
    const data = await res.json();
    for (let card of data) {
      await fetch(`${API}/flashcard`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(card),
      });
    }
    fetch(`${API}/flashcard`, {
      headers: { Authorization: token },
    })
      .then(res => res.json())
      .then(setCards);
    setAiTopic("");
    setLoading(false);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return (
    <div>
      <button onClick={logout} style={{ float: "right", marginTop: -40 }}>
        Logout
      </button>
      <h2>Your Flashcards</h2>
      <ul>
        {cards.map((c, i) => (
          <li key={c._id || i}>
            <strong>Q:</strong> {c.question}
            <br />
            <strong>A:</strong> {c.answer}
          </li>
        ))}
        {cards.length === 0 && <li>No flashcards yet.</li>}
      </ul>
      <hr />
      <h3>Add Flashcard</h3>
      <form onSubmit={addFlashcard}>
        <input
          required
          placeholder="Question"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <input
          required
          placeholder="Answer"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          Add
        </button>
      </form>
      <hr />
      <h3>Generate with AI</h3>
      <form onSubmit={generateAI}>
        <input
          required
          placeholder="Topic (e.g. Biology)"
          value={aiTopic}
          onChange={e => setAiTopic(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <input
          required
          type="number"
          min="1"
          max="20"
          value={aiNum}
          onChange={e => setAiNum(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          Generate Flashcards with AI
        </button>
      </form>
      {loading && <div>Loading...</div>}
    </div>
  );
}