import React, { useState } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useNavigate } from 'react-router-dom';

export default function EnterSpecs() {
  const { clubData, setClubData } = useGlobalState();
  const { images = [], sku } = clubData;
  const navigate = useNavigate();

  const clubTypes = [
    { type: 'driver', fields: ['handedness', 'club number', 'loft', 'flex', 'shaft info', 'headcover', 'condition', 'grip'] },
    { type: 'iron', fields: ['handedness', 'club number', 'loft', 'flex', 'shaft info', 'headcover', 'condition', 'grip', 'bounce', 'grind'] },
    { type: 'putter', fields: ['handedness', 'length', 'grip', 'headcover'] },
    { type: 'set', fields: ['length', 'loft', 'bounce'] },
    { type: 'shaft', fields: ['flex', 'material', 'length', 'condition'] },
    { type: 'head', fields: ['type', 'loft', 'condition'] },
  ];

  const [selectedClubType, setSelectedClubType] = useState(null);

  const handleClubTypeSelect = (type) => {
    setSelectedClubType(type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const specs = Object.fromEntries(formData.entries());
    const updatedClubData = { ...clubData, specs };
    setClubData(updatedClubData);

    // Navigate to SubmissionDetails with the updated club data
    navigate('/submission-details', { state: { payload: updatedClubData } });
  };

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
      <p>SKU: {sku}</p>
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

      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <p>Select the type of club you are working on:</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {clubTypes.map((club, index) => (
            <button
              key={index}
              onClick={() => handleClubTypeSelect(club.type)}
              style={{
                padding: '0.5rem 1rem',
                background: selectedClubType === club.type ? 'blue' : 'green',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {club.type}
            </button>
          ))}
        </div>
      </div>

      {selectedClubType && (
        <form onSubmit={handleSubmit}>
          <h3>{selectedClubType.charAt(0).toUpperCase() + selectedClubType.slice(1)} Specifications</h3>
          {clubTypes
            .find((club) => club.type === selectedClubType)
            .fields.map((field, fieldIndex) => (
              <div key={fieldIndex} style={{ marginBottom: '0.5rem' }}>
                <label>
                  {field}:
                  <input
                    name={field}
                    type="text"
                    placeholder={`Enter ${field.toLowerCase()}`}
                    style={{ marginLeft: '10px' }}
                  />
                </label>
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
      )}
    </div>
  );
}
