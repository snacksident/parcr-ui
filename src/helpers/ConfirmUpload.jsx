import React from 'react'

export default function ConfirmUpload() {
  const handleUpload = async () => {
    const productData = {
      title: 'New Club Listing',
      description: '<p>This is a new club listing.</p>',
      images: ['https://example.com/image1.jpg'], // Replace with actual image URLs
      variants: [{ option1: 'Default Title', price: '100.00' }],
    }

    try {
      const response = await fetch('http://localhost:5000/shopify/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      const result = await response.json();
      if (result.product) {
        alert('Draft product created successfully!')
      } else {
        alert('Failed to create product.')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Failed to create product.')
    }
  }

  return (
    <div>
      <h1>Confirm & Upload</h1>
      <Button onClick={handleUpload}>Upload to Shopify</Button>
    </div>
  )
}