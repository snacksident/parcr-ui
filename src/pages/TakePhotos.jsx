// src/pages/TakePhotos.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import CameraView from '../components/CameraView';
import PreviewImage from '../components/PreviewImage';
import OverlaySelector from '../components/OverlaySelector';

export default function TakePhotos() {
  const [capturedImages, setCapturedImages] = useState([]); // Store all captured images
  const [currentStep, setCurrentStep] = useState(1); // Track the current step
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  const handleCapture = (img) => {
    setCapturedImage(img);
  };

  const handleRetake = () => {
    setCapturedImage(null); // Clear the captured image to retake
  };

  const handleAccept = () => {
    // Save the current image
    setCapturedImages((prevImages) => [...prevImages, capturedImage]);
    setCapturedImage(null); // Clear the preview

    // Increment to the next step or navigate to the EnterSpecs page
    if (currentStep < 2) {
      setCurrentStep((prevStep) => prevStep + 1); // Move to the next photo
    } else {
      // Navigate to the EnterSpecs page with captured images
      navigate('/specs', { state: { images: capturedImages } });
    }
  };

  return (
    <div style={{ height: '100vh' }}>
      {!capturedImage ? (
        <>
          <OverlaySelector onSelectOverlay={setSelectedOverlay} />
          <CameraView
            onCapture={handleCapture}
            overlaySrc={selectedOverlay}
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
