import React from 'react';

export default function Overlay({ overlaySrc, useOverlay }) {
  if (!useOverlay || !overlaySrc) return null; // Don't render if overlay is disabled or not provided

  return (
    <img
      src={overlaySrc}
      alt="Overlay"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        zIndex: 2,
        pointerEvents: 'none',
        opacity: 0.3, // Adjust transparency
      }}
    />
  );
}