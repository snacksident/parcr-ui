import React, { useState } from 'react';

export default function OverlaySelector({ onSelectOverlay }) {
  const wedgeImages = [
    '/src/assets/wedge1.webp',
    '/src/assets/wedge2.webp',
    '/src/assets/wedge3.webp',
    '/src/assets/wedge4.webp',
    '/src/assets/wedge5.webp',
    '/src/assets/wedge6.webp',
    '/src/assets/wedge7.webp',
    '/src/assets/wedge8.webp',
  ];

  const [selectedOverlay, setSelectedOverlay] = useState(null);

  const handleSelect = (image) => {
    setSelectedOverlay(image);
    if (onSelectOverlay) onSelectOverlay(image); // Pass the selected overlay to the parent
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      {wedgeImages.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Wedge ${index + 1}`}
          onClick={() => handleSelect(image)}
          style={{
            width: '100px',
            height: '100px',
            objectFit: 'contain',
            cursor: 'pointer',
            border: selectedOverlay === image ? '2px solid blue' : '2px solid transparent',
          }}
        />
      ))}
    </div>
  );
}