import React, { useState } from 'react'
import { useClubData } from '../hooks/useClubData'
import { useNavigate } from 'react-router-dom'
import { fieldConfigs } from '../utils/fieldConfigs'
import Button from '../components/Button'

export default function EnterSpecs() {
  const { clubData, updateClubData } = useClubData()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({})

  const sku = clubData?.sku || ''
  const images = clubData?.images || []
  const clubType = clubData?.type || ''

  const getClubFieldsByType = (type) => {
    const clubFields = {
      driver: ['condition', 'manufacturer', 'model', 'flex', 'loft', 'shaft make/model', 'shaft material', 'club length', 'grip make/model/size', 'handedness', 'club type', 'club number', 'initials', 'custom label'],
      fairway: ['condition', 'manufacturer', 'model', 'flex', 'loft', 'shaft make/model', 'shaft material', 'club length', 'grip make/model/size', 'handedness', 'club type', 'club number', 'initials', 'custom label'],
      hybrid: ['condition', 'manufacturer', 'model', 'flex', 'loft', 'shaft make/model', 'shaft material', 'club length', 'grip make/model/size', 'handedness', 'club type', 'club number', 'initials', 'custom label'],
      iron: ['condition', 'manufacturer', 'model', 'flex', 'loft', 'shaft make/model', 'shaft material', 'club length', 'grip make/model/size', 'handedness', 'club type', 'club number', 'initials', 'custom label'],
      wedge: ['condition', 'manufacturer', 'model', 'flex', 'loft', 'shaft make/model', 'shaft material', 'club length', 'grip make/model/size', 'handedness', 'club type', 'club number', 'bounce', 'initials', 'custom label'],
      putter: ['condition', 'manufacturer', 'model', 'shaft make/model', 'grip make/model/size', 'club length', 'handedness', 'club type', 'club number', 'additional notes', 'custom label'],
      shaft: ['brand', 'model'],
      item: ['brand']
    }
    return clubFields[type] || [];
  }

  const fields = getClubFieldsByType(clubType)

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderField = (field) => {
    const config = fieldConfigs[field] || { type: 'text' }

    switch (config.type) {
      case 'select':
        return (
          <select
            name={field}
            value={formData[field] || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          >
            <option value="">Select {field}</option>
            {config.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )

      case 'autocomplete':
        return (
          <input
            list={`${field}-list`}
            name={field}
            value={formData[field] || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        )

      case 'number':
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="number"
              name={field}
              value={formData[field] || ''}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              min={config.min}
              max={config.max}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
            {config.suffix && (
              <span style={{ marginLeft: '0.5rem' }}>{config.suffix}</span>
            )}
          </div>
        )

      default:
        return (
          <input
            type="text"
            name={field}
            value={formData[field] || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            required
            placeholder={`Enter ${field.toLowerCase()}`}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        )
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    updateClubData({ specs: formData });
    navigate('/submission-details', { state: { payload: { ...clubData, specs: formData } } });
  }

  return (
    <div style={{
      height: '100vh',
      width: '100%',
      padding: '1rem',
      background: '#f5f5f5',
      overflowY: 'auto',
    }}>
      <h1>Enter Specifications</h1>
      <div style={{ marginBottom: '1rem' }}>
        <p><strong>SKU:</strong> {sku}</p>
        <p><strong>Product Type:</strong> {clubType ? clubType.charAt(0).toUpperCase() + clubType.slice(1) : 'Unknown'}</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem' }}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Captured ${index + 1}`}
            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
          />
        ))}
      </div>

      {clubType ? (
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))'
          }}>
            {fields.map((field) => (
              <div 
                key={field} 
                style={{ 
                  background: 'grey',
                  padding: '1rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>

          <Button
            type="submit"
            style={{
              marginTop: '2rem',
              padding: '0.75rem 1.5rem',
              background: '#007AFF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '1rem'
            }}
          >
            Submit Specifications
          </Button>
        </form>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          background: 'white', 
          borderRadius: '8px',
          marginTop: '1rem' 
        }}>
          <p>Unable to determine product type from SKU. Please check the SKU and try again.</p>
        </div>
      )}
    </div>
  )
}
