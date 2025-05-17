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
        }), {})

      console.log('Initial Form Data:', initialFormData);
      setFormData(initialFormData);
    }
  }, [clubData])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Update the requiredFields with new values
    const updatedRequiredFields = Object.entries(clubData.requiredFields)
      .reduce((acc, [key, field]) => ({
        ...acc,
        [key]: {
          ...field,
          currentValue: formData[key] || field.currentValue
        }
      }), {})

    // Add location_tag and additional_notes to requiredFields if they don't exist
    if (formData.location_tag) {
      updatedRequiredFields.location_tag = {
        key: 'location_tag',
        type: 'single_line_text_field',
        namespace: 'custom',
        currentValue: formData.location_tag
      }
    }

    // Update clubData with all values
    updateClubData({
      ...clubData,
      requiredFields: updatedRequiredFields,
      preservedFields: {
        ...clubData.preservedFields,
        additionalNotes: formData.additional_notes || '' // Store additional notes in preservedFields
      }
    })

    console.log('Submitting data:', {
      requiredFields: updatedRequiredFields,
      preservedFields: clubData.preservedFields,
      formData
    })

    navigate('/submission-details');
  }

  const renderRequiredFields = () => {
    if (!clubData?.requiredFields) return null

    return Object.entries(clubData.requiredFields).map(([key, field]) => {
      // Skip if field is undefined
      if (!field || key === 'handedness') return null

      const displayLabel = field.key ? field.key.replace(/_/g, ' ').toUpperCase() : key.replace(/_/g, ' ').toUpperCase()

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
      )
    })
  }

  if (!clubData?.requiredFields || Object.keys(clubData.requiredFields).length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>No Template Found</h1>
        <p>Please scan a valid club barcode first.</p>
      </div>
    );
  }

  const styles = {
    container: {
      padding: '1rem',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      color: '#333333',
      minHeight: '100vh'
    },
    header: {
      fontSize: '1.75rem',
      fontWeight: '600',
      marginBottom: '1.5rem',
      color: '#1a1a1a',
      textAlign: 'center'
    },
    section: {
      marginBottom: '2rem',
      backgroundColor: '#f8f9fa',
      padding: '1.25rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    sectionHeader: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1rem',
      color: '#2c3e50',
      textAlign: 'left'
    },
    infoRow: {
      marginBottom: '0.75rem',
      fontSize: '1rem',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    label: {
      fontWeight: '600',
      marginRight: '0.5rem',
      color: '#2c3e50',
      minWidth: '120px'
    },
    value: {
      color: '#4a5568'
    },
    formField: {
      marginBottom: '1.25rem'
    },
    inputLabel: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: '#2c3e50',
      fontSize: '0.95rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '6px',
      border: '1px solid #cbd5e0',
      fontSize: '1rem',
      backgroundColor: '#ffffff',
      color: '#2d3748',
      transition: 'border-color 0.2s ease',
      '&:focus': {
        borderColor: '#4299e1',
        outline: 'none'
      }
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '6px',
      border: '1px solid #cbd5e0',
      fontSize: '1rem',
      backgroundColor: '#ffffff',
      color: '#2d3748',
      minHeight: '100px',
      resize: 'vertical'
    },
    submitButton: {
      width: '100%',
      padding: '1rem',
      backgroundColor: '#3182ce',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      '&:hover': {
        backgroundColor: '#2c5282'
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Enter Specifications</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Club Info Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionHeader}>Club Information</h3>
          <div style={styles.infoRow}>
            <span style={styles.label}>SKU:</span>
            <span style={styles.value}>{clubData.sku}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Type:</span>
            <span style={styles.value}>{clubData.productType}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Manufacturer:</span>
            <span style={styles.value}>{clubData.manufacturer}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Model:</span>
            <span style={styles.value}>{clubData.model}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Handedness:</span>
            <span style={styles.value}>{clubData.requiredFields?.handedness || 'N/A'}</span>
          </div>
        </div>

        {/* Required Fields Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionHeader}>Required Specifications</h3>
          {renderRequiredFields()}
        </div>

        {/* Additional Information Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionHeader}>Additional Information</h3>
          <div style={styles.formField}>
            <label htmlFor="location_tag" style={styles.inputLabel}>
              LOCATION TAG:
            </label>
            <input
              type="text"
              id="location_tag"
              name="location_tag"
              value={formData.location_tag || ''}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>
        </div>

        {/* Additional Notes Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionHeader}>Additional Notes</h3>
          <div style={styles.formField}>
            <label htmlFor="additional_notes" style={styles.inputLabel}>
              ADDITIONAL NOTES:
            </label>
            <textarea
              id="additional_notes"
              name="additional_notes"
              value={formData.additional_notes || ''}
              onChange={handleInputChange}
              style={styles.textarea}
              placeholder="Enter any additional notes about this club..."
            />
          </div>
        </div>

        <button type="submit" style={styles.submitButton}>
          Review And Upload
        </button>
      </form>
    </div>
  );
}
