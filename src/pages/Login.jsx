import React from 'react';
import { useNavigate } from 'react-router-dom';
/**
 * 
 * THE LOGIN PAGE WILL TAKE A USERNAME AND PASSWORD, USING THE USERNAME AS 'INITIALS' WHEN CREATING LISTINGS ON SHOPIFY.
 */
export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // TODO: Auth later
    navigate('/scan')
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login (Placeholder)</button>
    </div>
  );
}
