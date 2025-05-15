// src/pages/TakePhotos.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClubData } from '../context/GlobalStateContext';
import CameraView from '../components/CameraView';
import PreviewImage from '../components/PreviewImage';
import Overlay from '../components/Overlay';

/**
 * TAKEPHOTOS WILL BE USED TO CAPTURE IMAGES OF THE CLUB, DEPENDING ON THE TYPE.
 */
export default function TakePhotos() {
  const { clubData, updateClubData } = useClubData();
  const [currentStep, setCurrentStep] = useState(0); // Start at 0 for prompts
  const [capturedImage, setCapturedImage] = useState(null);
  const [showHandednessPrompt, setShowHandednessPrompt] = useState(true);
  const [showPutterTypePrompt, setShowPutterTypePrompt] = useState(false);
  const [overlayType, setOverlayType] = useState(null);
  const navigate = useNavigate();

  const handleHandednessSelect = (handedness) => {
    console.log('Setting handedness:', handedness);
    
    // Update clubData with handedness - no need to uppercase since we're passing correct format
    updateClubData({
      ...clubData,
      specs: {
        ...clubData.specs,
        handedness: handedness
      }
    });

    setShowHandednessPrompt(false);
    
    // Show putter type prompt only for putters
    if (clubData.productType?.toLowerCase() === 'putters') {
      setShowPutterTypePrompt(true);
    } else {
      setCurrentStep(1);
    }
  };

  const handlePutterTypeSelect = (type) => {
    console.log('Setting putter type:', type);
    
    // Update clubData with putter type
    updateClubData({
      ...clubData,
      specs: {
        ...clubData.specs,
        putterType: type
      }
    });
    
    setOverlayType(type);
    setShowPutterTypePrompt(false);
    setCurrentStep(1);
  };

  useEffect(() => {
    console.log('Current clubData:', {
      handedness: clubData.specs?.handedness,
      putterType: clubData.specs?.putterType,
      allSpecs: clubData.specs
    });
  }, [clubData.specs]);

  const handleCapture = (img) => {
    setCapturedImage(img);
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleAccept = () => {
    const updatedImages = [...(clubData.images || []), capturedImage];
    updateClubData({
      images: updatedImages,
      sku: clubData.sku,
      productType: clubData.productType,
      manufacturer: clubData.manufacturer,
      requiredFields: clubData.requiredFields,
      specs: {
        ...clubData.specs
      }
    });
    setCapturedImage(null);

    if (currentStep < 8) {
      setCurrentStep(prev => prev + 1);
    } else {
      navigate('/specs');
    }
  };

  // Render prompts or camera view
  if (showHandednessPrompt) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <h2 style={{ marginBottom: '2rem' }}>Is this a right or left handed club?</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => handleHandednessSelect('Right-Handed')}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              background: '#007AFF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Right Handed
          </button>
          <button
            onClick={() => handleHandednessSelect('Left-Handed')}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              background: '#007AFF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Left Handed
          </button>
        </div>
      </div>
    );
  }

  if (showPutterTypePrompt) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <h2 style={{ marginBottom: '2rem' }}>What type of putter is this?</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => handlePutterTypeSelect('blade')}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              background: '#007AFF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Blade
          </button>
          <button
            onClick={() => handlePutterTypeSelect('mallet')}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              background: '#007AFF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Mallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh' }}>
      {!capturedImage ? (
        <>
          <CameraView
            onCapture={handleCapture}
            facingMode="environment"
            clubType={clubData.productType}
            step={currentStep}
          >
            <Overlay
              clubType={clubData.productType}
              step={currentStep}
              handedness={clubData.specs?.handedness}
              putterType={clubData.specs?.putterType}  // Use from global state
            />
          </CameraView>
          <p style={{ textAlign: 'center' }}>
            Step {currentStep} of {clubData.productType?.toLowerCase() === 'putters' ? '3' : '8'}
          </p>
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
