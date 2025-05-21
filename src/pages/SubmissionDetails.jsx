import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClubData } from '../context/GlobalStateContext';
import axios from 'axios';
import '../App.css'; // Add this import

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

  const transformDataForShopify = () => {
    if (!clubData.requiredFields) {
      throw new Error('No specification data available')
    }

    // Create title components array
    const titleComponents = []

    // Add LEFTY prefix if left-handed
    if (clubData.specs?.handedness === 'Left-Handed') {
      titleComponents.push('LEFTY')
    }

    // Add core product info
    if (clubData.model) titleComponents.push(clubData.model)
    if (clubData.manufacturer) titleComponents.push(clubData.manufacturer)
    //STRIP DOWN CLUB NUMBER (REMOVE HYPHEN AS NECESSARY - ONLY FOR TITLE)

    // Add specs in order
    const specsToAdd = [
      clubData.requiredFields.club_number?.currentValue,
      clubData.requiredFields.flex?.currentValue,
      clubData.requiredFields.shaft_make_model?.currentValue,
      clubData.requiredFields.item_length?.currentValue ? `${clubData.requiredFields.item_length.currentValue}"` : null,
      clubData.requiredFields.condition?.currentValue,
    ]

    titleComponents.push(...specsToAdd.filter(Boolean))

    // Create custom label
    const customLabel = [
      clubData.sku,
      clubData.requiredFields.custom_label?.currentValue,
      clubData.requiredFields.location_tag?.currentValue
    ].filter(Boolean).join(' ')

    // Format metafields for Shopify - ensure all fields are included
    const metafields = []

    // Add preserved fields as metafields
    if (clubData.preservedFields) {
      const preservedFieldMappings = {
        manufacturer: 'club_manufacturer',
        golfClubType: 'golf_club_type',
        model: 'model'
      }

      Object.entries(preservedFieldMappings).forEach(([key, metafieldKey]) => {
        if (clubData.preservedFields[key]) {
          metafields.push({
            key: metafieldKey,
            value: clubData.preservedFields[key],
            type: 'single_line_text_field',
            namespace: 'custom'
          })
        }
      })
    }

    // Add all required fields as metafields
    Object.entries(clubData.requiredFields).forEach(([key, field]) => {
      if (field.currentValue && typeof field.currentValue === 'string') {
        metafields.push({
          key: key,
          value: field.currentValue,
          type: "single_line_text_field",
          namespace: "custom"
        })
      }
    })

    // Add location tag if it exists
    if (clubData.requiredFields.location_tag?.currentValue) {
      metafields.push({
        key: 'location_tag',
        value: clubData.requiredFields.location_tag.currentValue,
        type: 'single_line_text_field',
        namespace: 'custom'
      })
    }

    // Add handedness from specs
    if (clubData.specs?.handedness) {
      metafields.push({
        key: 'handedness',
        value: clubData.specs.handedness,
        type: 'single_line_text_field',
        namespace: 'custom'
      })
    }

    // Add additional notes if present
    if (clubData.preservedFields.additionalNotes) {
      metafields.push({
        key: 'additional_notes',
        value: clubData.preservedFields.additionalNotes,
        type: 'single_line_text_field',
        namespace: 'custom'
      })
    }

    if (clubData.manufacturer) {
      metafields.push({
        key: 'club_manufacturer',
        value: clubData.manufacturer,
        type: 'single_line_text_field',
        namespace: 'custom'
      })
    }

    if (clubData.model) { 
      metafields.push({
        key: 'model',
        value: clubData.model,
        type: 'single_line_text_field',
        namespace: 'custom'
      })
    }

    // Add debugging log
    console.log('Prepared metafields:', metafields)

    return {
      title: titleComponents.filter(Boolean).join(' '),
      productType: clubData.productType,
      metafields: metafields,
      sku: clubData.sku,
      vendor: clubData.manufacturer || 'Unknown',
      tags: [
        clubData.productType,
        clubData.manufacturer,
        clubData.model,
        clubData.requiredFields.flex?.currentValue,
        clubData.requiredFields.shaft_material?.currentValue,
        customLabel
      ].filter(Boolean),
      status: 'DRAFT',
      options: [{
        name: 'Condition',
        values: [clubData.requiredFields.condition?.currentValue]
      }]
    }
  }

  const handleCreateListing = async () => {
    try {
      setIsCreating(true)
      setError(null)

      // Step 1: Create basic product
      setUploadStatus('Creating base listing...')
      const productData = transformDataForShopify()
      console.log('Sending initial product data:', productData)

      const createResponse = await axios.post(`${baseUrl}/create-listing`, {
        title: productData.title,
        productType: productData.productType,
        sku: productData.sku,
        vendor: productData.vendor,
        tags: productData.tags,
        status: productData.status
      })

      console.log('Create product response:', createResponse.data)

      if (!createResponse.data.success) {
        throw new Error(createResponse.data.error || 'Failed to create listing')
      }

      const productId = createResponse.data.data.id
      console.log('Created product ID:', productId)

      // Step 2: Add metafields
      if (productData.metafields?.length > 0) {
        setUploadStatus('Adding product details...')
        console.log('Adding metafields:', productData.metafields)
        
        await axios.post(`${baseUrl}/add-product-metafields`, {
          productId: productId,
          metafields: productData.metafields
        })
      }

      // Step 3: Add images
      if (clubData.images?.length > 0) {
        setUploadStatus('Uploading images...')
        const formData = new FormData()
        formData.append('productId', productId)

        // Convert base64 images to files and append to formData
        for (let i = 0; i < clubData.images.length; i++) {
          const file = base64ToFile(clubData.images[i], i)
          formData.append('images', file)
        }

        console.log('Uploading images for product:', productId);
        await axios.post(`${baseUrl}/add-product-images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 60000
        })
      }

      // Success
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
      
      <section className="section">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Product Information</h2>
        </div>
        <div className="sectionContent">
          <div className="infoRow">
            <span className="label">Generated Title:</span>
            <span className="value">{generateTitle()}</span>
          </div>
          <div className="infoRow">
            <span className="label">SKU:</span>
            <span className="value">{clubData.sku}</span>
          </div>
          <div className="infoRow">
            <span className="label">Type:</span>
            <span className="value">{clubData.productType}</span>
          </div>
          <div className="infoRow">
            <span className="label">Manufacturer:</span>
            <span className="value">{clubData.manufacturer}</span>
          </div>
          <div className="infoRow">
            <span className="label">Model:</span>
            <span className="value">{clubData.model}</span>
          </div>
          <div className="infoRow">
            <span className="label">Handedness:</span>
            <span className="value">{clubData.specs?.handedness}</span>
          </div>
        </div>
      </section>

      {/* Preserved Fields Section */}
      {/* <section className="section">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Template Information</h2>
        </div>
        <div className="sectionContent">
          {Object.entries(clubData.preservedFields)
            .filter(([key, value]) => value && key !== 'additionalNotes')
            .map(([key, value]) => (
              <div key={key} className="infoRow">
                <span className="label">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
                <span className="value">{value}</span>
              </div>
            ))
          }
        </div>
      </section> */}

      {/* Required Fields Section */}
      <section className="section">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Specifications</h2>
        </div>
        <div className="sectionContent">
          {Object.entries(clubData.requiredFields)
            .filter(([_, field]) => field.currentValue && typeof field.currentValue === 'string')
            .map(([key, field]) => (
              <div key={key} className="infoRow">
                <span className="label">{key.replace(/_/g, ' ').toUpperCase()}</span>
                <span className="value">{field.currentValue}</span>
              </div>
            ))
          }
        </div>
      </section>

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
  );
}