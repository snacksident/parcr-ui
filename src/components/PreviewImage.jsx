import React from 'react';
import Button from './Button';

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
        <Button
          onClick={onRetake}
        >
          Retake
        </Button>
        <Button
          onClick={onAccept}
        >
          Accept
        </Button>
      </div>
    </div>
  );
}