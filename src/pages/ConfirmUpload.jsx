import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { buildShopifyPayload } from '../helpers/BuildShopifyPayload';
import Button from '../components/Button';
/**
 * 
 * THIS IS THE FINAL CHECK FOR THE USER TO VERIFY ALL INFORMATION IS CORRECT BEFORE PUSHING THE LISTING TO SHOPIFY.
 */
export default function ConfirmUpload() {
  const { clubData } = useGlobalState();
  const navigate = useNavigate();

  const handleUpload = async () => {
    const payload = buildShopifyPayload(clubData);
    console.log('Payload being sent to Shopify:', payload);

    try {
      const response = await fetch('https://your-shopify-store.myshopify.com/admin/api/2023-04/products.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': 'your-shopify-access-token', // Replace with your token
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Shopify API Response:', result);

      if (result.product) {
        alert('Product created successfully!');
      } else {
        alert('Failed to create product.');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product.');
    }

    // Redirect to the SubmissionDetails page with the payload
    console.log('Redirecting to SubmissionDetails with payload:', payload);
    navigate('/submission-details', { state: { payload } });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Confirm & Upload</h1>
      <Button onClick={handleUpload}>Upload to Shopify</Button>
    </div>
  );
}
