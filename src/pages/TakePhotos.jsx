// src/pages/TakePhotos.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClubData } from '../hooks/useClubData';
import CameraView from '../components/CameraView';
import PreviewImage from '../components/PreviewImage';

/**
 * TAKEPHOTOS WILL BE USED TO CAPTURE IMAGES OF THE CLUB, DEPENDING ON THE TYPE.
 */
export default function TakePhotos() {
  const { clubData, updateClubData } = useClubData()
  const [currentStep, setCurrentStep] = useState(1)
  const [capturedImage, setCapturedImage] = useState(null)
  const navigate = useNavigate()

  const handleCapture = (img) => {
    setCapturedImage(img)
  };

  const handleRetake = () => {
    setCapturedImage(null)
  };

  const handleAccept = () => {
    // Save the current image
    const updatedImages = [...(clubData.images || []), capturedImage]
    updateClubData({ images: updatedImages })
    setCapturedImage(null)

    // Increment to the next step or navigate to the EnterSpecs page
    if (currentStep < 8) {
      setCurrentStep((prevStep) => prevStep + 1)
    } else {
      navigate('/specs')
    }
  };

  return (
    <div style={{ height: '100vh' }}>
      {!capturedImage ? (
        <>
          <CameraView
            onCapture={handleCapture}
            facingMode="environment"
            clubType={clubData.type} // Pass the club type
            step={currentStep} // Pass the current step
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
  )
}
