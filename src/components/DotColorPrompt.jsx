import React from 'react';

export const pingDotColors = [
  { color: 'Maroon', angle: '+5°', description: 'Most upright lie angle', textColor: '#800000' },
  { color: 'Silver', angle: '+4.5°', description: 'Upright', textColor: '#C0C0C0' },
  { color: 'White', angle: '+4°', description: 'Upright', textColor: '#FFFFFF' },
  { color: 'Green', angle: '+3.5°', description: 'Upright', textColor: '#008000' },
  { color: 'Blue', angle: '+3°', description: 'Upright', textColor: '#0000FF' },
  { color: 'Black', angle: '0°', description: 'Standard/Neutral lie angle', textColor: '#000000' },
  { color: 'Red', angle: '-1°', description: 'Flat', textColor: '#FF0000' },
  { color: 'Orange', angle: '-2°', description: 'Flat', textColor: '#FFA500' },
  { color: 'Brown', angle: '-3°', description: 'Flat', textColor: '#8B4513' },
  { color: 'Gold', angle: '-4°', description: 'Most flat lie angle', textColor: '#FFD700' }
];

const DotColorPrompt = ({ onSelect, onClose, selectedColor }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '600px',
        width: '90%'
      }}>
        <h3 style={{
          marginBottom: '1rem',
          fontSize: '1.25rem',
          color: '#2c3e50',
          textAlign: 'center'
        }}>
          Select PING Dot Color
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          {pingDotColors.map(dot => (
            <button
              key={dot.color}
              onClick={() => onSelect(dot)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.75rem',
                border: '1px solid #cbd5e0',
                borderRadius: '4px',
                backgroundColor: selectedColor?.color === dot.color ? '#f0f9ff' : '#ffffff',
                borderColor: selectedColor?.color === dot.color ? '#3182ce' : '#cbd5e0',
                cursor: 'pointer',
                minHeight: '80px',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{
                color: dot.textColor,
                fontWeight: 'bold',
                marginBottom: '0.25rem',
                textShadow: dot.color === 'White' ? '0 0 1px #000' : 'none'
              }}>
                {dot.color}
              </span>
              <span style={{
                fontSize: '0.9rem',
                color: '#4a5568'
              }}>
                {dot.angle}
              </span>
              <span style={{
                fontSize: '0.8rem',
                color: '#718096',
                textAlign: 'center'
              }}>
                {dot.description}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default DotColorPrompt;