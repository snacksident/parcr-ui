// filepath: /src/components/BarcodeScanner.jsx
import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function BarcodeScanner({ onScan }) {
  console.log('BarcodeScanner component rendered'); // Debug log

  useEffect(() => {
    console.log('Initializing Html5QrcodeScanner'); // Debug log

    // Initialize the scanner
    const scanner = new Html5QrcodeScanner('reader', {
      fps: 20,
      qrbox: 250,
    });
    function onScanSuccess(decodedText, decodedResult) {
      // handle the scanned code as you like, for example:
      console.log(`Code matched = ${decodedText}`, decodedResult);
    }
    

    // Render the scanner
    scanner.render(
      (decodedText) => {
        alert('scanned!!!!')
        console.log('Scanned Barcode:', decodedText); // Log the scanned barcode
        onScan(decodedText); // Pass the scanned data to the parent component
      },
      (error) => {
        console.warn('Scanning error:', error); // Log scanning errors
      }
    );

    // Cleanup function to stop the scanner and clear the UI
    return () => {
      console.log('Cleaning up Html5QrcodeScanner'); // Debug log
      scanner.clear().catch((err) => console.error('Error clearing scanner:', err));
    };
  }, [onScan]);

  return <div id="reader" style={{ width: '100%', height: '100%' }} />;
}