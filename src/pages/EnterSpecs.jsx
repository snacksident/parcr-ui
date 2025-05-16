import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClubData } from '../context/GlobalStateContext'

export default function EnterSpecs() {
  const navigate = useNavigate()
  const { clubData, updateClubData } = useClubData()
  const [formData, setFormData] = useState({})

  useEffect(() => {
    console.log('Current clubData:', clubData);
    if (clubData?.requiredFields) {
      console.log('Required Fields:', clubData.requiredFields);
      // Initialize form with current values from requiredFields
      const initialFormData = Object.entries(clubData.requiredFields)
        .reduce((acc, [key, field]) => ({
          ...acc,
          [key]: field?.currentValue === 'COMING SOON' ? '' : field?.currentValue || ''
        }), {});

      console.log('Initial Form Data:', initialFormData);
      setFormData(initialFormData);
    }
  }, [clubData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update the requiredFields with new values
    const updatedRequiredFields = Object.entries(clubData.requiredFields)
      .reduce((acc, [key, field]) => ({
        ...acc,
        [key]: {
          ...field,
          currentValue: formData[key] || field.currentValue
        }
      }), {});

    // Add location_tag and additional_notes to requiredFields if they don't exist
    if (formData.location_tag) {
      updatedRequiredFields.location_tag = {
        key: 'location_tag',
        type: 'single_line_text_field',
        namespace: 'custom',
        currentValue: formData.location_tag
      };
    }

    // Update clubData with all values
    updateClubData({
      ...clubData,
      requiredFields: updatedRequiredFields,
      preservedFields: {
        ...clubData.preservedFields,
        additionalNotes: formData.additional_notes || '' // Store additional notes in preservedFields
      }
    });

    console.log('Submitting data:', {
      requiredFields: updatedRequiredFields,
      preservedFields: clubData.preservedFields,
      formData
    });

    navigate('/submission-details');
  };

  const renderRequiredFields = () => {
    if (!clubData?.requiredFields) return null;

    return Object.entries(clubData.requiredFields).map(([key, field]) => {
      // Skip if field is undefined
      if (!field || key === 'handedness') return null;

      const displayLabel = field.key ? field.key.replace(/_/g, ' ').toUpperCase() : key.replace(/_/g, ' ').toUpperCase();

      return (
        <div key={key} style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor={key}
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold'
            }}
          >
            {displayLabel}:
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
      );
    });
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
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Handedness:</strong> {clubData.requiredFields?.handedness || 'N/A'}
          </div>
        </div>

        {/* Required Fields Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Required Specifications</h3>
          {renderRequiredFields()}
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

        {/* Additional Notes Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Additional Notes</h3>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="additional_notes"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold'
              }}
            >
              ADDITIONAL NOTES:
            </label>
            <textarea
              id="additional_notes"
              name="additional_notes"
              value={formData.additional_notes || ''}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '1rem',
                minHeight: '100px',
                resize: 'vertical'
              }}
              placeholder="Enter any additional notes about this club..."
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
