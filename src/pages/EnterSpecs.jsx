import React, { useState } from 'react';
import { useClubData } from '../hooks/useClubData';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import clubTypes from '../config/clubTypes.json';

/**
 * 
 * THE ENTER SPECS PAGE WILL ALLOW THE USER TO ENTER SPECS FOR THE CLUB TH4Y ARE CURRENTLY PROCESSING.
 * WE WILL REACH OUT TO SHOPIFY TO DETERMINE WHICH SPECS ARE REQUIRED FOR THE CLUB TYPE.
 */
export default function EnterSpecs() {
  const { clubData, updateClubData } = useClubData();
  const { images = [], sku } = clubData;
  const navigate = useNavigate();

  const [selectedClubType, setSelectedClubType] = useState(null);

  const handleClubTypeSelect = (type) => {
    setSelectedClubType(type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const specs = Object.fromEntries(formData.entries());
    updateClubData({ specs });
    navigate('/submission-details', { state: { payload: { ...clubData, specs } } });
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
            <Button
              key={index}
              onClick={() => handleClubTypeSelect(club.type)}
            >
              {club.type}
            </Button>
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
          <Button
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
          </Button>
        </form>
      )}
    </div>
  );
}
