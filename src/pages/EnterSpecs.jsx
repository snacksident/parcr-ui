import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClubData } from '../context/GlobalStateContext'

export default function EnterSpecs() {
  const navigate = useNavigate()
  const { clubData, updateClubData } = useClubData()
  const [formData, setFormData] = useState({})

  console.log(clubData)

  // Initialize form with required fields
  useEffect(() => {
    console.log('Current clubData:', clubData);
    
    if (clubData?.requiredFields) {
      // Convert requiredFields to initial form values
      const initialFormData = Object.entries(clubData.requiredFields)
        .reduce((acc, [key, field]) => ({
          ...acc,
          [key]: field.currentValue === 'COMING SOON' ? '' : field.currentValue
        }), {});

      setFormData(initialFormData);
      console.log('Initialized form with fields:', initialFormData);
    }
  }, [clubData]); // Watch entire clubData object

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update clubData with form values
    updateClubData({
      ...clubData,
      specs: {
        ...clubData.specs,
        ...formData
      }
    });

    // Log the updated data
    console.log('Updated clubData before navigation:', clubData);

    // Navigate to submission details
    navigate('/submission-details');
  };

  if (!clubData?.requiredFields || Object.keys(clubData.requiredFields).length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>No Template Found</h1>
        <p>Please scan a valid club barcode first.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Enter Specifications</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Club Info Section */}
        <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Club Information</h3>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>SKU:</strong> {clubData.sku}
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Type:</strong> {clubData.productType}
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Manufacturer:</strong> {clubData.manufacturer}
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Model:</strong> {clubData.model}
          </div>
        </div>

        {/* Required Fields Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Required Specifications</h3>
          {Object.entries(clubData.requiredFields || {}).map(([key, field]) => (
            <div key={key} style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor={key}
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 'bold'
                }}
              >
                {field.key.replace(/_/g, ' ').toUpperCase()}:
              </label>
              <input
                type="text"
                id={key}
                name={key}
                value={formData[key] || ''}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '1rem'
                }}
              />
            </div>
          ))}
        </div>

        {/* Additional Information Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Additional Information</h3>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="location_tag"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold'
              }}
            >
              LOCATION TAG:
            </label>
            <input
              type="text"
              id="location_tag"
              name="location_tag"
              value={formData.location_tag || ''}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            background: '#007AFF',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            border: 'none',
            fontSize: '1.1rem',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Review And Upload
        </button>
      </form>
    </div>
  );
}
