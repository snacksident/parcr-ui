import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClubData } from '../context/GlobalStateContext'
import NewBarcodeScanner from '../components/NewBarcodeScanner'
import axios from 'axios'

const baseUrl = 'https://parcr-backend.onrender.com/api'

export default function ScanBarcode() {
  const navigate = useNavigate()
  const { resetClubData, updateClubData } = useClubData()
  const [manualSKU, setManualSKU] = useState('')
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const getProductTemplate = async (sku) => {
    try {
      console.log('Fetching template for SKU:', sku);
      const response = await axios.get(`${baseUrl}/product-template/${sku}`);
      
      if (response.data.success) {
        const templateData = response.data.data;
        console.log('Template data:', templateData);
        
        // Store all template data in clubData
        updateClubData({
          sku: templateData.sku,
          productType: templateData.productType,
          manufacturer: templateData.manufacturer,
          requiredFields: templateData.requiredFields,
          model: templateData.preservedFields.model,
          specs: {
            putterType: null  // Initialize putterType as null
          }
        });

        navigate('/photos');
      }
    } catch (error) {
      console.error('Error fetching template:', error);
    }
  };

  const handleSave = async (barcodeData) => {
    console.log('Scanned Barcode:', barcodeData)
    await getProductTemplate(barcodeData)
  };

  const handleManualEntry = async () => {
    if (manualSKU) {
      await getProductTemplate(manualSKU)
      setShowModal(false)
    } else {
      setError('Please enter a valid SKU.')
    }
  };

  const handleScan = async (data) => {
    if (data) {
      resetClubData() // Reset all data before starting new scan
      try {
        await getProductTemplate(data)
      } catch (error) {
        console.error('Error processing scan:', error)
      }
    }
  }

  return (
    <div style={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem'
    }}>
      <h1 style={{ margin: '0 0 1rem 0' }}>Scan Club Barcode</h1>
      
      {/* Scanner container with fixed height */}
      <div style={{
        position: 'relative',
        width: '100%',
        flex: '1 1 auto',
        marginBottom: '1rem',
        background: 'black',
        maxHeight: 'calc(100vh - 180px)' // Leave space for header and button
      }}>
        <NewBarcodeScanner onSave={handleScan} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      {/* Button container with fixed position */}
      <div style={{
        position: 'fixed',
        bottom: '1rem',
        left: '0',
        right: '0',
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.9)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#007AFF',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            width: '200px'
          }}
        >
          Enter SKU Manually
        </button>
      </div>
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Enter SKU</h2>
            <input
              type="text"
              placeholder="Enter SKU manually"
              value={manualSKU}
              onChange={(e) => setManualSKU(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '1rem',
              }}
              autoFocus
            />
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#dedede',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleManualEntry}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#007AFF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
