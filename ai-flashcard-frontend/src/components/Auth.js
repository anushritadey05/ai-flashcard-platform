import React, { useState } from "react";

const API = "http://localhost:5000/api/auth";

export default function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const endpoint = isLogin ? "login" : "register";
    const res = await fetch(`${API}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    } else if (data.message) {
      setError(data.message);
      setIsLogin(true);
    } else {
      setError(data.error || "Error");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <input
        required
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        required
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <button type="submit" style={{ width: "100%" }}>
        {isLogin ? "Login" : "Register"}
      </button>
      <div style={{ margin: "8px 0" }}>
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          style={{ width: "100%" }}
        >
          {isLogin ? "Need to Register?" : "Have an account? Login"}
        </button>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}