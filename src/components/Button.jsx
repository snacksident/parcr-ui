import React from 'react';

export default function Button({ onClick, children, className }) {
  return (
    <button onClick={onClick} className={`button ${className}`}>
      {children}
    </button>
  );
}