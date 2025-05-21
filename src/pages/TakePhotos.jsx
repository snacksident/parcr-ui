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
      'woods',
      'hybrids',
      'iron sets',
      'putters'
    ]
    return typesWithHeadcovers.includes(type?.toLowerCase())
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

  const handleAccept = () => {
    const updatedImages = [...(clubData.images || []), capturedImage]
    const baseSteps = clubData.productType?.toLowerCase() === 'putters' ? 3 : 8
    const maxSteps = hasHeadcover ? baseSteps + 1 : baseSteps
    
    updateClubData({
      ...clubData,
      images: updatedImages,
      currentStep: clubData.currentStep + 1 // Increment step in context
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
          <p style={{ textAlign: 'center' }}>
            Step {clubData.currentStep} of {
              clubData.productType?.toLowerCase() === 'putters' 
                ? (hasHeadcover ? '4' : '3')
                : (hasHeadcover ? '9' : '8')
            }
            {clubData.currentStep === (clubData.productType?.toLowerCase() === 'putters' ? 4 : 9) && 
              hasHeadcover && ' (Headcover Photo)'}
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
