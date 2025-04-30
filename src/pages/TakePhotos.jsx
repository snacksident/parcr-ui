// src/pages/TakePhotos.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import CameraView from '../components/CameraView';
import PreviewImage from '../components/PreviewImage';

export default function TakePhotos() {
  const { clubData, setClubData } = useGlobalState();
  const [currentStep, setCurrentStep] = useState(1); // Track the current step
  const [useOverlay, setUseOverlay] = useState(false); // Toggle for overlay usage
  const [capturedImage, setCapturedImage] = useState(null);
  const navigate = useNavigate();
  clubData.type = 'driver'

  const overlayImages = {
    'wedge': [
      '/assets/wedge1.webp',
      '/assets/wedge2.webp',
      '/assets/wedge3.webp',
      '/assets/wedge4.webp',
      '/assets/wedge5.webp',
      '/assets/wedge6.webp',
      '/assets/wedge7.webp',
      '/assets/wedge8.webp',
    ],
    'driver': [
      '/assets/driver1.webp',
      '/assets/driver2.webp',
      '/assets/driver3.webp',
      '/assets/driver4.webp',
      '/assets/driver5.webp',
      '/assets/driver6.webp',
      '/assets/driver7.webp',
      '/assets/driver8.webp',
      '/assets/driver9.webp',
      '/assets/driver10.webp',
      '/assets/driver11.webp',
    ],
    'putter': [
      '/assets/putter1.webp',
      '/assets/putter2.webp',
      '/assets/putter3.webp',
      '/assets/putter4.webp',
      '/assets/putter5.webp',
      '/assets/putter6.webp',
      '/assets/putter7.webp',
      '/assets/putter8.webp',
      '/assets/putter9.webp',
    ],
  };

  const handleCapture = (img) => {
    setCapturedImage(img);
  };

  const handleRetake = () => {
    setCapturedImage(null); // Clear the captured image to retake
  };

  const handleAccept = () => {
    // Save the current image
    const updatedImages = [...(clubData.images || []), capturedImage];
    setClubData({ ...clubData, images: updatedImages });
    setCapturedImage(null); // Clear the preview

    // Increment to the next step or navigate to the EnterSpecs page
    if (currentStep < 8) {
      setCurrentStep((prevStep) => prevStep + 1); // Move to the next photo
    } else {
      navigate('/specs');
    }
  };

  const toggleOverlay = () => {
    setUseOverlay((prev) => !prev); // Toggle overlay usage
    console.log(`src = ${overlayImages[clubData.type][currentStep - 1]}`)
  };

  return (
    <div style={{ height: '100vh' }}>
      {!capturedImage ? (
        <>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <button onClick={toggleOverlay}>
              {useOverlay ? 'Disable Overlay' : 'Enable Overlay'}
            </button>
          </div>
          <CameraView
            onCapture={handleCapture}
            facingMode="environment"
          />
          {useOverlay && (
            <img
              src={overlayImages[clubData.type][currentStep - 1]}
              alt="Overlay"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                zIndex: 2,
                pointerEvents: 'none',
                opacity: 0.3, // Adjust transparency
              }}
            />
          )}
          <p style={{ textAlign: 'center' }}>Step {currentStep} of 8</p>
        </>
      ) : (
        <PreviewImage
          imageSrc={capturedImage}
          onRetake={handleRetake}
          onAccept={handleAccept}
        />
      )}
    </div>
  );
}
