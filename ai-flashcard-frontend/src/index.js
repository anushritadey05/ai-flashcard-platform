import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider, AuthContext } from './AuthContext';
import LoginSignup from './LoginSignup';

function Root() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}

function AuthGate() {
  const { token } = React.useContext(AuthContext);
  return token ? <App /> : <LoginSignup />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);