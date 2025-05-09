import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useClubData } from '../hooks/useClubData'
import axios from 'axios'

const baseUrl = 'https://parcr-backend.onrender.com/api'

export default function SubmissionDetails() {
  const location = useLocation()
  const navigate = useNavigate()
  const { resetClubData } = useClubData()
  const payload = location.state?.payload
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState(null)

  const transformDataForShopify = (payload) => {
    if (!payload || !payload.specs) {
      throw new Error('Invalid payload data');
    }

    const specs = {
      custom_label: payload.specs['custom label'] || '',
      initials: payload.specs.initials || '',
      club_number: payload.specs['club number'] || '',
      grip_make_model_size: payload.specs['grip make/model/size'] || '',
      club_length: payload.specs['club length'] || '',
      shaft_material: payload.specs['shaft material'] || '',
      shaft_make_model: payload.specs['shaft make/model'] || '',
      loft: payload.specs.loft || '',
      flex: payload.specs.flex || '',
      model: payload.specs.model || '',
      manufacturer: payload.specs.manufacturer || '',
      condition: payload.specs.condition || '',
      handedness: payload.specs.handedness || '',
      bounce: payload.specs.bounce || '',
      additional_notes: payload.specs['additional notes'] || ''
    };

    return {
      title: [
        specs.manufacturer,
        specs.model,
        specs.club_number,
        payload.type
      ].filter(Boolean).join(' '),
      productType: payload.type,
      specs: specs,
      sku: payload.sku,
      descriptionHtml: `
        <div>
          <h3>Product Specifications:</h3>
          <ul>
            ${Object.entries(specs)
              .filter(([_, value]) => value)
              .map(([key, value]) => `<li><strong>${key.replace(/_/g, ' ').toUpperCase()}</strong>: ${value}</li>`)
              .join('')}
          </ul>
        </div>
      `,
      vendor: specs.manufacturer || 'Unknown',
      tags: [
        payload.type,
        specs.manufacturer,
        specs.model,
        specs.flex,
        specs.shaft_material,
        specs.condition
      ].filter(Boolean)
    };
  };

  const handleCreateListing = async () => {
    try {
      setIsCreating(true)
      setError(null)

      const productData = transformDataForShopify(payload)
      console.log('Creating listing:', productData)

      const response = await axios.post(`${baseUrl}/create-listing`, productData, {
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.data.success) {
        alert('Listing created successfully!')
        resetClubData()
        navigate('/scan')
      } else {
        throw new Error(response.data.error || 'Failed to create listing')
      }
    } catch (error) {
      console.error('Error creating listing:', error)
      setError(error.response?.data?.message || error.message)
    } finally {
      setIsCreating(false)
    }
  }

  if (!payload) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>No Submission Data</h1>
        <p>It seems there is no data to display. Please try submitting again.</p>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      background: '#fff',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        borderBottom: '2px solid #007AFF',
        paddingBottom: '0.5rem',
        marginBottom: '2rem',
        color: '#333'
      }}>
        Submission Details
      </h1>

      {error && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          background: '#ffebee',
          color: '#d32f2f',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#666', fontSize: '1.2rem', marginBottom: '1rem' }}>
          Product Information
        </h2>
        <div style={{ 
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <strong>SKU:</strong> {payload.sku}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Type:</strong> {payload.type && payload.type.charAt(0).toUpperCase() + payload.type.slice(1)}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#666', fontSize: '1.2rem', marginBottom: '1rem' }}>
          Specifications
        </h2>
        <div style={{ 
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {Object.entries(payload.specs || {}).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '0.5rem' }}>
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{' '}
              {value}
            </div>
          ))}
        </div>
      </div>

      {payload.images && payload.images.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#666', fontSize: '1.2rem', marginBottom: '1rem' }}>
            Images
          </h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            {payload.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product ${index + 1}`}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleCreateListing}
        disabled={isCreating}
        style={{
          background: isCreating ? '#cccccc' : '#007AFF',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '8px',
          border: 'none',
          fontSize: '1.1rem',
          cursor: isCreating ? 'not-allowed' : 'pointer',
          width: '100%',
          marginTop: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        {isCreating ? 'Creating Listing...' : 'Create Shopify Listing'}
      </button>
    </div>
  )
}