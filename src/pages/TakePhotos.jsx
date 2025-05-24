// src/pages/TakePhotos.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClubData } from '../context/GlobalStateContext'
import CameraView from '../components/CameraView'
import PreviewImage from '../components/PreviewImage'
import Overlay from '../components/Overlay'

/**
 * TAKEPHOTOS WILL BE USED TO CAPTURE IMAGES OF THE CLUB, DEPENDING ON THE TYPE.
 */
export default function TakePhotos() {
  const { clubData, updateClubData } = useClubData()
  // Remove local currentStep state since it's now in context
  const [capturedImage, setCapturedImage] = useState(null)
  const [showHandednessPrompt, setShowHandednessPrompt] = useState(true)
  const [showPutterTypePrompt, setShowPutterTypePrompt] = useState(false)
  const [showHeadcoverPrompt, setShowHeadcoverPrompt] = useState(false)
  const [overlayType, setOverlayType] = useState(null)
  const [hasHeadcover, setHasHeadcover] = useState(false)
  const navigate = useNavigate()

  // Helper function to check if club type needs headcover prompt
  const needsHeadcoverPrompt = (type) => {
    const typesWithHeadcovers = [
      'drivers',
      'fairway woods',
      'hybrids',
      'iron sets',
      'putters',
    ]
    return typesWithHeadcovers.includes(type?.toLowerCase())
  }

  // Add this helper function near the top of the file after the initial imports
  const getMaxSteps = (productType, hasHeadcover) => {
    const baseSteps = (() => {
      switch (productType?.toLowerCase()) {
        case 'drivers':
        case 'fairway woods':
        case 'hybrids':
        case 'wedges':
        case 'putters':
        case 'individual irons':
          return 10
        case 'iron sets':
          return 11
        default:
          return 10 // fallback
      }
    })()

    return hasHeadcover ? baseSteps + 1 : baseSteps
  }

  // Update handlers to use context
  const handleHandednessSelect = (handedness) => {
    updateClubData({
      ...clubData,
      currentStep: 1, // Set initial step
      requiredFields: {
        ...clubData.requiredFields,
        handedness: handedness
      },
      specs: {
        ...clubData.specs,
        handedness: handedness
      }
    })

    setShowHandednessPrompt(false)
    
    if (needsHeadcoverPrompt(clubData.productType)) {
      setShowHeadcoverPrompt(true)
    } else if (clubData.productType?.toLowerCase() === 'putters') {
      setShowPutterTypePrompt(true)
    }
  }

  const handlePutterTypeSelect = (type) => {
    console.log('Setting putter type:', type)
    
    // Update clubData with putter type
    updateClubData({
      ...clubData,
      specs: {
        ...clubData.specs,
        putterType: type
      }
    })
    
    setOverlayType(type)
    setShowPutterTypePrompt(false)
    setCurrentStep(1)
  }

  const handleHeadcoverSelect = (hasHeadcover) => {
    setHasHeadcover(hasHeadcover)
    
    // Update clubData with headcover information
    updateClubData({
      ...clubData,
      requiredFields: {
        ...clubData.requiredFields,
        head_cover_included: {
          key: 'head_cover_included',
          type: 'single_line_text_field',
          namespace: 'custom',
          currentValue: hasHeadcover ? 'Yes' : 'No'
        }
      }
    })

    setShowHeadcoverPrompt(false);
    
    // Continue flow
    if (clubData.productType?.toLowerCase() === 'putters') {
      setShowPutterTypePrompt(true);
    } else {
      setCurrentStep(1);
    }
  }

  useEffect(() => {
    console.log('Current clubData:', {
      handedness: clubData.requiredFields?.handedness,
      putterType: clubData.specs?.putterType,
      allSpecs: clubData.specs
    })
  }, [clubData.specs])

  const handleCapture = (img) => {
    setCapturedImage(img)
  }

  const handleRetake = () => {
    setCapturedImage(null)
  }

  // Then modify the handleAccept function to use this new logic:
  const handleAccept = () => {
    const updatedImages = [...(clubData.images || []), capturedImage]
    const maxSteps = getMaxSteps(clubData.productType, hasHeadcover)
    
    updateClubData({
      ...clubData,
      images: updatedImages,
      currentStep: clubData.currentStep + 1
    })
    
    setCapturedImage(null)

    if (clubData.currentStep >= maxSteps) {
      navigate('/specs')
    }
  }

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
    )
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
    )
  }

  if (showHeadcoverPrompt) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <h2 style={{ marginBottom: '2rem' }}>Does this club include a headcover?</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => handleHeadcoverSelect(true)}
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
            Yes
          </button>
          <button
            onClick={() => handleHeadcoverSelect(false)}
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
            No
          </button>
        </div>
      </div>
    )
  }

  // Update the render section to use context
  return (
    <div style={{ height: '100vh' }}>
      {!capturedImage ? (
        <>
          <CameraView
            onCapture={handleCapture}
            facingMode="environment"
            clubType={clubData.productType}
            step={clubData.currentStep} // Use step from context
          >
            <Overlay /> {/* Overlay now gets step from context */}
          </CameraView>
          {/* Update the step counter display in the render section
          Replace the existing step counter with: */}
          <p style={{ textAlign: 'center' }}>
            Step {clubData.currentStep} of {getMaxSteps(clubData.productType, hasHeadcover)}
            {hasHeadcover && clubData.currentStep === getMaxSteps(clubData.productType, hasHeadcover) && ' (Headcover Photo)'}
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
  )
}
