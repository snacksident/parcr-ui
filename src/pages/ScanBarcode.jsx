import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ScanBarcode() {
  const navigate = useNavigate();

  const handleScan = () => {
    // TODO: Add barcode scan functionality
    // barcode will determine what TYPE of club we're processing: (crowned[driver,wood,hybrid], irons/wedges, putter)
    alert('Scanned SKU: CLUB123');
    navigate('/photos');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Scan Club Barcode</h1>
      <button onClick={handleScan}>Simulate Scan</button>
    </div>
  );
}
