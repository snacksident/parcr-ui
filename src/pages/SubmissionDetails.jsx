import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClubData } from '../context/GlobalStateContext'
import axios from 'axios'

const baseUrl = 'https://parcr-backend.onrender.com/api'

// Modify the base64ToFile utility function at the top
const base64ToFile = (base64String, index) => {
  try {
    // Remove data URL prefix if present
    const base64WithPrefix = base64String.startsWith('data:image/')
      ? base64String
      : `data:image/jpeg;base64,${base64String}`;

    // Extract actual base64 data
    const base64Data = base64WithPrefix.split(',')[1];
    
    // Convert base64 to blob
    const byteString = atob(base64Data);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    const blob = new Blob([ab], { type: 'image/jpeg' });
    return new File([blob], `image${index}.jpg`, { type: 'image/jpeg' });
  } catch (error) {
    console.error('Error converting base64 to file:', error);
    throw error;
  }
};

export default function SubmissionDetails() {
  const navigate = useNavigate()
  const { clubData, resetClubData } = useClubData()
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('')

  const transformDataForShopify = () => {
    if (!clubData.specs) {
      throw new Error('No specification data available');
    }

    // Create title components array
    const titleComponents = [];
    
    // Add LEFTY prefix if left-handed
    if (clubData.specs.handedness?.toLowerCase() === 'left-handed') {
      titleComponents.push('LEFTY');
    }

    // Add core product info
    if (clubData.specs.model) titleComponents.push(clubData.specs.model);
    if (clubData.manufacturer) titleComponents.push(clubData.manufacturer);
    
    // Add shaft info
    if (clubData.specs.flex) titleComponents.push(clubData.specs.flex);
    if (clubData.specs.shaft_material) titleComponents.push(clubData.specs.shaft_material);
    
    // Add length for specific club types
    const singleClubTypes = ['irons', 'wedges', 'putters'];
    if (singleClubTypes.includes(clubData.productType?.toLowerCase()) && clubData.specs.item_length) {
      titleComponents.push(`${clubData.specs.item_length}"`);
    }
    
    // Add condition
    if (clubData.specs.condition) titleComponents.push(clubData.specs.condition);

    // Create custom label
    const customLabel = [
      clubData.sku,
      clubData.specs.custom_label,
      clubData.specs.location_tag
    ].filter(Boolean).join(' - ');

    return {
      title: titleComponents.filter(Boolean).join(' '),
      productType: clubData.productType,
      specs: {
        ...clubData.specs,
        custom_label: customLabel
      },
      sku: clubData.sku,
      descriptionHtml: `
        <div>
          <h3>Product Specifications:</h3>
          <ul>
            ${Object.entries(clubData.specs)
              .filter(([key, value]) => value && key !== 'location_tag') // Exclude location_tag from description
              .map(([key, value]) => `<li><strong>${key.replace(/_/g, ' ').toUpperCase()}</strong>: ${value}</li>`)
              .join('')}
          </ul>
        </div>
      `,
      vendor: clubData.manufacturer || 'Unknown',
      tags: [
        clubData.productType,
        clubData.manufacturer,
        clubData.specs.model,
        clubData.specs.flex,
        clubData.specs.shaft_material,
        clubData.specs.condition,
        clubData.specs.handedness,
        customLabel
      ].filter(Boolean)
    };
  };

  const handleCreateListing = async () => {
    try {
      setIsCreating(true);
      setError(null);
      setUploadStatus('Creating listing...');

      const productData = transformDataForShopify();
      console.log('Sending product data:', productData);

      const response = await axios.post(`${baseUrl}/create-listing`, productData, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('Server response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to create listing');
      }

      // Extract the numeric productId from the nested data object
      const productId = response.data.data.productId;
      console.log('Extracted productId:', productId);

      if (!productId) {
        throw new Error('No product ID received from server');
      }

      if (clubData.images?.length > 0) {
        setUploadStatus('Uploading images...');
        await handleImageUpload(productId);
      }

      // Success
      alert('Listing created successfully!');
      resetClubData();
      navigate('/scan');
    } catch (error) {
      console.error('Error creating listing:', error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setIsCreating(false);
      setUploadStatus('');
    }
  };

  const handleImageUpload = async (productId) => {
    try {
      // Ensure productId is a string and extract only the numeric part if needed
      const cleanId = String(productId).split('/').pop();
      console.log('Clean ID for image upload:', cleanId);

      const formData = new FormData();
      formData.append('productId', cleanId);

      // Debug log the actual value being sent
      console.log('FormData productId value:', formData.get('productId'));

      // Add images to formData
      clubData.images.forEach((base64String, index) => {
        const file = base64ToFile(base64String, index);
        formData.append('images', file);
      });

      const response = await axios.post(`${baseUrl}/add-product-images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      });

      console.log('Image upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
      throw error;
    }
  };

  if (!clubData.specs) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>No Submission Data</h1>
        <p>Please complete the specifications form first.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Review Submission</h1>
      
      {/* Basic Info */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Product Information</h2>
        <div>
          <strong>SKU:</strong> {clubData.sku}<br />
          <strong>Type:</strong> {clubData.productType}<br />
          <strong>Manufacturer:</strong> {clubData.manufacturer}
        </div>
      </section>

      {/* Specifications */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Specifications</h2>
        {Object.entries(clubData.specs).map(([key, value]) => (
          <div key={key}>
            <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {value}
          </div>
        ))}
      </section>

      {/* Images */}
      {clubData.images?.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2>Images ({clubData.images.length})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
            {clubData.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Product ${idx + 1}`}
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Status Messages */}
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      {uploadStatus && <div style={{ marginBottom: '1rem' }}>{uploadStatus}</div>}

      {/* Submit Button */}
      <button
        onClick={handleCreateListing}
        disabled={isCreating}
        style={{
          width: '100%',
          padding: '1rem',
          background: isCreating ? '#ccc' : '#007AFF',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: isCreating ? 'not-allowed' : 'pointer'
        }}
      >
        {isCreating ? uploadStatus || 'Creating Listing...' : 'Create Shopify Listing'}
      </button>
    </div>
  );
}