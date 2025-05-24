import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClubData } from '../context/GlobalStateContext'
import { transformDataForShopify } from '../utils/shopifyTransformer'
import { createProduct, addMetafields, uploadImages, getRecommendedPrice } from '../utils/apiService'
import ProductSection from '../components/ProductSection'
import '../App.css'

export default function SubmissionDetails() {
  const navigate = useNavigate()
  const { clubData, updateClubData, resetClubData } = useClubData()
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('')

  useEffect(() => {
    // const fetchRecommendedPrice = async () => {
    //   try {
    //     const condition = clubData.requiredFields.condition.currentValue
    //     const price = await getRecommendedPrice(clubData.sku, condition)
        
    //     updateClubData({
    //       ...clubData,
    //       recommendedPrice: price
    //     })
    //   } catch (error) {
    //     console.error('Failed to fetch recommended price:', error)
    //     setError('Failed to fetch recommended price')
    //   }
    // }

    // if (clubData.sku && !clubData.recommendedPrice) {
    //   fetchRecommendedPrice()
    // }
  }, [clubData.sku])

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
        await uploadImages(productId, clubData.images)
      }

      setUploadStatus('Success!')
      alert('Listing created successfully!')
      resetClubData() // Reset after successful creation
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
      const shopifyData = transformDataForShopify(clubData)
      return shopifyData.title;
    } catch (error) {
      console.error('Error generating title:', error)
      return 'Title will be generated on submission'
    }
  }

  return (
    <div className="container">
      <h1 className="pageTitle">Review Submission</h1>
      
      <ProductSection 
        title="Product Information"
        clubData={{
          ...(generateTitle() ? { 'Generated Title': generateTitle() } : {}),
          'SKU': clubData.sku,
          'Type': clubData.productType,
          'Manufacturer': clubData.manufacturer,
          'Model': clubData.model,
          'Handedness': clubData.specs?.handedness,
          ...(clubData.recommendedPrice ? { 'Recommended Price': `$${clubData.recommendedPrice.toFixed(2)}` } : {})
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