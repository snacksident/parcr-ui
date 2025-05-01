import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';

export default function ScanBarcode() {
  const navigate = useNavigate();
  const { clubData, setClubData } = useGlobalState();
  const [manualSKU, setManualSKU] = useState('');

  const handleScan = () => {
    const scannedSKU = 'CLUB123'; // Simulated scan
    setClubData({ ...clubData, sku: scannedSKU });
    navigate('/photos');
  };

  const handleManualEntry = () => {
    if (manualSKU.trim()) {
      setClubData({ ...clubData, sku: manualSKU });
      navigate('/photos');
    } else {
      alert('Please enter a valid SKU.');
    }
  };

  /**
   * get club info depending on the SKU scanned or entered
   * @param {string} sku - The SKU of the club.
   * @returns {object} - The club data.
   */

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Scan Club Barcode</h1>
      <button onClick={handleScan}>Simulate Scan</button>
      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Enter SKU manually"
          value={manualSKU}
          onChange={(e) => setManualSKU(e.target.value)}
          style={{ marginRight: '0.5rem', padding: '0.5rem' }}
        />
        <button onClick={handleManualEntry}>Submit SKU</button>
      </div>
    </div>
  );
}
