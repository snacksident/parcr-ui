import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalState } from '../context/GlobalStateContext'
import { buildShopifyPayload } from '../helpers/BuildShopifyPayload'
import Button from '../components/Button'

export default function ConfirmUpload() {
  const { clubData } = useGlobalState()
  const navigate = useNavigate()
  const endpoint = 'http://localhost:3000'
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)

  const handleUpload = async () => {
    const testPayload = buildShopifyPayload(clubData)
    console.log('Test Payload:', testPayload)
    try {
      setIsUploading(true)
      setError(null)
      
      // Create and check payload size
      const payload = buildShopifyPayload(clubData)
      delete payload.images // Remove images from payload
      
      const payloadSize = new Blob([JSON.stringify(payload)]).size
      console.log('Payload size (bytes):', payloadSize)
      
      if (payloadSize > 1000000) { // 1MB limit
        throw new Error('Payload too large. Please reduce data size.')
      }

      console.log('Payload being sent to Shopify:', payload)

      const response = await fetch(`${endpoint}/api/create-listing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('Shopify API Response:', result)

      if (result.product) {
        alert('Product created successfully!')
        navigate('/')
      } else {
        throw new Error('Failed to create product')
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Confirm & Upload</h1>
      
      {error && (
        <div style={{ 
          color: 'red', 
          padding: '1rem', 
          marginBottom: '1rem',
          background: '#ffebee',
          borderRadius: '4px'
        }}>
          Error: {error}
        </div>
      )}

      <Button 
        onClick={handleUpload} 
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload to Shopify'}
      </Button>
    </div>
  )
}
