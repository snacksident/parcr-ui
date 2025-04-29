// src/pages/TakePhotos.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import CameraView from '../components/CameraView';
import PreviewImage from '../components/PreviewImage';

export default function TakePhotos() {
  const { clubData, setClubData } = useGlobalState();
  const [currentStep, setCurrentStep] = useState(1); // Track the current step
  const [useOverlay, setUseOverlay] = useState(true); // Toggle for overlay usage
  const [capturedImage, setCapturedImage] = useState(null);
  const navigate = useNavigate();

  const overlayImages = [
    '/src/assets/wedge1.webp',
    '/src/assets/wedge2.webp',
    '/src/assets/wedge3.webp',
    '/src/assets/wedge4.webp',
    '/src/assets/wedge5.webp',
    '/src/assets/wedge6.webp',
    '/src/assets/wedge7.webp',
    '/src/assets/wedge8.webp',
  ];

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
            overlaySrc={useOverlay ? overlayImages[currentStep - 1] : null}
            facingMode="environment"
          />
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
