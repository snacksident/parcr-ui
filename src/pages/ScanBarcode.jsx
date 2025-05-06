import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import NewBarcodeScanner from '../components/NewBarcodeScanner';

export default function ScanBarcode() {
  console.log('ScanBarcode component rendered'); // Debug log

  const navigate = useNavigate();
  const { clubData, setClubData } = useGlobalState();
  const [manualSKU, setManualSKU] = useState('');
  const [error, setError] = useState(null);

  const handleSave = (barcodeData) => {
    console.log('Scanned Barcode:', barcodeData); // Log the scanned barcode
    setClubData({ ...clubData, sku: barcodeData }); // Save the scanned barcode data
    navigate('/photos'); // Navigate to the photograph step
  };

  const handleManualEntry = () => {
    if (manualSKU.trim()) {
      setClubData({ ...clubData, sku: manualSKU });
      navigate('/photos');
    } else {
      alert('Please enter a valid SKU.');
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Scan Club Barcode</h1>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '70vh',
          marginBottom: '1rem',
          background: 'black',
        }}
      >
        <NewBarcodeScanner onSave={handleSave} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <h3>Or Enter SKU Manually</h3>
        <input
          type="text"
          placeholder="Enter SKU manually"
          value={manualSKU}
          onChange={(e) => setManualSKU(e.target.value)}
          style={{
            marginRight: '0.5rem',
            padding: '0.5rem',
            width: '80%',
            maxWidth: '300px',
          }}
        />
        <button
          onClick={handleManualEntry}
          style={{
            padding: '0.5rem 1rem',
            background: 'green',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Submit SKU
        </button>
      </div>
    </div>
  );
}
