import React from 'react';
import { useLocation } from 'react-router-dom';

export default function EnterSpecs() {
  const location = useLocation();
  const { images } = location.state || { images: [] }; // Get images from state

  // Example club types and their corresponding form fields
  const clubTypes = [
    { type: 'driver', fields: ['handedness', 'club number', 'loft', 'flex', 'shaft info', 'headcover', 'condition', 'grip'] },
    { type: 'iron', fields: ['handedness', 'club number', 'loft', 'flex', 'shaft info', 'headcover', 'condition', 'grip', 'bounce', 'grind'] },
    { type: 'putter', fields: ['handedness', 'length', 'grip', 'headcover'] },
    { type: 'set', fields: ['Length', 'Loft', 'Bounce'] },
  ];

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        padding: '1rem',
        background: 'gray',
        overflowY: 'auto',
      }}
    >
      <h1>Enter Specifications</h1>
      <p>Fill out the specifications for the captured club images:</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem' }}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Captured ${index + 1}`}
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
        ))}
      </div>
      <form>
        {clubTypes.map((club, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <h3>{club.type} Specifications</h3>
            {club.fields.map((field, fieldIndex) => (
              <div key={fieldIndex} style={{ marginBottom: '0.5rem' }}>
                <label>
                  {field}:
                  <input
                    type="text"
                    placeholder={`Enter ${field.toLowerCase()}`}
                    style={{ marginLeft: '10px' }}
                  />
                </label>
              </div>
            ))}
          </div>
        ))}
        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem',
            background: 'green',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
