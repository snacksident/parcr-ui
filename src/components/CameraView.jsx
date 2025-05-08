// src/components/CameraView.jsx
import React, { useEffect, useRef, useState } from 'react'
import Overlay from './Overlay'

export default function CameraView({ onCapture, facingMode = 'environment', clubType, step }) {
  const videoRef = useRef(null)
  const [overlayVisible, setOverlayVisible] = useState(true)
  const [streamActive, setStreamActive] = useState(false)

  useEffect(() => {
    let stream = null

    const startCamera = async () => {
      try {
        console.log('Initializing camera...')
        if (videoRef.current && !streamActive) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { 
              facingMode,
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            }
          })
          
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setStreamActive(true)
          console.log('Camera initialized successfully')
        }
      } catch (error) {
        console.error('Error accessing camera:', error)
        setStreamActive(false)
      }
    };

    startCamera();

    // Cleanup function
    return () => {
      if (stream) {
        const tracks = stream.getTracks()
        tracks.forEach(track => {
          track.stop()
          console.log('Camera track stopped')
        });
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        setStreamActive(false);
      }
    };
  }, [facingMode])

  const capturePhoto = () => {
    if (!videoRef.current || !streamActive) {
      console.error('Video stream not available')
      return
    }

    try {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
      const imageData = canvas.toDataURL('image/jpeg')
      onCapture(imageData)
    } catch (error) {
      console.error('Error capturing photo:', error)
    }
  }

  const toggleOverlay = () => {
    setOverlayVisible(prev => !prev);
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <video
        ref={videoRef}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          display: streamActive ? 'block' : 'none'
        }}
        autoPlay
        playsInline
        muted
      />
      
      {!streamActive && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          background: 'rgba(0,0,0,0.7)',
          padding: '1rem',
          borderRadius: '5px'
        }}>
          Initializing camera...
        </div>
      )}

      {overlayVisible && streamActive && <Overlay clubType={clubType} step={step} />}
      
      <button
        onClick={capturePhoto}
        disabled={!streamActive}
        style={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '0.5rem 1rem',
          background: streamActive ? 'white' : '#ccc',
          border: 'none',
          borderRadius: '5px',
          cursor: streamActive ? 'pointer' : 'not-allowed',
          zIndex: 3,
        }}
      >
        Capture
      </button>

      <button
        onClick={toggleOverlay}
        style={{
          position: 'absolute',
          bottom: '4rem',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '0.5rem 1rem',
          background: overlayVisible ? 'red' : 'green',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 3,
        }}
      >
        {overlayVisible ? 'Hide Overlay' : 'Show Overlay'}
      </button>
    </div>
  )
}
