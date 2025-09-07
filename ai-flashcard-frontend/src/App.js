import React, { useState, useEffect } from "react";
import "./App.css";

// --- Login/Signup Component ---
function AuthForm({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      setToken(data.token);
    } else {
      setError(data.error || "Invalid credentials");
    }
  };

  return (
    <div className="add-form">
      <h2 style={{ textAlign: "center", color: "#3c65bb" }}>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" style={{ width: "100%", marginBottom: 8 }}>
          {isLogin ? "Login" : "Sign Up"}
        </button>
        <button
          type="button"
          onClick={() => { setIsLogin(!isLogin); setError(""); }}
          style={{ width: "100%", background: "#eee", marginBottom: 8 }}
        >
          {isLogin ? "Create an account" : "Already have an account? Login"}
        </button>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
}

// --- Main Flashcards & Decks Page ---
function FlashcardsPage({ token, setToken, darkMode, setDarkMode }) {
  // Decks
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState("");
  const [newDeckName, setNewDeckName] = useState("");
  const [deckEditMode, setDeckEditMode] = useState({});
  const [deckEditValue, setDeckEditValue] = useState({});

  // Flashcards
  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [flipped, setFlipped] = useState({});
  const [editMode, setEditMode] = useState({});
  const [editValues, setEditValues] = useState({});

  // Fetch decks
  useEffect(() => {
    fetch("/api/decks", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setDecks(data));
  }, [token]);

  // Fetch flashcards for selected deck
  useEffect(() => {
    if (!selectedDeck) {
      setFlashcards([]);
      return;
    }
    fetch(`/api/decks/${selectedDeck}/flashcards`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setFlashcards(data);
        setFlipped(data.reduce((acc, card) => { acc[card._id] = false; return acc; }, {}));
        setEditMode(data.reduce((acc, card) => { acc[card._id] = false; return acc; }, {}));
        setEditValues({});
      });
  }, [selectedDeck, token]);

  // Add deck
  const handleAddDeck = async (e) => {
    e.preventDefault();
    if (!newDeckName.trim()) return;
    const res = await fetch("/api/decks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: newDeckName })
    });
    const data = await res.json();
    setDecks([...decks, data]);
    setNewDeckName("");
    setSelectedDeck(data._id);
  };

  // Edit deck
  const startEditDeck = (deck) => {
    setDeckEditMode({ ...deckEditMode, [deck._id]: true });
    setDeckEditValue({ ...deckEditValue, [deck._id]: deck.name });
  };
  const saveEditDeck = async (deckId) => {
    const res = await fetch(`/api/decks/${deckId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: deckEditValue[deckId] })
    });
    const data = await res.json();
    setDecks(decks.map(d => d._id === deckId ? data : d));
    setDeckEditMode({ ...deckEditMode, [deckId]: false });
  };
  const cancelEditDeck = (deckId) => {
    setDeckEditMode({ ...deckEditMode, [deckId]: false });
  };

  // Delete deck
  const handleDeleteDeck = async (deckId) => {
    await fetch(`/api/decks/${deckId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    setDecks(decks.filter(d => d._id !== deckId));
    if (selectedDeck === deckId) setSelectedDeck("");
  };

  // Add flashcard
  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    const body = {
      question,
      answer,
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
    };
    const res = await fetch(`/api/decks/${selectedDeck}/flashcards`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (res.ok && data._id) {
      setFlashcards([...flashcards, data]);
      setQuestion("");
      setAnswer("");
      setTags("");
    } else {
      setError(data.error || "Failed to add flashcard");
    }
  };

  // Delete flashcard
  const handleDelete = async (id) => {
    await fetch(`/api/flashcards/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    setFlashcards(flashcards.filter(card => card._id !== id));
  };

  // Flip card
  const handleFlip = (id) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Edit mode toggle
  const startEdit = (card) => {
    setEditMode(prev => ({ ...prev, [card._id]: true }));
    setEditValues(prev => ({
      ...prev,
      [card._id]: {
        question: card.question,
        answer: card.answer,
        tags: card.tags ? card.tags.join(", ") : ""
      }
    }));
  };
  const cancelEdit = (id) => {
    setEditMode(prev => ({ ...prev, [id]: false }));
    setEditValues(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };
  const handleEditChange = (id, field, value) => {
    setEditValues(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };
  const saveEdit = async (id) => {
    const { question, answer, tags } = editValues[id];
    const body = {
      question,
      answer,
      tags: tags.split(",").map(t => t.trim())
    };
    const res = await fetch(`/api/flashcards/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (res.ok) {
      setFlashcards(flashcards.map(card => (card._id === id ? data : card)));
      cancelEdit(id);
    } else {
      setError(data.error || "Failed to edit flashcard");
    }
  };

  // Toggle learned/unlearned
  const handleToggleLearned = async (id) => {
    const res = await fetch(`/api/flashcards/${id}/learned`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) {
      setFlashcards(flashcards.map(card => (card._id === id ? data : card)));
    } else {
      setError(data.error || "Failed to toggle learned status");
    }
  };

  // UI: Deck selection + add/edit/delete
  return (
    <div className={darkMode ? "dark-mode" : ""} style={{ maxWidth: 1100, margin: "2rem auto" }}>
      <h1 style={{ textAlign: "center" }}>My Flashcards</h1>
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          float: "left",
          marginTop: "-2.5rem",
          marginBottom: "1rem",
          marginRight: "1rem"
        }}
      >
        {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>
      <button onClick={() => setToken("")} style={{ float: "right", marginTop: "-2.5rem", marginBottom: "1rem" }}>Logout</button>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap" }}>
        <div>
          <h2 style={{ marginBottom: "0.5rem", color: "#3c65bb" }}>Decks</h2>
          <ul style={{ padding: 0, listStyle: "none" }}>
            {decks.map(deck => (
              <li key={deck._id} style={{ marginBottom: "0.5rem" }}>
                {deckEditMode[deck._id] ? (
                  <>
                    <input
                      value={deckEditValue[deck._id]}
                      onChange={e => setDeckEditValue({ ...deckEditValue, [deck._id]: e.target.value })}
                      style={{ width: 110, marginRight: 4 }}
                    />
                    <button onClick={() => saveEditDeck(deck._id)} style={{ background: "#e6eeff" }}>Save</button>
                    <button onClick={() => cancelEditDeck(deck._id)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button
                      style={{
                        background: selectedDeck === deck._id ? "#3c65bb" : "#eee",
                        color: selectedDeck === deck._id ? "#fff" : "#333",
                        minWidth: 60,
                        marginRight: 4
                      }}
                      onClick={() => setSelectedDeck(deck._id)}
                    >
                      {deck.name}
                    </button>
                    <button onClick={() => startEditDeck(deck)} style={{ background: "#e3e3ff" }}>Edit</button>
                    <button onClick={() => handleDeleteDeck(deck._id)} style={{ background: "#ffdddd" }}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddDeck} style={{ marginTop: "1rem" }}>
            <input
              value={newDeckName}
              onChange={e => setNewDeckName(e.target.value)}
              placeholder="New deck name"
              style={{ width: 110, marginRight: 4 }}
            />
            <button type="submit">Add Deck</button>
          </form>
        </div>
        <div style={{ flex: 1 }}>
          {selectedDeck ? (
            <>
              <h2 style={{ marginBottom: "0.5rem", color: "#3c65bb" }}>
                Deck: {decks.find(d => d._id === selectedDeck)?.name || ""}
              </h2>
              <form className="add-form" onSubmit={handleAdd} style={{ marginBottom: "2rem" }}>
                <input
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder="Question"
                  required
                />
                <input
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="Answer"
                  required
                />
                <input
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="Tags (comma separated)"
                />
                <button type="submit">Add Flashcard</button>
              </form>
              {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
              <div className="flashcard-grid">
                {flashcards.map(card => (
                  <div
                    key={card._id}
                    className={`flashcard${flipped[card._id] ? " flipped" : ""}`}
                  >
                    {/* Edit mode */}
                    {editMode[card._id] ? (
                      <div className="flashcard-inner" style={{
                        boxShadow: "0 2px 8px rgba(60,101,187,0.14)",
                        background: "#fff",
                        padding: "1rem",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center"
                      }}>
                        <input
                          value={editValues[card._id].question}
                          onChange={e => handleEditChange(card._id, "question", e.target.value)}
                          style={{ marginBottom: 8 }}
                        />
                        <input
                          value={editValues[card._id].answer}
                          onChange={e => handleEditChange(card._id, "answer", e.target.value)}
                          style={{ marginBottom: 8 }}
                        />
                        <input
                          value={editValues[card._id].tags}
                          onChange={e => handleEditChange(card._id, "tags", e.target.value)}
                          style={{ marginBottom: 8 }}
                        />
                        <div className="flashcard-actions">
                          <button onClick={() => saveEdit(card._id)} style={{ background: "#e6eeff" }}>Save</button>
                          <button onClick={() => cancelEdit(card._id)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flashcard-inner" onClick={() => handleFlip(card._id)}>
                        {/* Front side */}
                        <div className="flashcard-front">
                          <div>{card.question}</div>
                          <div className="flashcard-tags">
                            {card.tags && card.tags.length > 0 ? `[${card.tags.join(", ")}]` : ""}
                          </div>
                          <div className="flashcard-actions">
                            <button
                              style={{
                                background: card.learned ? "#d4ffd4" : "#ffd",
                              }}
                              onClick={e => {
                                e.stopPropagation();
                                handleToggleLearned(card._id);
                              }}
                            >
                              {card.learned ? "Mark Unlearned" : "Mark Learned"}
                            </button>
                            <button
                              style={{ background: "#e3e3ff" }}
                              onClick={e => {
                                e.stopPropagation();
                                startEdit(card);
                              }}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                        {/* Back side */}
                        <div className="flashcard-back">
                          {card.answer}
                          <button
                            style={{
                              marginTop: "1rem",
                              background: "#ffdddd",
                            }}
                            onClick={e => {
                              e.stopPropagation();
                              handleDelete(card._id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {flashcards.length === 0 && <div style={{ textAlign: "center", margin: "2rem", color: "#666" }}>No flashcards in this deck yet.</div>}
            </>
          ) : (
            <div style={{ marginTop: "3rem", textAlign: "center", color: "#888" }}>
              Select a deck to view its flashcards.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Main App Component ---
function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      {token
        ? <FlashcardsPage token={token} setToken={setToken} darkMode={darkMode} setDarkMode={setDarkMode} />
        : <AuthForm setToken={setToken} />
      }
    </div>
  );
}

export default App;