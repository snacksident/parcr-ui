import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClubData } from '../context/GlobalStateContext'
import { transformDataForShopify } from '../utils/shopifyTransformer'
import { createProduct, addMetafields, uploadImages } from '../utils/apiService'
import ProductSection from '../components/ProductSection'
import '../App.css'

const baseUrl = 'https://parcr-backend.onrender.com/api'

// Modify the base64ToFile utility function at the top
const base64ToFile = (base64String, index) => {
  try {
    // Remove data URL prefix if present
    const base64WithPrefix = base64String.startsWith('data:image/')
      ? base64String
      : `data:image/jpeg;base64,${base64String}`

    // Extract actual base64 data
    const base64Data = base64WithPrefix.split(',')[1]
    
    // Convert base64 to blob
    const byteString = atob(base64Data)
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    
    const blob = new Blob([ab], { type: 'image/jpeg' });
    return new File([blob], `image${index}.jpg`, { type: 'image/jpeg' })
  } catch (error) {
    console.error('Error converting base64 to file:', error)
    throw error
  }
}

export default function SubmissionDetails() {
  const navigate = useNavigate()
  const { clubData, resetClubData } = useClubData()
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('')

  const handleCreateListing = async () => {
    try {
      setIsCreating(true)
      setError(null)

      setUploadStatus('Creating base listing...')
      const productData = transformDataForShopify(clubData)
      
      const { id: productId } = await createProduct({
        title: productData.title,
        productType: productData.productType,
        sku: productData.sku,
        vendor: productData.vendor,
        tags: productData.tags,
        status: productData.status
      })

      if (productData.metafields?.length > 0) {
        setUploadStatus('Adding product details...')
        await addMetafields(productId, productData.metafields)
      }

      if (clubData.images?.length > 0) {
        setUploadStatus('Uploading images...')
        await uploadImages(productId, clubData.images, base64ToFile)
      }

      setUploadStatus('Success!')
      alert('Listing created successfully!')
      resetClubData()
      navigate('/scan')
    } catch (error) {
      console.error('Error in product creation:', error)
      setError(error.response?.data?.message || error.message)
    } finally {
      setIsCreating(false)
      setUploadStatus('')
    }
  }

  if (!clubData.specs) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>No Submission Data</h1>
        <p>Please complete the specifications form first.</p>
      </div>
    )
  }

  const generateTitle = () => {
    try {
      const shopifyData = transformDataForShopify()
      return shopifyData.title;
    } catch (error) {
      console.error('Error generating title:', error)
      return 'Error generating title'
    }
  }

  return (
    <div className="container">
      <h1 className="pageTitle">Review Submission</h1>
      
      <ProductSection 
        title="Product Information"
        clubData={{
          'Generated Title': generateTitle(),
          'SKU': clubData.sku,
          'Type': clubData.productType,
          'Manufacturer': clubData.manufacturer,
          'Model': clubData.model,
          'Handedness': clubData.specs?.handedness
        }}
      />

      <ProductSection
        title="Specifications"
        clubData={Object.fromEntries(
          Object.entries(clubData.requiredFields)
            .filter(([_, field]) => field.currentValue && typeof field.currentValue === 'string')
            .map(([key, field]) => [
              key.replace(/_/g, ' ').toUpperCase(),
              field.currentValue
            ])
        )}
      />

      {/* Additional Notes */}
      {clubData.preservedFields.additionalNotes && (
        <section className="section">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Additional Notes</h2>
          </div>
          <div className="sectionContent">
            <p style={{ margin: 0, lineHeight: '1.6' }}>{clubData.preservedFields.additionalNotes}</p>
          </div>
        </section>
      )}

      {/* Images */}
      {clubData.images?.length > 0 && (
        <section className="section">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Images ({clubData.images.length})</h2>
          </div>
          <div className="imageGrid">
            {clubData.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Product ${idx + 1}`}
                className="image"
              />
            ))}
          </div>
        </section>
      )}

      {/* Status Messages */}
      {error && <div className="error">{error}</div>}
      {uploadStatus && <div className="status">{uploadStatus}</div>}

      <button
        onClick={handleCreateListing}
        disabled={isCreating}
        className="submitButton"
      >
        {isCreating ? uploadStatus || 'Creating Listing...' : 'Create Shopify Listing'}
      </button>
    </div>
  )
}