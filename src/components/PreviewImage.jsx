import React from 'react';

export default function PreviewImage({ imageSrc, onRetake, onAccept }) {
  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
      }}
    >
      <p>Preview:</p>
      <img
        src={imageSrc}
        alt="Captured"
        style={{ maxWidth: '90%', maxHeight: '70%', marginBottom: '1rem' }}
      />
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={onRetake}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            background: 'red',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Retake
        </button>
        <button
          onClick={onAccept}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            background: 'green',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}