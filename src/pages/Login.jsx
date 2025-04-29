import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // TODO: Auth later
    navigate('/scan');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login (Placeholder)</button>
    </div>
  );
}
