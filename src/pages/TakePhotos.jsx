// src/pages/TakePhotos.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClubData } from '../hooks/useClubData';
import CameraView from '../components/CameraView';
import PreviewImage from '../components/PreviewImage';
import Overlay from '../components/Overlay';
import { getOverlayImage } from '../utils/overlayUtils';

/**
 * 
 * TAKEPHOTOS WILL BE USED TO CAPTURE IMAGES OF THE CLUB, DEPENDING ON THE TYPE.  WE WILL CONFIRM THE SKU WITH SHOPIFY, WHICH WILL RETURN US DATA ON WHICH TYPE OF CLUB IS BEING PROCESSED, AND WILL PROVIDE A SPECIFIC OVERLAY AND IMAGE COUNT, FOR THAT TYPE OF CLUB.
 */
export default function TakePhotos() {
  const { clubData, updateClubData } = useClubData();
  const [currentStep, setCurrentStep] = useState(1); // Track the current step
  const [useOverlay, setUseOverlay] = useState(false); // Toggle for overlay usage
  const [capturedImage, setCapturedImage] = useState(null);
  const navigate = useNavigate();

  const handleCapture = (img) => {
    setCapturedImage(img);
  };

  const handleRetake = () => {
    setCapturedImage(null); // Clear the captured image to retake
  };

  const handleAccept = () => {
    // Save the current image
    const updatedImages = [...(clubData.images || []), capturedImage];
    updateClubData({ images: updatedImages });
    setCapturedImage(null); // Clear the preview

    // Increment to the next step or navigate to the EnterSpecs page
    if (currentStep < 2) {
      setCurrentStep((prevStep) => prevStep + 1); // Move to the next photo
    } else {
      navigate('/specs');
    }
  };

  const toggleOverlay = () => {
    setUseOverlay((prev) => !prev); // Toggle overlay usage
  };

  const overlaySrc = getOverlayImage(clubData.type, currentStep);

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
            <Overlay
              src={overlaySrc}
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
