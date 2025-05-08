import React from 'react'

export default function Overlay({ clubType, step }) {
  if (!clubType) return null; // Don't render if club type is not provided

  // Construct the overlay image path dynamically
  const overlaySrc = `/assets/${clubType}/${step}.jpg`

  return (
    <img
      src={overlaySrc}
      alt={`Overlay for ${clubType} - Step ${step}`}
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
  )
}