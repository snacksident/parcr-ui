/**
 * Barcode scanner using the Quagga library. Handles requesting camera permissions BEFORE initializing the scanner.
 * Displays a placeholder view until permissions are granted. Once a barcode is scanned, saves the SKU and redirects to the next step (photographs).
 */

import React, { useEffect, useState } from 'react';
import Quagga from 'quagga'; // Import Quagga library
import { useNavigate } from 'react-router-dom';

export default function NewBarcodeScanner({ onSave }) {
  const [permissionsGranted, setPermissionsGranted] = useState(false); // Track camera permissions
  const navigate = useNavigate();

  useEffect(() => {
    // Request camera permissions
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        console.log('Camera permissions granted');
        setPermissionsGranted(true); // Update state to render the scanner
      })
      .catch((err) => {
        console.error('Camera permissions denied:', err);
        alert('Camera permissions are required to scan barcodes. Please enable them in your browser settings.');
      });
  }, []);

  useEffect(() => {
    if (!permissionsGranted) return;

    // Initialize Quagga
    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: document.querySelector('#reader'), // Attach the scanner to the #reader div
          constraints: {
            facingMode: 'environment', // Use the back camera
          },
        },
        decoder: {
          readers: ['code_128_reader', 'code_39_reader', 'ean_reader'], // Supported barcode formats
        },
        locate: true, // Enable barcode localization
      },
      (err) => {
        if (err) {
          console.error('Error initializing Quagga:', err);
          return;
        }
        console.log('Quagga initialized');
        Quagga.start(); // Start the scanner
      }
    );

    // Handle barcode detection
    Quagga.onDetected((data) => {
      console.log('Scanned Barcode:', data.codeResult.code); // Log the scanned barcode
      onSave(data.codeResult.code); // Save the scanned data
      alert(`scanned barcode: ${data.codeResult.code}`); // Alert the scanned barcode
      Quagga.stop(); // Stop the scanner after a successful scan
    //   navigate('/photos'); // Navigate to the photograph step
    });

    // Cleanup function to stop Quagga
    return () => {
      Quagga.stop();
      console.log('Quagga stopped');
    };
  }, [permissionsGranted, onSave, navigate]);

  return (
    <div>
      <h1>Scan Barcode</h1>
      {!permissionsGranted ? (
        <div
          style={{
            width: '100%',
            height: '300px',
            backgroundColor: 'gray',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <p>Waiting for camera permissions...</p>
        </div>
      ) : (
        <div id="reader" style={{ width: '100%', height: '300px', margin: 'auto' }}></div>
      )}
    </div>
  );
}