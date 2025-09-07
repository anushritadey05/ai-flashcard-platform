import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';

export default function LoginSignup() {
  const { setToken } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.token) setToken(data.token);
    else setError(data.error || 'Failed');
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h3>{isLogin ? 'Login' : 'Sign Up'}</h3>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        <button type="button" onClick={() => setIsLogin(l => !l)}>
          {isLogin ? 'Create Account' : 'Already have account?'}
        </button>
        {error && <div className="auth-error">{error}</div>}
      </form>
    </div>
  );
}